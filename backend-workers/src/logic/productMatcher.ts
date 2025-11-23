// src/logic/productMatcher.ts
import type { Product, IngredientInfo, SkinProfile, Env } from "../types";
import { callGemini } from "../aiSystemPrompts/geminiClient";
import { PRODUCT_MATCHING_PROMPT } from "../ai/prompts";

/**
 * Rule-based fallback: matches on concerns + skin type + avoids comedogenic ingredients if acne/oily.
 */
function matchProductsRuleBased(
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

/**
 * AI-powered product matching using Gemini.
 * Analyzes skin profile and matches products intelligently.
 */
async function matchProductsWithAI(
  profile: SkinProfile,
  products: Product[],
  limit: number,
  env: Env
): Promise<Product[]> {
  const prompt = `${PRODUCT_MATCHING_PROMPT}

User's Skin Profile:
${JSON.stringify(profile, null, 2)}

Available Products (limit to top 50 for analysis):
${JSON.stringify(products.slice(0, 50), null, 2)}

Analyze and rank the products that best match this user's needs. Return the top ${limit} products.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const result = await callGemini("gemini-2.0-flash-001", payload, env);

    if (
      !result ||
      !result.ranked_products ||
      !Array.isArray(result.ranked_products)
    ) {
      console.warn(
        "⚠️ Gemini returned invalid product matching structure, using fallback"
      );
      return matchProductsRuleBased(profile, products, [], limit);
    }

    // Map product IDs back to Product objects
    const productMap = new Map(products.map((p) => [p.id, p]));
    const matched: Product[] = [];

    for (const ranked of result.ranked_products.slice(0, limit)) {
      const product = productMap.get(ranked.product_id);
      if (product) {
        matched.push(product);
      }
    }

    // If AI didn't return enough products, fill with rule-based
    if (matched.length < limit) {
      const remaining = limit - matched.length;
      const matchedIds = new Set(matched.map((p) => p.id));
      const additional = matchProductsRuleBased(
        profile,
        products,
        [],
        remaining * 2
      )
        .filter((p) => !matchedIds.has(p.id))
        .slice(0, remaining);
      matched.push(...additional);
    }

    return matched;
  } catch (error: any) {
    console.error("❌ Error in AI product matching:", error);
    return matchProductsRuleBased(profile, products, [], limit);
  }
}

/**
 * Main product matching function.
 * Uses AI if available, falls back to rule-based.
 */
export async function matchProductsToSkinProfile(
  profile: SkinProfile,
  products: Product[],
  inciDb: IngredientInfo[],
  limit: number,
  env?: Env
): Promise<Product[]> {
  // If no API key, use rule-based
  if (!env?.GEMINI_API_KEY) {
    return matchProductsRuleBased(profile, products, inciDb, limit);
  }

  try {
    console.log("🤖 Using AI-powered product matching...");
    const aiMatched = await matchProductsWithAI(profile, products, limit, env);
    console.log(`✅ AI matched ${aiMatched.length} products`);
    return aiMatched;
  } catch (error: any) {
    console.error("⚠️ AI product matching failed, using fallback:", error);
    return matchProductsRuleBased(profile, products, inciDb, limit);
  }
}
