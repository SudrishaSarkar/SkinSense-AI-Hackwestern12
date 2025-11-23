// src/logic/productMatcher.ts
import type { Product, IngredientInfo, SkinProfile } from "../types";

/**
 * Simple scoring: matches on concerns + skin type + avoids comedogenic ingredients if acne/oily.
 */
export function matchProductsToSkinProfile(
  profile: SkinProfile,
  products: Product[],
  inciDb: IngredientInfo[],
  limit: number
): Product[] {
  const { skin_analysis } = profile;

  const wantsAcneSupport = skin_analysis.acne !== "none";
  const wantsRednessSupport = skin_analysis.redness !== "none";
  const wantsDrynessSupport = skin_analysis.dryness !== "none";
  const wantsOilControl = skin_analysis.oiliness !== "none";

  function ingredientPenalty(ingredients: string[]): number {
    if (!wantsAcneSupport && !wantsOilControl) return 0;
    const lowerNames = ingredients.map((i) => i.toLowerCase());
    let penalty = 0;
    for (const ing of inciDb) {
      if (!ing.name) continue;
      const nameLower = ing.name.toLowerCase();
      if (lowerNames.includes(nameLower)) {
        if ((ing.comedogenic_rating ?? 0) >= 3) penalty += 2;
        if ((ing.irritancy_rating ?? 0) >= 3) penalty += 1;
      }
    }
    return penalty;
  }

  const scored = products.map((p) => {
    let score = 0;

    const concernsLower = p.concerns.map((c) => c.toLowerCase());

    if (wantsAcneSupport && concernsLower.includes("acne")) score += 3;
    if (wantsRednessSupport && concernsLower.includes("redness")) score += 2;
    if (wantsDrynessSupport && concernsLower.includes("dryness")) score += 2;
    if (wantsOilControl && concernsLower.includes("oil control")) score += 2;

    // small bonus for "barrier", "hydration", "sensitive"
    if (concernsLower.includes("barrier")) score += 1;
    if (concernsLower.includes("hydration")) score += 1;
    if (concernsLower.includes("sensitivity")) score += 1;

    score -= ingredientPenalty(p.ingredients);

    return { product: p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.product);
}
