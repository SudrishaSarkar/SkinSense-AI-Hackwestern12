import type {
  Env,
  SkinProfile,
  SkinAnalysis,
  CycleLifestyleInput,
  Product,
  IngredientInfo,
  PriceComparisonResult,
  StorePrice,
} from "../types";
import { handleAnalyzeSkin } from "./analyzeSkin";
import { handleCycleInsights } from "./cycleInsights";
import { generateRoutine } from "../ai/routineGenerator";
import { matchProductsToSkinProfile } from "../logic/productMatcher";
import { fetchAllPrices } from "../logic/logicFetcher";
import productsData from "../datasets/products.json";
import inciDbData from "../datasets/inci.json";
import { corsHeaders } from "../utils/cors";

const products = productsData as Product[];
const inciDb = inciDbData as IngredientInfo[];

export async function handleRecommendationBundle(request: Request, env: Env) {
  try {
    const body = (await request.json()) as {
      imageBase64?: string;
      lifestyle?: CycleLifestyleInput;
    };

    const { imageBase64, lifestyle } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
      });
    }

    // 1. Skin analysis
    const skinResp = await handleAnalyzeSkin(
      new Request(request.url, {
        method: "POST",
        body: JSON.stringify({ image: imageBase64 }),
      }),
      env
    );

    // Check if skin analysis failed
    if (!skinResp.ok) {
      const errorData = (await skinResp.json()) as {
        error?: string;
        details?: string;
      };
      return new Response(
        JSON.stringify({
          error: errorData.error || "Skin analysis failed",
          details: errorData.details,
        }),
        {
          status: skinResp.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const skinData = (await skinResp.json()) as SkinAnalysis;

    // Check if Gemini returned an error (face validation failed)
    if ((skinData as any).error) {
      return new Response(
        JSON.stringify({
          error: (skinData as any).error || "Image does not contain a face",
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

    // 2. Cycle insights
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
    const cycleData = (await cycleResp.json()) as CycleLifestyleInput;

    const merged: SkinProfile = {
      skin_analysis: skinData,
      cycle_lifestyle: cycleData,
      combined_triggers: [],
    };

    // 3. Generate routine
    const routine = await generateRoutine(merged, env);

    // 4. Match products
    const recommendedProducts = matchProductsToSkinProfile(
      merged,
      products,
      inciDb,
      20
    );

    // 5. Fetch price comparisons WITH IMAGES for each product
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
          ...corsHeaders,
        },
      }
    );
  } catch (err) {
    // Log the full error for debugging
    console.error("Bundle error:", err);
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
          ...corsHeaders,
        },
      }
    );
  }
}
