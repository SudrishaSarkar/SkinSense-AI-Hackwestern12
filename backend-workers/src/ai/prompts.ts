// src/ai/prompts.ts
/**
 * AI System Prompts for SkinSense AI
 *
 * ⚠️ IMPORTANT FOR PROMPT EDITORS:
 * - These prompts are used by Gemini API to generate structured JSON responses
 * - The JSON structure MUST match the TypeScript types in src/types/index.ts
 * - Changing the prompt text is fine, but the output structure must remain consistent
 * - See GEMINI_PROMPT_GUIDE.md for detailed documentation
 */

/**
 * Cycle Insights Prompt
 *
 * Used by: src/routes/cycleInsights.ts
 * Input: SkinAnalysis + CycleLifestyleInput
 * Output: CycleLifestyleInput (enhanced with insights)
 */
export const CYCLE_INSIGHTS_PROMPT = `You are a skincare expert. Analyze the provided skin analysis and cycle/lifestyle data to generate personalized insights.

Return a JSON object with:
- cycle_impact: How the current cycle phase affects skin
- lifestyle_factors: Impact of sleep, hydration, stress, mood
- recommendations: Specific actionable advice
- priority_concerns: Top 3 concerns to address`;

/**
 * Skin Analysis Prompt (Gemini Vision)
 *
 * ⚠️ CRITICAL: This prompt MUST return JSON matching the SkinAnalysis type exactly!
 *
 * Used by: src/routes/analyzeSkin.ts
 * Input: Base64-encoded image
 * Output: SkinAnalysis JSON object
 *
 * Required JSON Structure:
 * {
 *   "acne": "none" | "mild" | "moderate" | "severe",
 *   "redness": "none" | "mild" | "moderate" | "severe",
 *   "dryness": "none" | "mild" | "moderate" | "severe",
 *   "oiliness": "none" | "mild" | "moderate" | "severe",
 *   "texture_notes": string[],
 *   "non_medical_summary": string,
 *   "probable_triggers": string[],
 *   "routine_focus": string[]
 * }
 *
 * You can modify the prompt instructions, but the output structure must match exactly.
 * See GEMINI_PROMPT_GUIDE.md for full documentation.
 */
export const SKIN_ANALYSIS_PROMPT = `Analyze the provided skin image and return a structured analysis in JSON format with:
- acne: "none" | "mild" | "moderate" | "severe"
- redness: "none" | "mild" | "moderate" | "severe"
- dryness: "none" | "mild" | "moderate" | "severe"
- oiliness: "none" | "mild" | "moderate" | "severe"
- texture_notes: array of texture observations
- non_medical_summary: brief summary
- probable_triggers: array of potential triggers
- routine_focus: array of focus areas

IMPORTANT: Return ONLY valid JSON (no markdown code blocks, no extra text). The JSON structure must match exactly as specified above.`;

/**
 * Routine Generation Prompt
 *
 * Used by: src/ai/routineGenerator.ts (optional enhancement)
 * Input: SkinProfile
 * Output: Routine JSON object
 *
 * Required JSON Structure:
 * {
 *   "am": RoutineStep[],
 *   "pm": RoutineStep[]
 * }
 *
 * Where RoutineStep = {
 *   "step_name": string,
 *   "product_name"?: string,
 *   "instruction": string
 * }
 */
export const ROUTINE_GENERATION_PROMPT = `Generate a personalized AM and PM skincare routine based on the skin profile.

Return JSON with:
- am: array of routine steps
- pm: array of routine steps

Each step should have:
- step_name: name of the step
- product_name: optional product recommendation
- instruction: detailed instruction

IMPORTANT: Return ONLY valid JSON (no markdown code blocks, no extra text).`;

/**
 * Product Matching Prompt
 *
 * Used by: src/logic/productMatcher.ts (AI-enhanced matching)
 * Input: SkinProfile + array of Products
 * Output: Array of product IDs sorted by relevance score
 *
 * Required JSON Structure:
 * {
 *   "ranked_products": [
 *     {
 *       "product_id": string,
 *       "score": number (0-100),
 *       "reason": string (explanation for why this product matches)
 *     }
 *   ]
 * }
 */
export const PRODUCT_MATCHING_PROMPT = `You are a skincare expert. Analyze the user's skin profile and match it with the provided products.

Consider:
- Skin concerns (acne, redness, dryness, oiliness)
- Texture issues and routine focus areas
- Cycle phase and lifestyle factors
- Ingredient compatibility and safety
- Product category alignment with routine needs

Return JSON with ranked_products array, where each item has:
- product_id: the product's ID
- score: relevance score from 0-100 (higher = better match)
- reason: brief explanation of why this product matches the user's needs

IMPORTANT: Return ONLY valid JSON (no markdown code blocks, no extra text). Rank products from most relevant to least relevant.`;
