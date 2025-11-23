// src/routes/cycleInsights.ts
import { callGemini } from "../aiSystemPrompts/geminiClient";
import { CYCLE_INSIGHTS_PROMPT } from "../ai/prompts";
import type { Env, SkinAnalysis, CycleLifestyleInput } from "../types";
import { corsHeaders } from "../utils/cors";
import { safeJSONParse } from "../utils/safeJSON";

export async function handleCycleInsights(
  request: Request,
  env: Env
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

  const skin = body.skin_analysis;
  const cycle =
    body.cycle_lifestyle ??
    ({
      cycle_phase: "unknown",
      sleep_hours: 7,
      hydration_cups: 6,
      stress_level: 3,
      mood: 3,
    } as CycleLifestyleInput);

  // Fallback: if no key, just echo cycle back
  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify(cycle), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  try {
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: CYCLE_INSIGHTS_PROMPT },
            {
              text: JSON.stringify({
                skin_analysis: skin,
                cycle_lifestyle: cycle,
              }),
            },
          ],
        },
      ],
    };

    const result = await callGemini("gemini-2.0-flash-001", payload, env);

    // Expecting { cycle_lifestyle: {...}, notes: "..." }
    const cycleOut: CycleLifestyleInput = result?.cycle_lifestyle ?? cycle;

    return new Response(JSON.stringify(cycleOut), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (err: any) {
    console.error("cycleInsights Gemini error:", err);
    // Fallback: return input cycle
    return new Response(JSON.stringify(cycle), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}
