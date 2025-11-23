import type {
  Env,
  SkinProfile,
  SkinAnalysis,
  CycleLifestyleInput,
  Product,
  IngredientInfo,
  PriceComparisonResult,
  StorePrice,
  Routine,
} from "../types";
import { handleAnalyzeSkin } from "./analyzeSkin";
import { handleCycleInsights } from "./cycleInsights";
import { generateRoutine, buildRuleBasedRoutine } from "../ai/routineGenerator";
import { matchProductsToSkinProfile } from "../logic/productMatcher";
import { fetchAllPrices } from "../logic/logicFetcher";
import productsData from "../datasets/products.json";
import inciDbData from "../datasets/inci.json";

const products = productsData as Product[];
const inciDb = inciDbData as IngredientInfo[];

/**
 * Fast local mode - returns mock data instantly (bypasses all Gemini API calls)
 */
function getMockBundle(lifestyle: CycleLifestyleInput): {
  skin_profile: SkinProfile;
  routine: Routine;
  recommended_products: Product[];
  price_comparisons: PriceComparisonResult[];
} {
  // Mock skin analysis
  const mockSkinAnalysis: SkinAnalysis = {
    acne: "mild",
    redness: "moderate",
    dryness: "none",
    oiliness: "mild",
    texture_notes: [
      "visible congestion around T-zone",
      "smooth texture on cheeks",
      "slight pore visibility",
    ],
    non_medical_summary:
      "Your skin appears moderately oily with mild inflammation around the cheeks and forehead. The T-zone shows some visible congestion, while the cheek area maintains a smoother texture.",
    probable_triggers: ["stress", "sleep", "hormonal changes"],
    routine_focus: ["barrier repair", "oil control", "gentle exfoliation"],
  };

  // Use provided lifestyle or defaults
  const cycleData: CycleLifestyleInput = lifestyle || {
    cycle_phase: "unknown",
    sleep_hours: 7,
    hydration_cups: 6,
    stress_level: 3,
    mood: 3,
  };

  const merged: SkinProfile = {
    skin_analysis: mockSkinAnalysis,
    cycle_lifestyle: cycleData,
    combined_triggers: [],
  };

  // Generate routine using rule-based logic (fast, no Gemini)
  const routine = buildRuleBasedRoutine(merged);

  // Match products (fast, no API calls)
  const recommendedProducts = matchProductsToSkinProfile(
    merged,
    products,
    inciDb,
    6 // Return top 6 for faster response
  );

  // Mock price comparisons (instant)
  const priceComparisons: PriceComparisonResult[] = recommendedProducts.map(
    (p: Product) => ({
      product_name: p.name,
      prices: [
        {
          store: "AmazonCA",
          price: p.price_estimate ? p.price_estimate * 0.9 : 19.99,
          url: `https://www.amazon.ca/s?k=${encodeURIComponent(p.name)}`,
          last_checked: Date.now(),
        },
        {
          store: "SephoraCA",
          price: p.price_estimate || 25.0,
          url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
            p.name
          )}`,
          last_checked: Date.now(),
        },
        {
          store: "Shoppers",
          price: p.price_estimate ? p.price_estimate * 1.1 : 22.5,
          url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
            p.name
          )}`,
          last_checked: Date.now(),
        },
      ],
      cheapest_store: "AmazonCA",
    })
  );

  return {
    skin_profile: merged,
    routine,
    recommended_products: recommendedProducts,
    price_comparisons: priceComparisons,
  };
}

export async function handleRecommendationBundle(request: Request, env: Env) {
  try {
    const body = (await request.json()) as {
      imageBase64?: string;
      mimeType?: string;
      lifestyle?: CycleLifestyleInput;
    };

    const { imageBase64, mimeType, lifestyle } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Default to image/jpeg if mimeType not provided (backward compatibility)
    const actualMimeType = mimeType || "image/jpeg";

    // 🚀 FAST LOCAL MODE - bypass all Gemini API calls
    if (env.ENVIRONMENT === "local") {
      const mockBundle = getMockBundle(
        lifestyle || {
          cycle_phase: "unknown",
          sleep_hours: 7,
          hydration_cups: 6,
          stress_level: 3,
          mood: 3,
        }
      );

      return new Response(JSON.stringify(mockBundle), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Production mode - use real Gemini APIs
    // 1. Skin analysis
    // Convert base64 to data URL format (analyzeSkin expects data URL)
    // Use the actual MIME type from the frontend
    const imageDataUrl = `data:${actualMimeType};base64,${imageBase64}`;

    console.log("🔍 Step 1: Calling analyzeSkin...");
    const skinResp = await handleAnalyzeSkin(
      new Request(request.url, {
        method: "POST",
        body: JSON.stringify({ image: imageDataUrl }),
      }),
      env
    );

    if (!skinResp.ok) {
      const errorData = (await skinResp
        .json()
        .catch(() => ({ error: "Unknown error" }))) as {
        error?: string;
        details?: string;
      };
      console.error("❌ analyzeSkin failed:", errorData);
      throw new Error(
        `Skin analysis failed: ${errorData.error || skinResp.statusText}`
      );
    }

    const skinData = (await skinResp.json()) as SkinAnalysis;
    console.log("✅ Step 1 complete: Skin analysis received");

    // 2. Cycle insights
    console.log("🔍 Step 2: Calling cycleInsights...");
    const cycleResp = await handleCycleInsights(
      new Request(request.url, {
        method: "POST",
        body: JSON.stringify({
          skin_analysis: skinData,
          cycle_lifestyle: lifestyle || {
            cycle_phase: "unknown",
            sleep_hours: 7,
            hydration_cups: 6,
            stress_level: 3,
            mood: 3,
          },
        }),
      }),
      env
    );

    if (!cycleResp.ok) {
      const errorData = (await cycleResp
        .json()
        .catch(() => ({ error: "Unknown error" }))) as {
        error?: string;
        details?: string;
      };
      console.error("❌ cycleInsights failed:", errorData);
      throw new Error(
        `Cycle insights failed: ${errorData.error || cycleResp.statusText}`
      );
    }

    const cycleData = (await cycleResp.json()) as CycleLifestyleInput;
    console.log("✅ Step 2 complete: Cycle insights received");

    const merged: SkinProfile = {
      skin_analysis: skinData,
      cycle_lifestyle: cycleData,
      combined_triggers: [],
    };

    // 3. Generate routine
    console.log("🔍 Step 3: Generating routine...");
    const routine = await generateRoutine(merged, env);
    console.log("✅ Step 3 complete: Routine generated");

    // 4. Match products
    console.log("🔍 Step 4: Matching products...");
    const recommendedProducts = matchProductsToSkinProfile(
      merged,
      products,
      inciDb,
      20
    );
    console.log(
      `✅ Step 4 complete: Matched ${recommendedProducts.length} products`
    );

    // 5. Fetch price comparisons WITH IMAGES for each product
    console.log("🔍 Step 5: Fetching price comparisons...");
    const priceComparisons = await Promise.all(
      recommendedProducts.map(async (p: Product) => {
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
          cheapest_store: cheapest ? cheapest.store : undefined,
        } as PriceComparisonResult;
      })
    );
    console.log("✅ Step 5 complete: Price comparisons fetched");

    return new Response(
      JSON.stringify({
        skin_profile: merged,
        routine,
        recommended_products: recommendedProducts,
        price_comparisons: priceComparisons,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    // Log the full error for debugging
    console.error("❌ Bundle error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;

    return new Response(
      JSON.stringify({
        error: "Bundle failed",
        details: errorMessage,
        stack: errorStack,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
