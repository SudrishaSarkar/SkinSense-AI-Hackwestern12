// src/logic/ingredientParser.ts

import type { IngredientInfo } from "../types";

/**
 * Splits a full INCI string into normalized ingredient tokens.
 *
 * Example:
 * "Aqua (Water), Glycerin, Sodium Hyaluronate, Niacinamide"
 * -> ["aqua", "water", "glycerin", "sodium hyaluronate", "niacinamide"]
 */
export function parseIngredients(inci: string): string[] {
  if (!inci) return [];

  return inci
    .split(/,|;|\./g)
    .map((i) => i.trim().toLowerCase())
    .filter((i) => i.length > 0);
}

/**
 * Flags potentially irritating or comedogenic ingredients
 * based on your IngredientInfo dictionary.
 */
export function detectIngredientHazards(
  parsedIngredients: string[],
  ingredientDb: IngredientInfo[]
) {
  const irritants: string[] = [];
  const fragrance: string[] = [];
  const comedogenic: { ingredient: string; rating: number }[] = [];
  const acneTriggers: string[] = [];

  for (const ingredient of parsedIngredients) {
    const found = ingredientDb.find(
      (info) => info.name.toLowerCase() === ingredient
    );

    if (!found) continue;

    if (found.irritancy_rating && found.irritancy_rating >= 3)
      irritants.push(found.name);
    // Check for fragrance in warnings or name
    if (found.warnings?.some((w) => w.toLowerCase().includes("fragrance")))
      fragrance.push(found.name);
    if (found.warnings?.some((w) => w.toLowerCase().includes("acne")))
      acneTriggers.push(found.name);

    if (
      found.comedogenic_rating !== undefined &&
      found.comedogenic_rating !== null &&
      found.comedogenic_rating >= 3
    ) {
      comedogenic.push({
        ingredient: found.name,
        rating: found.comedogenic_rating,
      });
    }
  }

  return {
    irritants,
    fragrance,
    comedogenic,
    acneTriggers,
  };
}

/**
 * Lightweight heuristic check for unsafe essential oils,
 * heavy fragrances, drying alcohols, etc.
 */
export function quickHazardScan(parsedIngredients: string[]) {
  const flagged: string[] = [];

  const fragranceTerms = [
    "fragrance",
    "parfum",
    "essential oil",
    "lavender oil",
    "citrus oil",
    "bergamot",
  ];

  const dryingAlcohols = ["alcohol denat", "ethanol"];

  for (const ing of parsedIngredients) {
    if (fragranceTerms.some((f) => ing.includes(f))) flagged.push(ing);
    if (dryingAlcohols.some((a) => ing.includes(a))) flagged.push(ing);
  }

  return flagged;
}

/**
 * Computes an overall ingredient safety score (0–100).
 * Higher score = safer, more sensitive-skin-friendly.
 */
export function computeIngredientSafetyScore(
  parsedIngredients: string[],
  ingredientDb: IngredientInfo[]
): number {
  let score = 100;

  const hazards = detectIngredientHazards(parsedIngredients, ingredientDb);

  // Light penalties
  score -= hazards.irritants.length * 4;
  score -= hazards.fragrance.length * 5;
  score -= hazards.acneTriggers.length * 4;

  // Comedogenicity penalty
  for (const c of hazards.comedogenic) {
    score -= c.rating * 2;
  }

  // Quick scan penalties
  const quick = quickHazardScan(parsedIngredients);
  score -= quick.length * 3;

  return Math.max(0, score);
}
