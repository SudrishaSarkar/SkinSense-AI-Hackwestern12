// src/ai/geminiClient.ts
import type { Env } from "../types";

/**
 * Gemini API Response Structure
 */
interface GeminiResponse {
  error?: any;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

/**
 * Calls Google Gemini API
 * 
 * This is a generic wrapper that:
 * 1. Sends payload to Gemini API
 * 2. Extracts JSON from response text
 * 3. Parses and returns the JSON
 * 
 * Used by:
 * - analyzeSkin.ts (Gemini Vision for skin analysis)
 * - cycleInsights.ts (Text generation for cycle insights)
 * - routineGenerator.ts (Text generation for routine enhancement)
 * 
 * @param model - Gemini model name (e.g., "gemini-1.5-pro-latest")
 * @param payload - Gemini API payload (contents array with text/image parts)
 * @param env - Cloudflare Workers environment with GEMINI_API_KEY
 * @returns Parsed JSON response from Gemini
 * 
 * @throws Error if Gemini API returns an error
 */
export async function callGemini(
  model: string,
  payload: any,
  env: Env
): Promise<any> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = (await response.json()) as GeminiResponse;

  if (data.error) throw new Error(JSON.stringify(data.error));

  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text);
  } catch {
    return data;
  }
}

