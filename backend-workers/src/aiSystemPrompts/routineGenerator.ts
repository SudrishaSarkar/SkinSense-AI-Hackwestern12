// src/ai/routineGenerator.ts
import type { Env, SkinProfile, Routine, RoutineStep } from "../types";
import { callGemini } from "./geminiClient";

function buildRuleBasedRoutineInternal(profile: SkinProfile): Routine {
  const { skin_analysis } = profile;
  const steps: RoutineStep[] = [];

  // AM
  steps.push({
    step: "Gentle Cleanser",
    time: "AM",
    description:
      "Use a gentle, non-stripping cleanser to wash your face for 30–60 seconds.",
  });

  if (skin_analysis.acne !== "none" || skin_analysis.oiliness !== "none") {
    steps.push({
      step: "Active Treatment (e.g. BHA or Niacinamide)",
      time: "AM",
      description:
        "Apply a thin layer of a gentle acne treatment or oil-control serum, avoiding over-use.",
    });
  }

  steps.push({
    step: "Moisturizer",
    time: "AM",
    description:
      "Apply a lightweight, non-comedogenic moisturizer to maintain barrier function.",
  });

  steps.push({
    step: "Sunscreen SPF 30+",
    time: "AM",
    description:
      "Use a broad-spectrum sunscreen every morning as the last step, even on cloudy days.",
  });

  // PM
  steps.push({
    step: "Double Cleanse (if wearing makeup/SPF)",
    time: "PM",
    description:
      "Use an oil-based cleanser first if you wore makeup or heavy sunscreen, followed by your gentle cleanser.",
  });

  if (skin_analysis.texture_notes.length > 0) {
    steps.push({
      step: "Gentle Exfoliant (1–3x/week)",
      time: "PM",
      description:
        "On non-consecutive nights, use a mild chemical exfoliant to smooth texture. Avoid over-exfoliation.",
    });
  }

  steps.push({
    step: "Barrier Repair Moisturizer",
    time: "PM",
    description:
      "Use a richer moisturizer at night to support skin barrier and recovery.",
  });

  return {
    steps,
    notes:
      "This routine is non-medical and focuses on barrier support, gentle actives, and daily SPF. Adjust frequency of actives if you experience irritation.",
  };
}

export function buildRuleBasedRoutine(profile: SkinProfile): Routine {
  return buildRuleBasedRoutineInternal(profile);
}

export async function generateRoutine(
  profile: SkinProfile,
  env: Env
): Promise<Routine> {
  // Fast fallback mode or no key → rule-based only
  if (!env.GEMINI_API_KEY || env.ENVIRONMENT === "local") {
    return buildRuleBasedRoutineInternal(profile);
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a skincare routine designer (non-medical).

You will receive a JSON object with:
- "skin_analysis": ${JSON.stringify(profile.skin_analysis)}
- "cycle_lifestyle": ${JSON.stringify(profile.cycle_lifestyle)}

Return STRICT JSON with this schema:

{
  "steps": [
    {
      "step": string,            // e.g. "Cleanser"
      "time": "AM" | "PM" | "AM_PM",
      "description": string
    }
  ],
  "notes": string                // short explanation and disclaimers
}

Rules:
- 4–8 total steps is ideal.
- Focus on barrier support, simple actives, and SPF.
- Do not mention prescription drugs or diagnoses.
- No markdown, no backticks.
`,
          },
        ],
      },
    ],
  };

  try {
    const result = await callGemini("gemini-2.0-flash-001", payload, env);
    if (result?.steps && Array.isArray(result.steps)) {
      return result as Routine;
    }
    // If model didn't follow schema, fall back
    return buildRuleBasedRoutineInternal(profile);
  } catch (err) {
    console.error("Routine Gemini error:", err);
    return buildRuleBasedRoutineInternal(profile);
  }
}
