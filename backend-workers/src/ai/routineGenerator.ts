// src/ai/routineGenerator.ts
import type { SkinProfile, Routine, RoutineStep, Env } from "../types";
import { callGemini } from "../aiSystemPrompts/geminiClient";
import { ROUTINE_GENERATION_PROMPT } from "./prompts";

/** ----------------------------------------------------------
 * 1. RULE-BASED LOGIC (core)
 * ---------------------------------------------------------- */

/**
 * Builds a deterministic AM/PM routine based on the SkinProfile
 * using rule-based logic only.
 * This output can then optionally be enhanced by Gemini.
 */
export function buildRuleBasedRoutine(profile: SkinProfile): Routine {
  const { skin_analysis: s, cycle_lifestyle: c } = profile;

  const steps: RoutineStep[] = [];

  /** --------------------------
   * AM ROUTINE LOGIC
   * -------------------------- */

  // AM ROUTINE
  // 1. Cleanser
  if (s.oiliness === "moderate" || s.oiliness === "severe") {
    steps.push({
      step: "Cleanser",
      time: "AM",
      description: "Use a gentle foaming cleanser to remove excess oil.",
    });
  } else if (s.dryness === "moderate" || s.dryness === "severe") {
    steps.push({
      step: "Cleanser",
      time: "AM",
      description: "Use a hydrating cream cleanser to support barrier health.",
    });
  } else {
    steps.push({
      step: "Cleanser",
      time: "AM",
      description: "Use a gentle, non-stripping cleanser.",
    });
  }

  // 2. Hydration / Serum
  if (s.dryness === "moderate" || s.dryness === "severe") {
    steps.push({
      step: "Hydrating Serum",
      time: "AM",
      description: "Apply a hyaluronic-acid based serum to boost hydration.",
    });
  }

  if (s.redness === "moderate" || s.redness === "severe") {
    steps.push({
      step: "Soothing Serum",
      time: "AM",
      description:
        "Use a niacinamide or centella-based serum to reduce visible redness.",
    });
  }

  // 3. Moisturizer
  if (s.oiliness === "severe") {
    steps.push({
      step: "Moisturizer",
      time: "AM",
      description: "Use a lightweight, oil-free gel moisturizer.",
    });
  } else if (s.dryness === "moderate" || s.dryness === "severe") {
    steps.push({
      step: "Moisturizer",
      time: "AM",
      description: "Use a barrier-repair moisturizer with ceramides.",
    });
  } else {
    steps.push({
      step: "Moisturizer",
      time: "AM",
      description: "Use a balanced moisturizer suitable for daily use.",
    });
  }

  // 4. Sunscreen
  steps.push({
    step: "Sunscreen",
    time: "AM",
    description: "Apply a broad-spectrum SPF 30+ sunscreen.",
  });

  // PM ROUTINE
  // 1. Cleanse
  steps.push({
    step: "Cleanser",
    time: "PM",
    description: "Use a gentle cleanser to remove sunscreen and buildup.",
  });

  // 2. Exfoliation (Cycle-phase aware)
  if (
    s.texture_notes.some((note) =>
      note.toLowerCase().includes("congestion")
    ) ||
    s.acne === "moderate" ||
    s.acne === "severe"
  ) {
    if (c.cycle_phase !== "menstrual") {
      steps.push({
        step: "Exfoliant (2–3x/week)",
        time: "PM",
        description:
          "Use a BHA liquid exfoliant 2–3 times per week to help unclog pores.",
      });
    }
  }

  // 3. Treatment (acne or redness)
  if (s.acne === "moderate" || s.acne === "severe") {
    steps.push({
      step: "Spot Treatment",
      time: "PM",
      description:
        "Use a gentle, non-drying spot treatment (e.g., salicylic acid or a sulfur-based spot treatment).",
    });
  }

  if (s.redness === "severe") {
    steps.push({
      step: "Soothing Serum",
      time: "PM",
      description: "Apply a calming serum containing centella or panthenol.",
    });
  }

  // 4. Moisturizer
  if (s.dryness === "severe") {
    steps.push({
      step: "Moisturizer",
      time: "PM",
      description:
        "Apply a rich moisturizer with ceramides or squalane for barrier repair.",
    });
  } else {
    steps.push({
      step: "Moisturizer",
      time: "PM",
      description: "Use a balanced night moisturizer.",
    });
  }

  return {
    steps,
    notes: `Personalized routine based on your skin analysis. Key focus: ${s.routine_focus.join(", ") || "general skin health"}.`,
  };
}

/** ----------------------------------------------------------
 * 2. AI-GENERATED ROUTINE (PRIMARY METHOD)
 * ---------------------------------------------------------- */

/**
 * Generates a COMPLETE personalized routine from scratch using Gemini AI.
 * This creates a fully customized routine based on the skin profile.
 */
export async function generateRoutineWithAI(
  profile: SkinProfile,
  env: Env
): Promise<Routine> {
  const prompt = `${ROUTINE_GENERATION_PROMPT}

User's Skin Profile:
${JSON.stringify(profile, null, 2)}

Generate a complete, personalized routine for this user.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const result = await callGemini("gemini-2.0-flash-001", payload, env);

    // Validate result structure
    if (!result || !result.steps || !Array.isArray(result.steps)) {
      console.warn("⚠️ Gemini returned invalid routine structure, using fallback");
      return buildRuleBasedRoutine(profile);
    }

    // Ensure all steps have required fields
    const validSteps = result.steps.map((step: any) => ({
      step: step.step || "Unknown Step",
      time: step.time || "AM_PM",
      description: step.description || "Follow product instructions",
    }));

    return {
      steps: validSteps,
      notes: result.notes || "Personalized routine based on your skin analysis.",
    };
  } catch (error: any) {
    console.error("❌ Error generating AI routine:", error);
    // Fallback to rule-based
    return buildRuleBasedRoutine(profile);
  }
}

/** ----------------------------------------------------------
 * 3. PRIMARY ENTRYPOINT FOR ROUTE / API
 * ---------------------------------------------------------- */

/**
 * Generates a personalized skincare routine.
 * Uses AI if available, falls back to rule-based.
 */
export async function generateRoutine(
  profile: SkinProfile,
  env?: Env
): Promise<Routine> {
  // If no Gemini key or env passed, return rule-based
  if (!env?.GEMINI_API_KEY) {
    console.log("📝 Using rule-based routine (no API key)");
    return buildRuleBasedRoutine(profile);
  }

  try {
    console.log("🤖 Generating AI-powered routine...");
    const aiRoutine = await generateRoutineWithAI(profile, env);
    console.log("✅ AI routine generated successfully");
    return aiRoutine;
  } catch (error: any) {
    console.error("⚠️ AI routine generation failed, using fallback:", error);
    return buildRuleBasedRoutine(profile);
  }
}

