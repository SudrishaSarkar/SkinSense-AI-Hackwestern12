import { callGemini } from "../ai/geminiClient";
import { SKIN_ANALYSIS_PROMPT } from "../ai/prompts";
import type { Env, SkinAnalysis } from "../types";
import { corsHeaders } from "../utils/cors";

/**
 * Mock skin analysis for local development/testing
 * Returns realistic sample data when ENVIRONMENT = "local"
 */
function getMockSkinAnalysis(): SkinAnalysis {
  return {
    acne: "mild",
    redness: "moderate",
    dryness: "none",
    oiliness: "mild",
    texture_notes: [
      "visible congestion around T-zone",
      "smooth texture on cheeks",
      "slight pore visibility",
    ],
    non_medical_summary:
      "Your skin appears moderately oily with mild inflammation around the cheeks and forehead. The T-zone shows some visible congestion, while the cheek area maintains a smoother texture. There's slight pore visibility, which is common with oilier skin types.",
    probable_triggers: ["stress", "sleep", "hormonal changes"],
    routine_focus: ["barrier repair", "oil control", "gentle exfoliation"],
  };
}

/**
 * Analyzes a skin image using Gemini Vision API
 *
 * Flow:
 * 1. Receives base64-encoded image
 * 2. In local mode: Returns mock data instantly
 * 3. In production: Sends to Gemini Vision with SKIN_ANALYSIS_PROMPT
 * 4. Returns SkinAnalysis JSON matching the type definition
 *
 * @param request - Contains { image: string } or { image_url: string }
 * @param env - Cloudflare Workers environment with GEMINI_API_KEY
 * @returns Response with SkinAnalysis JSON or error
 *
 * @see src/types/index.ts for SkinAnalysis structure
 * @see src/ai/prompts.ts for SKIN_ANALYSIS_PROMPT (can be modified)
 * @see GEMINI_PROMPT_GUIDE.md for prompt editing guidelines
 */
export async function handleAnalyzeSkin(request: Request, env: Env) {
  const body = (await request.json()) as {
    image?: string;
    image_url?: string;
  };

  const imageData = body.image || body.image_url || "";

  // Fast local mode - return mock data instantly (bypasses Gemini)
  if (env.ENVIRONMENT === "local") {
    const mockData = getMockSkinAnalysis();
    return new Response(JSON.stringify(mockData), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  if (!imageData) {
    return new Response(JSON.stringify({ error: "No image provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  // Enhanced prompt that asks Gemini to validate it's a face
  const enhancedPrompt = `${SKIN_ANALYSIS_PROMPT}

IMPORTANT: Only analyze if this is a clear image of a human face. If the image does not contain a face, return:
{
  "error": "Please upload a clear photo of your face",
  "acne": "none",
  "redness": "none",
  "dryness": "none",
  "oiliness": "none",
  "texture_notes": [],
  "non_medical_summary": "Unable to analyze: image does not appear to contain a face",
  "probable_triggers": [],
  "routine_focus": []
}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: enhancedPrompt },
          ...(imageData
            ? [{ inline_data: { mime_type: "image/jpeg", data: imageData } }]
            : []),
        ],
      },
    ],
  };

  try {
    const result = (await callGemini(
      "gemini-1.5-pro-latest",
      payload,
      env
    )) as SkinAnalysis;

    // Check if Gemini returned an error
    if ((result as any).error) {
      return new Response(JSON.stringify(result), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Failed to analyze image",
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
