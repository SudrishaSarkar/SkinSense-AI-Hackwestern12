// src/types.ts

// ====== ENVIRONMENT ======
export interface Env {
  GEMINI_API_KEY: string;
  AMAZON_RAPIDAPI_KEY: string;
  SEPHORA_RAPIDAPI_KEY: string;
  RAPIDAPI_KEY: string; // For backward compatibility
  ENVIRONMENT?: string; // "local" to enable mock mode
  GOOGLE_SERVICE_ACCOUNT?: string; // Optional, for service account auth (not used in frontend flow)
}

// ====== SKIN ANALYSIS (legacy shape used by frontend) ======
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

// ====== NEW AI RESPONSE SHAPE (Gemini JSON) ======
export interface SkinAnalysisResponse {
  ai_findings: {
    acne: string | null;
    redness: string | null;
    dryness: string | null;
    oiliness: string | null;
    texture: string[];
    other_observations: string[];
  };
  combined_interpretation: string;
}

// ====== CYCLE / LIFESTYLE ======
export type CyclePhase =
  | "follicular"
  | "ovulatory"
  | "luteal"
  | "menstrual"
  | "unknown";

export interface CycleLifestyleInput {
  cycle_phase: CyclePhase;
  sleep_hours: number; // 0–24
  hydration_cups: number; // 0–20
  stress_level: number; // 1–5
  mood: number; // 1–5
}

// ====== MERGED PROFILE ======
export interface SkinProfile {
  skin_analysis: SkinAnalysis;
  cycle_lifestyle: CycleLifestyleInput;
  combined_triggers: string[];
}

// ====== PRODUCTS / INGREDIENTS ======
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  skin_types: string[]; // e.g. ["oily", "combination"]
  concerns: string[]; // e.g. ["acne", "redness"]
  price_estimate?: number;
  ingredients: string[];
}

export interface IngredientInfo {
  name: string;
  comedogenic_rating?: number | null; // 0–5
  irritancy_rating?: number | null; // 0–5
  benefits?: string[];
  warnings?: string[];
}

// ====== ROUTINE ======
export type RoutineTime = "AM" | "PM" | "AM_PM";

export interface RoutineStep {
  step: string; // e.g. "Cleanser"
  time: RoutineTime;
  description: string;
}

export interface Routine {
  steps: RoutineStep[];
  notes: string;
}

// ====== PRICING ======
export interface StorePrice {
  store: string; // "AmazonCA" | "SephoraCA" | "Shoppers"
  price: number | null;
  url: string;
  image?: string | null;
  last_checked: number;
}

export interface PriceComparisonResult {
  product_name: string;
  prices: StorePrice[];
  cheapest_store?: string;
}
