import { Env } from '..';
import { callGeminiVision } from '../ai/geminiClient';
import { SKIN_ANALYSIS_PROMPT } from '../ai/prompts';
import { SkinAnalysisResponse } from '../types';




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

    const allowedGenders: Gender[] = ["male", "female", "prefer not to say"];
    if (!requestBody.gender || !allowedGenders.includes(requestBody.gender)) {
        return new Response(JSON.stringify({ error: 'Missing or invalid "gender" in request body. Must be "male", "female", or "prefer not to say".' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const allowedAgeRanges: AgeRange[] = ["below 18", "18-24", "25-34", "35-44", "45+"];
    if (!requestBody.ageRange || !allowedAgeRanges.includes(requestBody.ageRange)) {
        return new Response(JSON.stringify({ error: 'Missing or invalid "ageRange" in request body. Must be "below 18", "18-24", "25-34", "35-44", or "45+".' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (typeof requestBody.sleepHours !== 'number' || requestBody.sleepHours < 0 || requestBody.sleepHours > 24) {
      return new Response(JSON.stringify({ error: 'Missing or invalid "sleepHours" in request body. Must be a number between 0 and 24.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof requestBody.stressLevel !== 'number' || requestBody.stressLevel < 1 || requestBody.stressLevel > 5) {
      return new Response(JSON.stringify({ error: 'Missing or invalid "stressLevel" in request body. Must be a number between 1 and 5.' }), {
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
        
        return new Response(JSON.stringify(parsedJson), {
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