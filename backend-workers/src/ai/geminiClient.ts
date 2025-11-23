// backend-workers/src/ai/geminiClient.ts
import type { Env } from "../types";

interface GeminiSafetyRating {
  category: string;
  probability: string;
}

interface GeminiContent {
  parts: { text?: string; inline_data?: any }[];
  role: string;
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
  index: number;
  safetyRatings: GeminiSafetyRating[];
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

/**
 * VISION CALL — images + text
 */
export async function callGeminiVision(
  base64Image: string,
  mimeType: string,
  prompt: string,
  apiKey: string
): Promise<GeminiResponse> {
  // Use gemini-2.5-flash (available on free tier, supports vision)
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType, // Gemini API expects snake_case
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Vision Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * TEXT-ONLY CALL — for routine generation & cycle insights
 */
export async function callGemini(
  model: string,
  payload: any,
  env: Env
): Promise<any> {
  // FIXED: always use v1 (v1beta deprecated)
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as any;

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text);
  } catch {
    return data;
  }
}
