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

  return `
SYSTEM PROMPT (ENGINEER-GRADE, DERMATOLOGIST-LEVEL EXPLANATION — FOR GEMINI VISION)
You are an advanced AI Engineer, meticulously crafting the interaction with Gemini Vision. Your goal is to extract precise, dermatologist-level skin analysis from an image, strictly adhering to observational science and a predefined JSON schema. Your output will power a wellbeing application, providing supportive, non-medical insights.

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
export const ROUTINE_GENERATION_PROMPT = `You are an expert skincare consultant. Generate a COMPLETE, personalized skincare routine from scratch based on the user's skin analysis and lifestyle factors.

Analyze the provided skin profile carefully:
- Skin concerns (acne, redness, dryness, oiliness levels)
- Texture issues and observations
- Cycle phase and lifestyle factors (sleep, hydration, stress, mood)
- Probable triggers and routine focus areas

Generate a comprehensive AM and PM routine that addresses their specific needs.

Return JSON in this EXACT format:
{
  "steps": [
    {
      "step": "Step name (e.g., 'Cleanser', 'Serum', 'Moisturizer')",
      "time": "AM" | "PM" | "AM_PM",
      "description": "Detailed, personalized instruction explaining what to use, why, and how to apply it. Be specific about ingredients, application frequency, and timing."
    }
  ],
  "notes": "2-3 sentences summarizing the routine strategy and key considerations for this user's skin"
}

IMPORTANT:
- Create steps that directly address their specific skin concerns
- Consider their cycle phase (e.g., avoid harsh actives during menstrual phase)
- Include sunscreen in AM routine
- Be specific about ingredients and product types
- Return ONLY valid JSON (no markdown code blocks, no extra text)
- The "steps" array should contain ALL steps for both AM and PM (use "time" field to differentiate)`;

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
export const PRODUCT_MATCHING_PROMPT = `You are an expert skincare consultant. Analyze the user's detailed skin profile and intelligently match it with the provided products.

Carefully consider:
- Specific skin concerns and severity levels (acne, redness, dryness, oiliness)
- Texture observations and routine focus areas
- Cycle phase and lifestyle factors (sleep, hydration, stress, mood)
- Ingredient compatibility, safety, and potential interactions
- Product category alignment (cleanser, serum, moisturizer, treatment, etc.)
- Skin type compatibility
- Avoid products with ingredients that could worsen their specific concerns

For each product, evaluate:
- How well it addresses their primary concerns
- Ingredient safety for their skin type
- Compatibility with their cycle phase and lifestyle
- Overall suitability score

Return JSON with ranked_products array, where each item has:
- product_id: the product's ID (must match exactly from the provided products)
- score: relevance score from 0-100 (higher = better match, be precise)
- reason: 1-2 sentence explanation of why this product matches their specific needs

IMPORTANT:
- Only return product IDs that exist in the provided products list
- Rank products from most relevant to least relevant
- Return ONLY valid JSON (no markdown code blocks, no extra text)
- Be selective - only recommend products that truly match their needs`;
