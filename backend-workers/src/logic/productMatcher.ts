// src/logic/productMatcher.ts

import type { SkinProfile, Product, IngredientInfo } from "../types";
import {
  parseIngredients,
  computeIngredientSafetyScore,
} from "./ingredientParser";

/**
 * Scores a product relative to a user's skin profile.
 * Higher score = better match.
 */
function scoreProduct(
  product: Product,
  profile: SkinProfile,
  ingredientDb: IngredientInfo[]
): number {
  const { skin_analysis: s } = profile;
  let score = 0;

  /* ------------------------------------------------------
   * 1. Ingredient safety score (0–100)
   * ------------------------------------------------------ */
  const parsed = parseIngredients(product.ingredients_full);
  const safety = computeIngredientSafetyScore(parsed, ingredientDb);

  if (safety > 90) score += 6;
  if (safety > 75) score += 4;
  if (safety < 50) score -= 5;
  if (safety < 30) score -= 8;

  /* ------------------------------------------------------
   * 2. Skin type compatibility
   * ------------------------------------------------------ */
  if (s.oiliness === "moderate" || s.oiliness === "severe") {
    if (product.suitable_for.includes("oily")) score += 4;
    if (product.suitable_for.includes("acne-prone")) score += 3;
  }

  if (s.dryness === "moderate" || s.dryness === "severe") {
    if (product.suitable_for.includes("dry")) score += 4;
    if (product.suitable_for.includes("sensitive")) score += 2;
  }

  if (s.redness === "moderate" || s.redness === "severe") {
    if (product.suitable_for.includes("sensitive")) score += 3;
  }

  /* ------------------------------------------------------
   * 3. Ingredient-based improvements
   * ------------------------------------------------------ */
  const inci = product.ingredients_full.toLowerCase();

  // Acne fighting
  if (s.acne === "moderate" || s.acne === "severe") {
    if (inci.includes("salicylic")) score += 4;
    if (inci.includes("bha")) score += 3;
    if (inci.includes("niacinamide")) score += 2;
  }

  // Dryness/hydration
  if (s.dryness === "moderate" || s.dryness === "severe") {
    if (inci.includes("hyaluronic")) score += 4;
    if (inci.includes("ceramide")) score += 3;
    if (inci.includes("glycerin")) score += 2;
    if (inci.includes("squalane")) score += 2;
  }

  // Redness / sensitivity
  if (s.redness === "moderate" || s.redness === "severe") {
    if (inci.includes("centella")) score += 3;
    if (inci.includes("panthenol")) score += 2;
    if (inci.includes("madecassoside")) score += 3;
  }

  /* ------------------------------------------------------
   * 4. Texture issues
   * ------------------------------------------------------ */
  if (s.texture_notes.includes("visible congestion")) {
    if (inci.includes("salicylic")) score += 4;
    if (inci.includes("bha")) score += 3;
  }

  /* ------------------------------------------------------
   * 5. Routine Focus Alignment
   * ------------------------------------------------------ */
  for (const goal of s.routine_focus) {
    if (goal === "barrier repair" && inci.includes("ceramide")) score += 3;
    if (goal === "oil control" && inci.includes("niacinamide")) score += 2;
    if (goal === "soothing" && inci.includes("centella")) score += 3;
  }

  /* ------------------------------------------------------
   * 6. Penalties (fragrance, essential oils, drying alcohol)
   * ------------------------------------------------------ */
  if (!product.fragrance_free) score -= 3;
  if (inci.includes("fragrance")) score -= 4;
  if (inci.includes("parfum")) score -= 4;
  if (inci.includes("lavender oil")) score -= 4;
  if (inci.includes("essential oil")) score -= 3;
  if (inci.includes("alcohol denat")) score -= 3;

  return score;
}

/**
 * MAIN MATCHER — returns top N products.
 */
export function matchProductsToSkinProfile(
  profile: SkinProfile,
  products: Product[],
  ingredientDb: IngredientInfo[],
  limit: number = 15
): Product[] {
  const scored = products.map((p) => ({
    product: p,
    score: scoreProduct(p, profile, ingredientDb),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.product);
}
