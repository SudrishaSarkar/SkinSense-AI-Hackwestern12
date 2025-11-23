import type { Env, SkinAnalysisResponse } from "../types";
import { callGeminiVision } from "../ai/geminiClient";
import { SKIN_ANALYSIS_PROMPT } from "../ai/prompts";
import type { SkinAnalysis, Level } from "../types";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface LikertAnswers {
  oily: number;
  hydrated: number;
  sensitive: number;
  breakouts: number;
}

export type Gender = "male" | "female" | "prefer not to say";
export type AgeRange = "below 18" | "18-24" | "25-34" | "35-44" | "45+";

interface AnalyzeSkinRequest {
  image?: string; // OLD FORMAT (data URL)
  imageBase64?: string; // NEW FORMAT — PURE BASE64 ONLY
  mimeType?: string; // NEW FORMAT
  preExistingConditions: string[];
  likertAnswers: LikertAnswers;
  gender: Gender;
  ageRange: AgeRange;
  sleepHours: number;
  stressLevel: number;
}

function extractBase64(dataUrl: string): { base64: string; mimeType: string } {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) throw new Error("Invalid data URL format");
  return { mimeType: match[1], base64: match[2] };
}

function mapNewSkinAnalysisToLegacyAnalysis(
  newResponse: SkinAnalysisResponse
): SkinAnalysis {
  const mapSeverity = (desc: string | null): Level => {
    if (!desc) return "none";
    const text = desc.toLowerCase();
    if (text.includes("severe")) return "severe";
    if (text.includes("moderate")) return "moderate";
    if (text.includes("mild")) return "mild";
    return "none";
  };

  return {
    acne: mapSeverity(newResponse.ai_findings.acne),
    redness: mapSeverity(newResponse.ai_findings.redness),
    dryness: mapSeverity(newResponse.ai_findings.dryness),
    oiliness: mapSeverity(newResponse.ai_findings.oiliness),
    texture_notes: [
      ...newResponse.ai_findings.texture,
      ...newResponse.ai_findings.other_observations,
    ],
    non_medical_summary: newResponse.combined_interpretation,
    probable_triggers: [],
    routine_focus: [],
  };
}

export async function analyzeSkin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: AnalyzeSkinRequest;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // BACKWARD COMPATIBILITY DEFAULTS
  if (body.image && !body.preExistingConditions) {
    body.preExistingConditions = [];
    body.likertAnswers = { oily: 3, hydrated: 3, sensitive: 3, breakouts: 3 };
    body.gender = "prefer not to say";
    body.ageRange = "25-34";
    body.sleepHours = 7;
    body.stressLevel = 3;
  }

  // --- IMAGE EXTRACTION LOGIC (supports both modes) ---
  let base64: string;
  let mimeType: string;

  try {
    if (body.image?.startsWith("data:")) {
      // ---- OLD FORMAT: data URL ----
      const extracted = extractBase64(body.image);
      base64 = extracted.base64;
      mimeType = extracted.mimeType;
      console.log("📷 Using old data URL mode");
    } else if (body.imageBase64) {
      // ---- NEW FORMAT ----
      base64 = body.imageBase64;
      mimeType = body.mimeType || "image/jpeg";
      console.log("📷 Using new base64 + mimeType mode");
    } else {
      return new Response(
        JSON.stringify({
          error:
            "No image provided. Provide either `image` (data URL) or `imageBase64` + `mimeType`.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process image",
        detail: String(error),
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Build the Gemini prompt
  const fullPrompt = SKIN_ANALYSIS_PROMPT(
    body.preExistingConditions,
    body.likertAnswers
  );

  try {
    if (!env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const geminiResult = await callGeminiVision(
      base64,
      mimeType,
      fullPrompt,
      env.GEMINI_API_KEY
    );

    const text = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Gemini returned no text response");

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;

    const parsed = JSON.parse(jsonString);

    const legacy = mapNewSkinAnalysisToLegacyAnalysis(parsed);

    return new Response(JSON.stringify(legacy), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Gemini Vision Error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export const handleAnalyzeSkin = analyzeSkin;
