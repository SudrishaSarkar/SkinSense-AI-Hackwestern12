// src/routes/analyzeSkin.ts
import type { Env, SkinAnalysis, SkinAnalysisResponse, Level } from "../types";
import { callGeminiVision } from "../aiSystemPrompts/geminiClient";
import { SKIN_ANALYSIS_PROMPT } from "../aiSystemPrompts/prompts";
import { corsHeaders } from "../utils/cors";

interface LikertAnswers {
  oily: number;
  hydrated: number;
  sensitive: number;
  breakouts: number;
}

export type Gender = "male" | "female" | "prefer not to say";
export type AgeRange = "below 18" | "18-24" | "25-34" | "35-44" | "45+";

interface AnalyzeSkinRequest {
  image?: string; // "data:image/jpeg;base64,..."
  imageBase64?: string; // raw base64
  mimeType?: string;
  preExistingConditions?: string[];
  likertAnswers?: LikertAnswers;
  gender?: Gender;
  ageRange?: AgeRange;
  sleepHours?: number;
  stressLevel?: number;
}

function extractBase64FromDataUrl(dataUrl: string): {
  base64: string;
  mimeType: string;
} {
  const match = dataUrl.match(/^data:(image\/[\w+.-]+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format");
  }
  const mimeType = match[1];
  const base64 = match[2];
  return { base64, mimeType };
}

function mapNewSkinAnalysisToLegacy(
  newResponse: SkinAnalysisResponse
): SkinAnalysis {
  const mapSeverity = (description: string | null): Level => {
    if (!description) return "none";
    const lower = description.toLowerCase();
    if (lower.includes("severe")) return "severe";
    if (lower.includes("moderate")) return "moderate";
    if (lower.includes("mild")) return "mild";
    return "none";
  };

  const texture_notes: string[] = [
    ...(newResponse.ai_findings.texture || []),
    ...(newResponse.ai_findings.other_observations || []),
  ];

  const analysis: SkinAnalysis = {
    acne: mapSeverity(newResponse.ai_findings.acne),
    redness: mapSeverity(newResponse.ai_findings.redness),
    dryness: mapSeverity(newResponse.ai_findings.dryness),
    oiliness: mapSeverity(newResponse.ai_findings.oiliness),
    texture_notes,
    non_medical_summary: newResponse.combined_interpretation,
    probable_triggers: [],
    routine_focus: [],
  };

  const triggers = newResponse.combined_interpretation.match(
    /(dehydration|stress|hormonal|lack of sleep|comedogenic|over-exfoliation|pollution|dry air)/gi
  );
  if (triggers) {
    analysis.probable_triggers = Array.from(
      new Set(triggers.map((t) => t.toLowerCase()))
    );
  }

  return analysis;
}

/**
 * Try to extract JSON from the model response.
 * - If it’s inside ```json ... ``` fences, pull that out.
 * - Otherwise assume the whole string is JSON.
 */
function extractJsonString(rawText: string): string {
  // Look for ```json ... ``` or ``` ... ```
  const fencedMatch =
    rawText.match(/```json\s*([\s\S]*?)```/i) ||
    rawText.match(/```\s*([\s\S]*?)```/i);

  if (fencedMatch && fencedMatch[1]) {
    return fencedMatch[1].trim();
  }

  // No fences – return the whole thing as-is
  return rawText.trim();
}

/**
 * Fallback: if Gemini didn't give valid JSON, return a very simple
 * SkinAnalysis so the pipeline still works instead of 500-ing.
 */
function buildFallbackAnalysis(rawText: string): SkinAnalysis {
  return {
    acne: "none",
    redness: "none",
    dryness: "none",
    oiliness: "none",
    texture_notes: [rawText.slice(0, 400)],
    non_medical_summary: rawText,
    probable_triggers: [],
    routine_focus: [],
  };
}

export async function handleAnalyzeSkin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: AnalyzeSkinRequest;

  try {
    body = (await request.json()) as AnalyzeSkinRequest;
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

  // Backwards compatibility: frontend may send only { image: dataUrl }
  if (body.image && !body.imageBase64 && !body.mimeType) {
    const { base64, mimeType } = extractBase64FromDataUrl(body.image);
    body.imageBase64 = base64;
    body.mimeType = mimeType;
  }

  if (!body.imageBase64 || !body.mimeType) {
    return new Response(
      JSON.stringify({
        error:
          'Missing "imageBase64" or "mimeType". Either send { image: "data:image/...;base64,..." } or { imageBase64, mimeType }.',
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const preExistingConditions = body.preExistingConditions ?? [];
  const likertAnswers: LikertAnswers = body.likertAnswers ?? {
    oily: 3,
    hydrated: 3,
    sensitive: 3,
    breakouts: 3,
  };

  if (!env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "GEMINI_API_KEY is not set in environment variables. Cannot analyze skin.",
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

  try {
    const prompt = SKIN_ANALYSIS_PROMPT(preExistingConditions, likertAnswers);

    const geminiResp = await callGeminiVision(
      body.imageBase64,
      body.mimeType,
      prompt,
      env.GEMINI_API_KEY
    );

    if (
      !geminiResp.candidates ||
      !geminiResp.candidates[0]?.content?.parts?.[0]?.text
    ) {
      throw new Error("Gemini returned no text content");
    }

    const rawText = geminiResp.candidates[0].content.parts[0].text.trim();
    console.log("🔍 Gemini rawText (first 300 chars):", rawText.slice(0, 300));

    // 1) Try to extract JSON substring
    const jsonString = extractJsonString(rawText);

    let analysis: SkinAnalysis;

    try {
      const parsed = JSON.parse(jsonString) as SkinAnalysisResponse;
      analysis = mapNewSkinAnalysisToLegacy(parsed);
      console.log("✅ Parsed Gemini JSON successfully");
    } catch (parseErr) {
      console.error(
        "⚠️ Failed to parse Gemini JSON, using fallback:",
        parseErr
      );
      analysis = buildFallbackAnalysis(rawText);
    }

    return new Response(JSON.stringify(analysis), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (err: any) {
    console.error("❌ Error during skin analysis:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Unknown error during skin analysis",
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
