// src/ai/routineGenerator.ts
import type { SkinProfile, Routine, RoutineStep, Env } from "../types";
import { callGemini } from "./geminiClient";
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

  const am: RoutineStep[] = [];
  const pm: RoutineStep[] = [];

  /** --------------------------
   * AM ROUTINE LOGIC
   * -------------------------- */

  // 1. Cleanser
  if (s.oiliness === "moderate" || s.oiliness === "severe") {
    am.push({
      step_name: "Cleanser",
      instruction: "Use a gentle foaming cleanser to remove excess oil.",
    });
  } else if (s.dryness === "moderate" || s.dryness === "severe") {
    am.push({
      step_name: "Cleanser",
      instruction: "Use a hydrating cream cleanser to support barrier health.",
    });
  } else {
    am.push({
      step_name: "Cleanser",
      instruction: "Use a gentle, non-stripping cleanser.",
    });
  }

  // 2. Hydration / Serum
  if (s.dryness === "moderate" || s.dryness === "severe") {
    am.push({
      step_name: "Hydrating Serum",
      instruction: "Apply a hyaluronic-acid based serum to boost hydration.",
    });
  }

  if (s.redness === "moderate" || s.redness === "severe") {
    am.push({
      step_name: "Soothing Serum",
      instruction:
        "Use a niacinamide or centella-based serum to reduce visible redness.",
    });
  }

  // 3. Moisturizer
  if (s.oiliness === "severe") {
    am.push({
      step_name: "Moisturizer",
      instruction: "Use a lightweight, oil-free gel moisturizer.",
    });
  } else if (s.dryness === "moderate" || s.dryness === "severe") {
    am.push({
      step_name: "Moisturizer",
      instruction: "Use a barrier-repair moisturizer with ceramides.",
    });
  } else {
    am.push({
      step_name: "Moisturizer",
      instruction: "Use a balanced moisturizer suitable for daily use.",
    });
  }

  // 4. Sunscreen
  am.push({
    step_name: "Sunscreen",
    instruction: "Apply a broad-spectrum SPF 30+ sunscreen.",
  });

  /** --------------------------
   * PM ROUTINE LOGIC
   * -------------------------- */

  // 1. Cleanse
  pm.push({
    step_name: "Cleanser",
    instruction: "Use a gentle cleanser to remove sunscreen and buildup.",
  });

  // 2. Exfoliation (Cycle-phase aware)
  if (s.texture_notes.includes("visible congestion") || s.acne === "moderate") {
    if (c.cycle_phase !== "menstrual") {
      pm.push({
        step_name: "Exfoliant (2–3x/week)",
        instruction:
          "Use a BHA liquid exfoliant 2–3 times per week to help unclog pores.",
      });
    }
  }

  // 3. Treatment (acne or redness)
  if (s.acne === "moderate" || s.acne === "severe") {
    pm.push({
      step_name: "Spot Treatment",
      instruction:
        "Use a gentle, non-drying spot treatment (e.g., salicylic acid or a sulfur-based spot treatment).",
    });
  }

  if (s.redness === "severe") {
    pm.push({
      step_name: "Soothing Serum",
      instruction: "Apply a calming serum containing centella or panthenol.",
    });
  }

  // 4. Moisturizer
  if (s.dryness === "severe") {
    pm.push({
      step_name: "Moisturizer",
      instruction:
        "Apply a rich moisturizer with ceramides or squalane for barrier repair.",
    });
  } else {
    pm.push({
      step_name: "Moisturizer",
      instruction: "Use a balanced night moisturizer.",
    });
  }

  // 5. Optional Cycle-Based Adjustments
  if (c.cycle_phase === "luteal") {
    pm.push({
      step_name: "Luteal Phase Support",
      instruction:
        "During the luteal phase, keep skincare soothing and avoid new actives.",
    });
  }

  if (c.stress_level >= 4) {
    pm.push({
      step_name: "Stress Recovery Tip",
      instruction:
        "High stress can increase oiliness and redness — consider a soothing serum.",
    });
  }

  return { am, pm };
}

/** ----------------------------------------------------------
 * 2. OPTIONAL GEMINI REFINEMENT (UPGRADE ROUTINE)
 * ---------------------------------------------------------- */

/**
 * Enhances the rule-based routine using Gemini.
 * This produces more natural descriptions, improved ordering,
 * and ingredient insights.
 */
export async function enhanceRoutineWithGemini(
  profile: SkinProfile,
  routine: Routine,
  env: Env
): Promise<Routine> {
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: ROUTINE_GENERATION_PROMPT },
          { text: JSON.stringify({ profile, routine }) },
        ],
      },
    ],
  };

  const result = await callGemini("gemini-1.5-pro-latest", payload, env);

  // If Gemini fails, return rule-based routine instead
  if (!result || !result.am || !result.pm) {
    return routine;
  }

  return result as Routine;
}

/** ----------------------------------------------------------
 * 3. PRIMARY ENTRYPOINT FOR ROUTE / API
 * ---------------------------------------------------------- */

export async function generateRoutine(
  profile: SkinProfile,
  env?: Env
): Promise<Routine> {
  const ruleBase = buildRuleBasedRoutine(profile);

  // If no Gemini key or env passed, return rule-based
  if (!env?.GEMINI_API_KEY) return ruleBase;

  try {
    const enhanced = await enhanceRoutineWithGemini(profile, ruleBase, env);
    return enhanced;
  } catch {
    return ruleBase;
  }
}

