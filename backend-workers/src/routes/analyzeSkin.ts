import { Env } from '..';
import { callGeminiVision } from '../ai/geminiClient';
import { SKIN_ANALYSIS_PROMPT } from '../ai/prompts';
import { SkinAnalysis, Level, GeminiSkinAnalysisResponse, GeminiGeneralSeverity } from '../types';

export type Gender = "male" | "female" | "prefer not to say";
export type AgeRange = "below 18" | "18-24" | "25-34" | "35-44" | "45+";

interface LikertAnswers {
  oily: number;
  hydrated: number;
  sensitive: number;
  breakouts: number;
}

interface AnalyzeSkinRequest {
  image: string; // "data:image/jpeg;base64,...";
  preExistingConditions: string[];
  likertAnswers: LikertAnswers;
  gender: Gender; // New field
  ageRange: AgeRange; // New field
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
 * Adapter function to map the new, detailed Gemini response (V2) to the legacy
 * SkinAnalysis interface (V1) to ensure frontend compatibility.
 * @param geminiResponse The detailed response from the Gemini Vision API.
 * @returns A `SkinAnalysis` object that the frontend expects.
 */
function mapGeminiResponseToLegacyAnalysis(geminiResponse: GeminiSkinAnalysisResponse): SkinAnalysis {
  
  const severityToLevel = (severity: GeminiGeneralSeverity | null): Level => {
    if (!severity) return "none";
    // This is a direct mapping, assuming the strings are identical.
    // If "severe" from Gemini should map to "high" in legacy, change it here.
    return severity as Level;
  };

  const texture_notes: string[] = [];
  if (geminiResponse.analysis_details.texture_and_aging.dullness_and_texture.is_dull) {
    texture_notes.push("Skin appears dull.");
  }
  if (geminiResponse.analysis_details.texture_and_aging.dullness_and_texture.has_uneven_texture) {
    texture_notes.push("Uneven skin texture observed.");
  }
  if (geminiResponse.analysis_details.texture_and_aging.enlarged_pores.has_enlarged_pores) {
    texture_notes.push(`Enlarged pores of ${geminiResponse.analysis_details.texture_and_aging.enlarged_pores.severity} severity noted.`);
  }
  if (geminiResponse.analysis_details.texture_and_aging.fine_lines_wrinkles.has_lines) {
    texture_notes.push("Fine lines are visible.");
  }
  if (geminiResponse.analysis_details.texture_and_aging.dullness_and_texture.description) {
      texture_notes.push(geminiResponse.analysis_details.texture_and_aging.dullness_and_texture.description);
  }


  const legacyAnalysis: SkinAnalysis = {
    acne: severityToLevel(geminiResponse.analysis_details.acne.severity),
    redness: severityToLevel(geminiResponse.analysis_details.redness_irritation.severity),
    
    // Infer dryness and oiliness from the new skin type field
    dryness: geminiResponse.skin_type.type === 'dry' ? 'mild' : 'none',
    oiliness: geminiResponse.skin_type.type === 'oily' ? 'mild' : 'none',

    texture_notes: texture_notes,
    non_medical_summary: geminiResponse.integrative_summary.summary_text,
    
    // These fields are not in the new V2 response, so we provide defaults. 
    probable_triggers: [], 
    
    // Map the new key_concerns directly to routine_focus
    routine_focus: geminiResponse.key_concerns || [],
  };

  return legacyAnalysis;
}


export async function analyzeSkin(request: Request, env: Env): Promise<Response> {
  let requestBody: AnalyzeSkinRequest;
  
  try {
    requestBody = await request.json();
    if (!requestBody.image) {
      return new Response(JSON.stringify({ error: 'Missing "image" in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!requestBody.preExistingConditions || !Array.isArray(requestBody.preExistingConditions)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid "preExistingConditions" in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!requestBody.likertAnswers || typeof requestBody.likertAnswers !== 'object') {
      return new Response(JSON.stringify({ error: 'Missing or invalid "likertAnswers" in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate new gender field
    const allowedGenders: Gender[] = ["male", "female", "prefer not to say"];
    if (!requestBody.gender || !allowedGenders.includes(requestBody.gender)) {
        return new Response(JSON.stringify({ error: 'Missing or invalid "gender" in request body. Must be "male", "female", or "prefer not to say".' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Validate new ageRange field
    const allowedAgeRanges: AgeRange[] = ["below 18", "18-24", "25-34", "35-44", "45+"];
    if (!requestBody.ageRange || !allowedAgeRanges.includes(requestBody.ageRange)) {
        return new Response(JSON.stringify({ error: 'Missing or invalid "ageRange" in request body. Must be "below 18", "18-24", "25-34", "35-44", or "45+".' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { base64, mimeType } = extractBase64(requestBody.image);

    const fullPrompt = SKIN_ANALYSIS_PROMPT(requestBody.preExistingConditions, requestBody.likertAnswers, requestBody.gender, requestBody.ageRange);

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
        const parsedJson: GeminiSkinAnalysisResponse = JSON.parse(jsonString);
        
        // ** ADAPTER PATTERN USAGE **
        // Map the new detailed response to the legacy format before sending to the client
        const legacyResponse = mapGeminiResponseToLegacyAnalysis(parsedJson);

        return new Response(JSON.stringify(legacyResponse), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        console.error("Failed to parse or map Gemini response. Raw JSON:", jsonString);
        return new Response(JSON.stringify({ error: 'AI returned invalid or unmappable JSON. Raw response: ' + jsonString }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error during skin analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}