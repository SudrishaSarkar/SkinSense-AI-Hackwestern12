import { callGemini } from "../ai/geminiClient";
import { CYCLE_INSIGHTS_PROMPT } from "../ai/prompts";
import type { Env, SkinAnalysis, CycleLifestyleInput } from "../types";

export async function handleCycleInsights(request: Request, env: Env) {
  const body = (await request.json()) as {
    skin_analysis?: SkinAnalysis;
    cycle_lifestyle?: CycleLifestyleInput;
  };
  
  const skin = body.skin_analysis as SkinAnalysis;
  const cycle = body.cycle_lifestyle as CycleLifestyleInput;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: CYCLE_INSIGHTS_PROMPT },
          { text: JSON.stringify({ skin, cycle }) },
        ],
      },
    ],
  };

  const result = await callGemini("gemini-1.5-pro-latest", payload, env);

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}

