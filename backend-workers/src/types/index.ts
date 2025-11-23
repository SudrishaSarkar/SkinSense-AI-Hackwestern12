/** -----------------------------------------------------------
 *  GLOBAL ENVIRONMENT VARIABLES
 *  (Cloudflare Workers specific)
 * ----------------------------------------------------------- */
export interface Env {
  CACHE: KVNamespace; // Cloudflare KV cache
  GEMINI_API_KEY: string;
  WALMART_API_KEY: string;
  AMAZON_RAPIDAPI_KEY: string;
  RAPIDAPI_KEY: string;
  ELEVENLABS_API_KEY: string;
  ENVIRONMENT?: string; // "local" | "production" | undefined
}

/** -----------------------------------------------------------
 *  SKIN ANALYSIS FROM GEMINI VISION
 * ----------------------------------------------------------- */

/**
 * Severity level for skin conditions
 * Used by: SkinAnalysis interface
 */
export type Level = "none" | "mild" | "moderate" | "severe";

/**
 * Skin Analysis Result from Gemini Vision API
 *
 * ⚠️ CRITICAL: This structure MUST match what Gemini returns!
 * If you modify SKIN_ANALYSIS_PROMPT, ensure it returns this exact structure.
 *
 * Used by:
 * - src/routes/analyzeSkin.ts (returns this)
 * - src/routes/recommendationBundle.ts (uses this)
 * - src/ai/routineGenerator.ts (uses this)
 * - src/logic/productMatcher.ts (uses this)
 * - Frontend displays this data
 *
 * @see GEMINI_PROMPT_GUIDE.md for prompt editing guidelines
 */
export interface SkinAnalysis {
  /** Acne/breakout severity level */
  acne: Level;
  /** Redness/inflammation severity level */
  redness: Level;
  /** Dryness/flakiness severity level */
  dryness: Level;
  /** Oiliness/shine severity level */
  oiliness: Level;
  /** Specific texture observations, e.g. ["visible congestion", "flakiness", "rough texture"] */
  texture_notes: string[];
  /** Plain-language summary (2-3 sentences) of what the model sees - non-medical language */
  non_medical_summary: string;
  /** Potential triggers based on visual cues, e.g. ["stress", "sleep", "barrier damage"] */
  probable_triggers: string[];
  /** Focus areas for routine, e.g. ["barrier repair", "oil control", "hydration"] */
  routine_focus: string[];
}

/** -----------------------------------------------------------
 *  CYCLE + LIFESTYLE INPUT
 * ----------------------------------------------------------- */

export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "unknown";

export interface CycleLifestyleInput {
  cycle_phase: CyclePhase;
  sleep_hours: number; // 0–12
  hydration_cups: number; // water intake per day
  stress_level: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

/** -----------------------------------------------------------
 *  MERGED USER SKIN PROFILE
 * ----------------------------------------------------------- */

export interface SkinProfile {
  skin_analysis: SkinAnalysis; // from Vision AI
  cycle_lifestyle: CycleLifestyleInput; // from user form
  combined_triggers: string[]; // merged + inferred via Gemini
}

/** -----------------------------------------------------------
 *  ROUTINE (AM / PM)
 * ----------------------------------------------------------- */

export interface RoutineStep {
  step_name: string; // Cleanser, Moisturizer, Serum, SPF, etc.
  product_name?: string; // optional: filled after product matching
  instruction: string; // "Apply to damp skin", etc.
}

export interface Routine {
  am: RoutineStep[];
  pm: RoutineStep[];
}

/** -----------------------------------------------------------
 *  PRODUCT DATABASE ENTRY (NORMALIZED SCHEMA)
 * ----------------------------------------------------------- */

export interface Product {
  id: string; // UUID or dataset id
  name: string;
  brand: string;
  category: string; // cleanser, moisturizer, serum, etc.
  key_ingredients: string[]; // extracted ingredients
  ingredients_full: string; // full INCI list
  suitable_for: string[]; // ["oily", "acne-prone", "sensitive"]
  fragrance_free: boolean;
  comedogenic_rating: 0 | 1 | 2 | 3 | 4 | 5;
  image_url?: string;
  price_estimate?: number; // fallback if live prices unavailable
}

/** -----------------------------------------------------------
 *  INGREDIENT DICTIONARY (OPTIONAL)
 * ----------------------------------------------------------- */

export interface IngredientInfo {
  name: string;
  category: string; // surfactant, emollient, antioxidant, etc.
  functions: string[];
  comedogenicity?: number; // 0–5
  irritant?: boolean;
  fragrance?: boolean;
  acne_trigger?: boolean;
  notes?: string;
}

/** -----------------------------------------------------------
 *  CYCLE → SKIN PATTERN MAPPING
 * ----------------------------------------------------------- */

export interface CyclePattern {
  phase: CyclePhase;
  expected_oiliness: Level;
  expected_sensitivity: Level;
  expected_acne: Level;
  advice: string; // “focus on barrier repair”
}

/** -----------------------------------------------------------
 *  PRICE COMPARISON STRUCTURES
 * ----------------------------------------------------------- */

export interface StorePrice {
  store: "Walmart" | "Shoppers" | "AmazonCA" | "SephoraCA";
  price: number | null; // null if failed to fetch
  url: string;
  image?: string | null; // optional product image URL
  last_checked: number; // timestamp (ms)
}

export interface PriceComparisonResult {
  product_name: string;
  prices: StorePrice[];
  cheapest_store?: string;
}

/** -----------------------------------------------------------
 *  PRODUCT RECOMMENDATION ENTRY
 * ----------------------------------------------------------- */

export interface ProductRecommendation {
  product: Product;
  score: number; // internal ranking score
  reason: string; // natural-language explanation
}

/** -----------------------------------------------------------
 *  INVESTMENT PROJECTION
 * ----------------------------------------------------------- */

export interface InvestmentProjection {
  monthly_savings: number;
  projected_value: number; // based on future value calc
  years: number;
  explanation: string; // Gemini-safe financial summary
}

/** -----------------------------------------------------------
 *  FINAL RESPONSE BUNDLE (MAIN API OUTPUT)
 * ----------------------------------------------------------- */

export interface RecommendationBundle {
  skin_profile: SkinProfile;
  routine: Routine;
  recommended_products: Product[];
  price_comparisons: PriceComparisonResult[];
  investment_projection?: InvestmentProjection;
}

/** -----------------------------------------------------------
 *  OPTIONAL: HISTORY LOGGING
 * ----------------------------------------------------------- */

export interface AnalysisHistoryEntry {
  timestamp: number;
  skin_profile: SkinProfile;
  routine: Routine;
  recommended_products: string[]; // product IDs
}
