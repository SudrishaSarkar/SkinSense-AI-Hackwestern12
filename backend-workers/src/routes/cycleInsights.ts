import { callGemini } from "../ai/geminiClient";
import { CYCLE_INSIGHTS_PROMPT } from "../ai/prompts";
import type { Env, SkinAnalysis, CycleLifestyleInput } from "../types";
import { corsHeaders } from "../utils/cors";

/**
 * Mock cycle insights for local development/testing
 * Returns the lifestyle input with some enhancements when ENVIRONMENT = "local"
 */
function getMockCycleInsights(
  cycle: CycleLifestyleInput
): CycleLifestyleInput {
  // Just return the input with any defaults filled in
  return {
    cycle_phase: cycle.cycle_phase || "unknown",
    sleep_hours: cycle.sleep_hours || 7,
    hydration_cups: cycle.hydration_cups || 6,
    stress_level: cycle.stress_level || 3,
    mood: cycle.mood || 3,
    notes: cycle.notes || "Mock data for local testing",
  };
}

export async function handleCycleInsights(request: Request, env: Env) {
  const body = (await request.json()) as {
    skin_analysis?: SkinAnalysis;
    cycle_lifestyle?: CycleLifestyleInput;
  };
  
  const skin = body.skin_analysis as SkinAnalysis;
  const cycle = body.cycle_lifestyle as CycleLifestyleInput;

  // Fast local mode - return mock data instantly (bypasses Gemini)
  if (env.ENVIRONMENT === "local") {
    const mockData = getMockCycleInsights(cycle);
    return new Response(JSON.stringify(mockData), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

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

  try {
    const result = await callGemini("gemini-1.5-pro-latest", payload, env);

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate cycle insights",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}

