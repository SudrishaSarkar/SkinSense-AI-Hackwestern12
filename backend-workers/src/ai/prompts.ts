// src/ai/prompts.ts

export const CYCLE_INSIGHTS_PROMPT = `You are a skincare expert. Analyze the provided skin analysis and cycle/lifestyle data to generate personalized insights.

Return a JSON object with:
- cycle_impact: How the current cycle phase affects skin
- lifestyle_factors: Impact of sleep, hydration, stress, mood
- recommendations: Specific actionable advice
- priority_concerns: Top 3 concerns to address`;

export const SKIN_ANALYSIS_PROMPT = `Analyze the provided skin image and return a structured analysis in JSON format with:
- acne: "none" | "mild" | "moderate" | "severe"
- redness: "none" | "mild" | "moderate" | "severe"
- dryness: "none" | "mild" | "moderate" | "severe"
- oiliness: "none" | "mild" | "moderate" | "severe"
- texture_notes: array of texture observations
- non_medical_summary: brief summary
- probable_triggers: array of potential triggers
- routine_focus: array of focus areas`;

export const ROUTINE_GENERATION_PROMPT = `Generate a personalized AM and PM skincare routine based on the skin profile.

Return JSON with:
- am: array of routine steps
- pm: array of routine steps

Each step should have:
- step_name: name of the step
- product_name: optional product recommendation
- instruction: detailed instruction`;

