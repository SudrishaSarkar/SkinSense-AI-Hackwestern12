// src/types/index.ts

export interface Env {
  CACHE: KVNamespace;
  GEMINI_API_KEY: string;
  WALMART_API_KEY: string;
  AMAZON_RAPIDAPI_KEY: string;
  ELEVENLABS_API_KEY: string;
}

/* ----------------------------------------------------------
      SKIN ANALYSIS TYPES
  ---------------------------------------------------------- */

export type Level = "none" | "mild" | "moderate" | "severe";

export interface SkinAnalysis {
  acne: Level;
  redness: Level;
  dryness: Level;
  oiliness: Level;
  texture_notes: string[];
  non_medical_summary: string;
  probable_triggers: string[];
  routine_focus: string[];
}

/* ----------------------------------------------------------
      CYCLE / LIFESTYLE INPUT
  ---------------------------------------------------------- */

export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "unknown";

export interface CycleLifestyleInput {
  cycle_phase: CyclePhase;
  sleep_hours: number;
  hydration_cups: number;
  stress_level: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

/* ----------------------------------------------------------
      SKIN PROFILE (MERGED)
  ---------------------------------------------------------- */

export interface SkinProfile {
  skin_analysis: SkinAnalysis;
  cycle_lifestyle: CycleLifestyleInput;
  combined_triggers: string[];
}

/* ----------------------------------------------------------
      ROUTINE TYPES
  ---------------------------------------------------------- */

export interface RoutineStep {
  step_name: string;
  product_name?: string;
  instruction: string;
}

export interface Routine {
  am: RoutineStep[];
  pm: RoutineStep[];
}

/* ----------------------------------------------------------
      PRODUCT SCHEMA
  ---------------------------------------------------------- */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  key_ingredients: string[];
  ingredients_full: string;
  suitable_for: string[];
  fragrance_free: boolean;
  comedogenic_rating: 0 | 1 | 2 | 3 | 4 | 5;
  image_url?: string;
  price_estimate?: number;
}

/* ----------------------------------------------------------
      PRICE COMPARISON
  ---------------------------------------------------------- */

export interface StorePrice {
  store: "Walmart" | "Shoppers" | "AmazonCA" | "SephoraCA";
  price: number | null;
  url: string;
  last_checked: number;
}

export interface PriceComparisonResult {
  product_name: string;
  prices: StorePrice[];
  cheapest_store?: string;
}

/* ----------------------------------------------------------
      FINAL RESPONSE BUNDLE
  ---------------------------------------------------------- */

export interface RecommendationBundle {
  skin_profile: SkinProfile;
  routine: Routine;
  recommended_products: Product[];
  price_comparisons: PriceComparisonResult[];
  investment_projection?: {
    monthly_savings: number;
    projected_value: number;
    years: number;
    explanation: string;
  };
}
