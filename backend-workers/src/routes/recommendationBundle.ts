// src/routes/recommendationBundle.ts
import type {
  Env,
  SkinProfile,
  SkinAnalysis,
  SkinAnalysisResponse,
  CycleLifestyleInput,
  Product,
  IngredientInfo,
  PriceComparisonResult,
  StorePrice,
  Routine,
  Level,
} from "../types";
import { handleAnalyzeSkin } from "./analyzeSkin";
import { handleCycleInsights } from "./cycleInsights";
import { generateRoutine, buildRuleBasedRoutine } from "../ai/routineGenerator";
import { matchProductsToSkinProfile } from "../logic/productMatcher";
import { fetchAllPrices } from "../logic/logicFetcher";
import productsData from "../datasets/products.json";
import inciDbData from "../datasets/inci.json";
import { corsHeaders } from "../utils/cors";

// Map old product format to new Product interface
interface OldProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  key_ingredients: string[];
  ingredients_full: string;
  suitable_for: string[];
  fragrance_free: boolean;
  comedogenic_rating: number;
  price_estimate?: number;
}

function mapOldProductToNew(old: OldProduct): Product {
  // Parse ingredients_full into array
  const ingredients = old.ingredients_full
    ? old.ingredients_full
        .split(/,|;/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
    : old.key_ingredients || [];

  // Map suitable_for to concerns based on common patterns
  const concerns: string[] = [];
  if (old.suitable_for.includes("acne-prone")) concerns.push("acne");
  if (old.suitable_for.includes("sensitive"))
    concerns.push("redness", "sensitivity");
  if (old.suitable_for.includes("dry")) concerns.push("dryness", "hydration");
  if (old.suitable_for.includes("oily")) concerns.push("oil control");
  if (concerns.length === 0) concerns.push("general");

  return {
    id: old.id,
    name: old.name,
    brand: old.brand,
    category: old.category,
    skin_types: old.suitable_for || [],
    concerns: concerns,
    price_estimate: old.price_estimate,
    ingredients: ingredients,
  };
}

const products = (productsData as OldProduct[]).map(mapOldProductToNew);
const inciDb = inciDbData as IngredientInfo[];

/**
 * Map new Gemini SkinAnalysisResponse to legacy SkinAnalysis format
 * (Same function as in analyzeSkin.ts)
 */
function mapNewSkinAnalysisToLegacy(
  newResponse: SkinAnalysisResponse
): SkinAnalysis {
  const mapSeverity = (description: string | null): Level => {
    if (!description) return "none";
    const lower = description.toLowerCase();
    if (lower.includes("severe")) return "severe";
    if (lower.includes("moderate")) return "moderate";
    if (lower.includes("mild")) return "mild";
    return "none";
  };

  const texture_notes: string[] = [
    ...(newResponse.ai_findings.texture || []),
    ...(newResponse.ai_findings.other_observations || []),
  ];

  const analysis: SkinAnalysis = {
    acne: mapSeverity(newResponse.ai_findings.acne),
    redness: mapSeverity(newResponse.ai_findings.redness),
    dryness: mapSeverity(newResponse.ai_findings.dryness),
    oiliness: mapSeverity(newResponse.ai_findings.oiliness),
    texture_notes,
    non_medical_summary: newResponse.combined_interpretation,
    probable_triggers: [],
    routine_focus: [],
  };

  const triggers = newResponse.combined_interpretation.match(
    /(dehydration|stress|hormonal|lack of sleep|comedogenic|over-exfoliation|pollution|dry air)/gi
  );
  if (triggers) {
    analysis.probable_triggers = Array.from(
      new Set(triggers.map((t) => t.toLowerCase()))
    );
  }

  return analysis;
}

// Fast local mock bundle (no Gemini, no external APIs)
async function getMockBundle(
  lifestyle: CycleLifestyleInput,
  env?: Env
): Promise<{
  skin_profile: SkinProfile;
  routine: Routine;
  recommended_products: Product[];
  price_comparisons: PriceComparisonResult[];
}> {
  const mockSkinAnalysis: SkinAnalysis = {
    acne: "mild",
    redness: "moderate",
    dryness: "none",
    oiliness: "mild",
    texture_notes: [
      "visible congestion around T-zone",
      "smooth texture on cheeks",
    ],
    non_medical_summary:
      "Your skin appears moderately oily with mild inflammation around the cheeks and forehead.",
    probable_triggers: ["stress", "sleep"],
    routine_focus: ["barrier repair", "oil control"],
  };

  const cycleData: CycleLifestyleInput = lifestyle;

  const profile: SkinProfile = {
    skin_analysis: mockSkinAnalysis,
    cycle_lifestyle: cycleData,
    combined_triggers: [],
  };

  const routine = buildRuleBasedRoutine(profile);

  const recommended = await matchProductsToSkinProfile(
    profile,
    products,
    inciDb,
    6,
    env
  );

  const prices: PriceComparisonResult[] = recommended.map((p) => ({
    product_name: p.name,
    prices: [
      {
        store: "AmazonCA",
        price: p.price_estimate ? p.price_estimate * 0.9 : 19.99,
        url: `https://www.amazon.ca/s?k=${encodeURIComponent(p.name)}`,
        image: null,
        last_checked: Date.now(),
      },
      {
        store: "SephoraCA",
        price: p.price_estimate ?? 25,
        url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
          p.name
        )}`,
        image: null,
        last_checked: Date.now(),
      },
      {
        store: "Shoppers",
        price: p.price_estimate ? p.price_estimate * 1.1 : 22.5,
        url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
          p.name
        )}`,
        image: null,
        last_checked: Date.now(),
      },
    ],
    cheapest_store: "AmazonCA",
  }));

  return {
    skin_profile: profile,
    routine,
    recommended_products: recommended,
    price_comparisons: prices,
  };
}

export async function handleRecommendationBundle(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    console.log("🔥 Bundle request received");

    let body: {
      skinAnalysisJson?: SkinAnalysisResponse; // Pre-analyzed from frontend
      imageBase64?: string; // Optional, for display/fallback
      mimeType?: string;
      lifestyle?: CycleLifestyleInput;
    };

    try {
      body = (await request.json()) as typeof body;
      console.log(
        "🔥 Request body parsed, has skinAnalysisJson:",
        !!body.skinAnalysisJson,
        "has imageBase64:",
        !!body.imageBase64,
        "has mimeType:",
        !!body.mimeType
      );
    } catch (parseErr: any) {
      console.error("🔥 Failed to parse request JSON:", parseErr);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details: parseErr.message,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const { skinAnalysisJson, imageBase64, mimeType, lifestyle } = body;

    // NEW FLOW: If skinAnalysisJson is provided, use it directly (from frontend Gemini call)
    let skinData: SkinAnalysis | undefined;

    if (skinAnalysisJson) {
      console.log("🔥 Using pre-analyzed skin analysis from frontend");
      try {
        skinData = mapNewSkinAnalysisToLegacy(skinAnalysisJson);
        console.log("✅ Mapped frontend analysis to legacy format");
      } catch (mapErr: any) {
        console.error("⚠️ Failed to map skinAnalysisJson:", mapErr);
        return new Response(
          JSON.stringify({
            error: "Invalid skinAnalysisJson format",
            details: mapErr.message,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    } else {
      // OLD FLOW: Fall back to backend analysis (requires imageBase64)
      if (!imageBase64) {
        console.error("🔥 Missing both skinAnalysisJson and imageBase64");
        return new Response(
          JSON.stringify({
            error:
              "Missing required data. Provide either skinAnalysisJson (from frontend) or imageBase64 (for backend analysis).",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Validate imageBase64 is a string
      if (typeof imageBase64 !== "string") {
        console.error(
          "🔥 imageBase64 is not a string, type:",
          typeof imageBase64
        );
        return new Response(
          JSON.stringify({
            error: "Invalid imageBase64 format - must be a string",
            received_type: typeof imageBase64,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      if (imageBase64.length === 0) {
        console.error("🔥 imageBase64 is empty string");
        return new Response(
          JSON.stringify({ error: "imageBase64 cannot be empty" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      console.log(
        "🔥 Falling back to backend analysis - imageBase64 length:",
        imageBase64.length
      );
    }

    const cycleInput: CycleLifestyleInput =
      lifestyle ??
      ({
        cycle_phase: "unknown",
        sleep_hours: 7,
        hydration_cups: 6,
        stress_level: 3,
        mood: 3,
      } as CycleLifestyleInput);

    // If we don't have skinData yet (no frontend analysis), get it from backend
    if (!skinData) {
      // FAST MOCK MODE (only if no frontend analysis provided)
      if (env.ENVIRONMENT === "local" || !env.GEMINI_API_KEY) {
        console.log("🔥 Using mock mode (local or no API key)");
        const mock = await getMockBundle(cycleInput, env);
        return new Response(JSON.stringify(mock), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      console.log("🔥 Starting backend Gemini analysis flow");

      // Detect mime type from base64 if not provided
      let actualMimeType = mimeType;
      if (!actualMimeType && imageBase64) {
        // Try to detect from base64 data (first few bytes)
        if (
          imageBase64.startsWith("/9j/") ||
          imageBase64.startsWith("iVBORw0KGgo")
        ) {
          actualMimeType = imageBase64.startsWith("/9j/")
            ? "image/jpeg"
            : "image/png";
        } else {
          actualMimeType = "image/jpeg"; // Default fallback
        }
      }

      // Call analyzeSkin by constructing a sub-request
      console.log(
        "🔥 Step 1: Calling analyzeSkin with mimeType:",
        actualMimeType
      );
      const analyzeResp = await handleAnalyzeSkin(
        new Request(request.url, {
          method: "POST",
          body: JSON.stringify({
            imageBase64,
            mimeType: actualMimeType,
            preExistingConditions: [],
            likertAnswers: {
              oily: 3,
              hydrated: 3,
              sensitive: 3,
              breakouts: 3,
            },
          }),
        }),
        env
      );

      if (!analyzeResp.ok) {
        let errData;
        try {
          errData = await analyzeResp.json();
        } catch {
          errData = {
            error: `HTTP ${analyzeResp.status}: ${analyzeResp.statusText}`,
          };
        }
        console.error("⚠️ Skin analysis failed:", errData);
        const errorMsg =
          (errData as any)?.error ||
          (errData as any)?.details ||
          `Skin analysis failed: ${analyzeResp.status}`;
        throw new Error(errorMsg);
      }

      try {
        skinData = (await analyzeResp.json()) as SkinAnalysis;
        console.log("🔥 Step 1 complete: Skin analysis successful");
      } catch (err) {
        console.error("⚠️ Failed to parse skin analysis response:", err);
        throw new Error("Invalid response from skin analysis service");
      }
    } else {
      console.log("🔥 Skipping backend analysis (using frontend analysis)");
    }

    // 2) Cycle insights (text-only Gemini)
    console.log("🔥 Step 2: Calling cycleInsights");
    const cycleResp = await handleCycleInsights(
      new Request(request.url, {
        method: "POST",
        body: JSON.stringify({
          skin_analysis: skinData,
          cycle_lifestyle: cycleInput,
        }),
      }),
      env
    );

    let cycleData: CycleLifestyleInput;
    if (!cycleResp.ok) {
      let errData;
      try {
        errData = await cycleResp.json();
      } catch {
        errData = {
          error: `HTTP ${cycleResp.status}: ${cycleResp.statusText}`,
        };
      }
      console.error("⚠️ Cycle insights failed, using fallback:", errData);
      // Fallback to input cycle data instead of crashing
      cycleData = cycleInput;
    } else {
      try {
        cycleData = (await cycleResp.json()) as CycleLifestyleInput;
      } catch (err) {
        console.error("⚠️ Failed to parse cycle insights response:", err);
        cycleData = cycleInput; // Fallback to input
      }
    }

    const profile: SkinProfile = {
      skin_analysis: skinData,
      cycle_lifestyle: cycleData,
      combined_triggers: [],
    };
    console.log("🔥 Step 2 complete: Cycle insights successful");

    // 3) Routine (Gemini text + fallback)
    console.log("🔥 Step 3: Generating routine");
    const routine = await generateRoutine(profile, env);
    console.log("🔥 Step 3 complete: Routine generated");

    // 4) Product match (AI-powered)
    console.log("🔥 Step 4: Matching products with AI");
    const recommended = await matchProductsToSkinProfile(
      profile,
      products,
      inciDb,
      20,
      env
    );

    console.log(
      "🔥 Step 4 complete: Products matched, count:",
      recommended.length
    );

    // 5) Price comparison (Amazon+Sephora+Shoppers) - with error handling
    console.log(
      "🔥 Step 5: Fetching prices for",
      recommended.length,
      "products"
    );
    const priceComparisons: PriceComparisonResult[] = await Promise.all(
      recommended.map(async (p: Product) => {
        try {
          const prices = await fetchAllPrices(p.name, env);
          const cheapest = prices
            .filter((x: StorePrice) => x.price !== null)
            .sort(
              (a: StorePrice, b: StorePrice) =>
                (a.price ?? Infinity) - (b.price ?? Infinity)
            )[0];

          return {
            product_name: p.name,
            prices,
            cheapest_store: cheapest?.store,
          };
        } catch (priceErr: any) {
          console.error(`⚠️ Price fetch failed for ${p.name}:`, priceErr);
          // Return empty prices instead of crashing
          return {
            product_name: p.name,
            prices: [
              {
                store: "AmazonCA",
                price: null,
                url: `https://www.amazon.ca/s?k=${encodeURIComponent(p.name)}`,
                image: null,
                last_checked: Date.now(),
              },
              {
                store: "SephoraCA",
                price: null,
                url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
                  p.name
                )}`,
                image: null,
                last_checked: Date.now(),
              },
              {
                store: "Shoppers",
                price: null,
                url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
                  p.name
                )}`,
                image: null,
                last_checked: Date.now(),
              },
            ],
            cheapest_store: undefined,
          };
        }
      })
    );
    console.log("🔥 Step 5 complete: Prices fetched");

    console.log("🔥 All steps complete, returning bundle");
    return new Response(
      JSON.stringify({
        skin_profile: profile,
        routine,
        recommended_products: recommended,
        price_comparisons: priceComparisons,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (err: any) {
    console.error("🔥 recommendation-bundle failure:", err);
    console.error("🔥 Error stack:", err?.stack);
    console.error("🔥 Error message:", err?.message);
    console.error("🔥 Error name:", err?.name);
    console.error(
      "🔥 Full error object:",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );

    return new Response(
      JSON.stringify({
        error: "Bundle failed",
        details: err?.message || String(err),
        // Only include stack in local/dev mode
        stack: env.ENVIRONMENT === "local" ? err?.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}
