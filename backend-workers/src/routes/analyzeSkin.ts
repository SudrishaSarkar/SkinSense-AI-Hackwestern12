import type { Env, SkinAnalysisResponse } from "../types";
import { callGeminiVision } from "../ai/geminiClient";
import { SKIN_ANALYSIS_PROMPT } from "../ai/prompts";
import type { SkinAnalysis, Level } from "../types";

interface LikertAnswers {
  oily: number;
  hydrated: number;
  sensitive: number;
  breakouts: number;
}

// These types are kept in AnalyzeSkinRequest as they are user inputs,
// even if not directly interpolated into the current SKIN_ANALYSIS_PROMPT.
export type Gender = "male" | "female" | "prefer not to say";
export type AgeRange = "below 18" | "18-24" | "25-34" | "35-44" | "45+";

interface AnalyzeSkinRequest {
  image: string; // "data:image/jpeg;base64,...";
  preExistingConditions: string[];
  likertAnswers: LikertAnswers;
  gender: Gender;
  ageRange: AgeRange;
  sleepHours: number;
  stressLevel: number; // 1-5
}

function extractBase64(dataUrl: string): { base64: string; mimeType: string } {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data URL format");
  }
  const mimeType = match[1];
  const base64 = match[2];
  return { base64, mimeType };
}

/**
 * Adapter function to map the new, detailed SkinAnalysisResponse to the legacy
 * SkinAnalysis interface to ensure frontend compatibility.
 * @param newResponse The detailed response from the Gemini Vision API using the new schema.
 * @returns A `SkinAnalysis` object that the frontend expects.
 */
function mapNewSkinAnalysisToLegacyAnalysis(
  newResponse: SkinAnalysisResponse
): SkinAnalysis {
  const mapSeverity = (description: string | null): Level => {
    if (!description) return "none";
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes("severe")) return "severe";
    if (lowerDescription.includes("moderate")) return "moderate";
    if (lowerDescription.includes("mild")) return "mild";
    return "none"; // Default or if no specific severity found
  };

  const texture_notes: string[] = [
    ...newResponse.ai_findings.texture,
    ...newResponse.ai_findings.other_observations,
  ];

  const legacyAnalysis: SkinAnalysis = {
    acne: mapSeverity(newResponse.ai_findings.acne),
    redness: mapSeverity(newResponse.ai_findings.redness),
    dryness: mapSeverity(newResponse.ai_findings.dryness),
    oiliness: mapSeverity(newResponse.ai_findings.oiliness),
    texture_notes: texture_notes,
    non_medical_summary: newResponse.combined_interpretation,
    probable_triggers: [], // The new prompt doesn't have a direct field for this, it's inferred in combined_interpretation
    routine_focus: [], // The new prompt doesn't have a direct field for this
  };

  // Attempt to extract probable triggers from combined_interpretation if possible
  // This is a heuristic and might need refinement based on Gemini's actual output patterns
  const triggersFromInterpretation = newResponse.combined_interpretation.match(
    /(dehydration|stress|hormonal phase|lack of sleep|comedogenic products|over-exfoliation|pollution|dry air)/gi
  );
  if (triggersFromInterpretation) {
    legacyAnalysis.probable_triggers = Array.from(
      new Set(triggersFromInterpretation.map((t) => t.toLowerCase()))
    );
  }

  return legacyAnalysis;
}

export async function analyzeSkin(
  request: Request,
  env: Env
): Promise<Response> {
  let requestBody: any;

  try {
    requestBody = await request.json();

    // Backward compatibility: if only image is provided, use defaults
    if (requestBody.image && !requestBody.preExistingConditions) {
      requestBody = {
        image: requestBody.image,
        preExistingConditions: [],
        likertAnswers: {
          oily: 3,
          hydrated: 3,
          sensitive: 3,
          breakouts: 3,
        },
        gender: "prefer not to say",
        ageRange: "25-34",
        sleepHours: 7,
        stressLevel: 3,
      };
    }

    if (!requestBody.image) {
      return new Response(
        JSON.stringify({ error: 'Missing "image" in request body' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (
      !requestBody.preExistingConditions ||
      !Array.isArray(requestBody.preExistingConditions)
    ) {
      return new Response(
        JSON.stringify({
          error: 'Missing or invalid "preExistingConditions" in request body',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (
      !requestBody.likertAnswers ||
      typeof requestBody.likertAnswers !== "object"
    ) {
      return new Response(
        JSON.stringify({
          error: 'Missing or invalid "likertAnswers" in request body',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const allowedGenders: Gender[] = ["male", "female", "prefer not to say"];
    if (!requestBody.gender || !allowedGenders.includes(requestBody.gender)) {
      return new Response(
        JSON.stringify({
          error:
            'Missing or invalid "gender" in request body. Must be "male", "female", or "prefer not to say".',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const allowedAgeRanges: AgeRange[] = [
      "below 18",
      "18-24",
      "25-34",
      "35-44",
      "45+",
    ];
    if (
      !requestBody.ageRange ||
      !allowedAgeRanges.includes(requestBody.ageRange)
    ) {
      return new Response(
        JSON.stringify({
          error:
            'Missing or invalid "ageRange" in request body. Must be "below 18", "18-24", "25-34", "35-44", or "45+".',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (
      typeof requestBody.sleepHours !== "number" ||
      requestBody.sleepHours < 0 ||
      requestBody.sleepHours > 24
    ) {
      return new Response(
        JSON.stringify({
          error:
            'Missing or invalid "sleepHours" in request body. Must be a number between 0 and 24.',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (
      typeof requestBody.stressLevel !== "number" ||
      requestBody.stressLevel < 1 ||
      requestBody.stressLevel > 5
    ) {
      return new Response(
        JSON.stringify({
          error:
            'Missing or invalid "stressLevel" in request body. Must be a number between 1 and 5.',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { base64, mimeType } = extractBase64(requestBody.image);

    const fullPrompt = SKIN_ANALYSIS_PROMPT(
      requestBody.preExistingConditions,
      requestBody.likertAnswers
    );

    const geminiResponse = await callGeminiVision(
      base64,
      mimeType,
      fullPrompt,
      env.GEMINI_API_KEY
    );

    const responseText = geminiResponse.candidates[0].content.parts[0].text;
    const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/);

    let jsonString = responseText;
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    try {
      const parsedJson: SkinAnalysisResponse = JSON.parse(jsonString);

      // Map the new detailed response to the legacy format before sending to the client
      const legacyResponse = mapNewSkinAnalysisToLegacyAnalysis(parsedJson);

      return new Response(JSON.stringify(legacyResponse), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(
        "Failed to parse or map Gemini response. Raw JSON:",
        jsonString
      );
      return new Response(
        JSON.stringify({
          error:
            "AI returned invalid or unmappable JSON. Raw response: " +
            jsonString,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error during skin analysis:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Export alias for compatibility with existing code
export const handleAnalyzeSkin = analyzeSkin;
