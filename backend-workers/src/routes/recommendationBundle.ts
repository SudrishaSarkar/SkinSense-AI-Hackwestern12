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
    const skinData = (await skinResp.json()) as SkinAnalysis;

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
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Bundle failed", details: String(err) }),
      { status: 500 }
    );
  }
}
