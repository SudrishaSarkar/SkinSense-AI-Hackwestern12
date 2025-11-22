// src/aiSystemPrompts/prompts.ts

export const ROUTINE_PROMPT = `Generate a personalized AM and PM skincare routine based on the skin profile.

Return JSON with:
- am: array of routine steps
- pm: array of routine steps

Each step should have:
- step_name: name of the step
- product_name: optional product recommendation
- instruction: detailed instruction

Enhance the provided rule-based routine with more natural descriptions, improved ordering, and ingredient insights while maintaining the core logic.`;

