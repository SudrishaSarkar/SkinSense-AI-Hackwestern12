// src/routes/recommendProducts.ts
import type {
  Env,
  SkinProfile,
  SkinAnalysis,
  CycleLifestyleInput,
  Product,
  IngredientInfo,
} from "../types";
import { matchProductsToSkinProfile } from "../logic/productMatcher";
import { corsHeaders } from "../utils/cors";
import productsData from "../datasets/products.json";
import inciDbData from "../datasets/inci.json";

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

export async function handleRecommendProducts(
  request: Request,
  _env: Env
): Promise<Response> {
  let body: {
    skin_analysis?: SkinAnalysis;
    cycle_lifestyle?: CycleLifestyleInput;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  if (!body.skin_analysis) {
    return new Response(
      JSON.stringify({ error: 'Missing "skin_analysis" in body' }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const merged: SkinProfile = {
    skin_analysis: body.skin_analysis,
    cycle_lifestyle:
      body.cycle_lifestyle ??
      ({
        cycle_phase: "unknown",
        sleep_hours: 7,
        hydration_cups: 6,
        stress_level: 3,
        mood: 3,
      } as CycleLifestyleInput),
    combined_triggers: [],
  };

  const recommended = matchProductsToSkinProfile(merged, products, inciDb, 20);

  return new Response(JSON.stringify(recommended), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}
