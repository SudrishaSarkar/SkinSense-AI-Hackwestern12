// src/routes/recommendProducts.ts

import type {
  Env,
  SkinProfile,
  PriceComparisonResult,
  Product,
  IngredientInfo,
} from "../types";

import productsData from "../datasets/products.json";
import inciDbData from "../datasets/inci.json";

import { matchProductsToSkinProfile } from "../logic/productMatcher";
import {
  parseIngredients,
  computeIngredientSafetyScore,
} from "../logic/ingredientParser";

const products = productsData as Product[];
const inciDb = inciDbData as IngredientInfo[];

/**
 * Groups selected products by skincare routine step.
 */
function groupProductsByCategory(recommended: Product[]) {
  return {
    cleansers: recommended.filter((p) => p.category === "cleanser"),
    moisturizers: recommended.filter((p) => p.category === "moisturizer"),
    serums: recommended.filter((p) => p.category === "serum"),
    exfoliants: recommended.filter((p) => p.category === "exfoliant"),
    spf: recommended.filter((p) => p.category === "sunscreen"),
  };
}

export async function handleRecommendProducts(request: Request, env: Env) {
  const body = (await request.json()) as {
    skin_profile?: SkinProfile;
  };
  const profile = body.skin_profile as SkinProfile;

  /* ---------------------------------------
   * 1. Match products
   * --------------------------------------- */
  const recommended = matchProductsToSkinProfile(
    profile,
    products as Product[],
    inciDb,
    18 // number of products to return
  );

  /* ---------------------------------------
   * 2. Enrich with ingredient safety info
   * --------------------------------------- */
  const enriched = recommended.map((prod) => {
    const parsed = parseIngredients(prod.ingredients_full);
    const safety = computeIngredientSafetyScore(parsed, inciDb);

    return {
      ...prod,
      parsed_ingredients: parsed,
      safety_score: safety,
    };
  });

  /* ---------------------------------------
   * 3. Group products by routine category
   * --------------------------------------- */
  const grouped = groupProductsByCategory(enriched);

  /* ---------------------------------------
   * 4. Return result
   * --------------------------------------- */
  const response = {
    profile,
    recommended_products: enriched,
    grouped_products: grouped,
  };

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
