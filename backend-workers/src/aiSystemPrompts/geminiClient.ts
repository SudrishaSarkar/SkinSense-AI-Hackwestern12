// src/ai/geminiClient.ts
import type { Env } from "../types";

interface GeminiContentPart {
  text?: string;
  inline_data?: {
    mime_type: string;
    data: string;
  };
}

interface GeminiContent {
  parts: GeminiContentPart[];
  role?: string;
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  index?: number;
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
  modelVersion?: string;
}

/**
 * VISION CALL — images + text (Gemini 2.5 Flash)
 */
export async function callGeminiVision(
  base64Image: string,
  mimeType: string,
  prompt: string,
  apiKey: string
): Promise<GeminiResponse> {
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(apiKey);

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
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

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gemini Vision Error ${resp.status}: ${text}`);
  }

  return (await resp.json()) as GeminiResponse;
}

/**
 * TEXT-ONLY CALL — for routine generation & cycle insights
 */
export async function callGemini(
  model: string,
  payload: any,
  env: Env
): Promise<any> {
  const url =
    "https://generativelanguage.googleapis.com/v1/models/" +
    model +
    ":generateContent?key=" +
    encodeURIComponent(env.GEMINI_API_KEY);

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await resp.json()) as {
    error?: any;
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
      output_text?: string;
    }>;
  };

  if (!resp.ok || (data && data.error)) {
    throw new Error(
      `Gemini Text Error ${resp.status}: ${JSON.stringify(data.error || data)}`
    );
  }

  // Try to parse first candidate as JSON
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.output_text ??
    "{}";

  try {
    return JSON.parse(text);
  } catch {
    // If model didn't strictly follow JSON, return raw data for debugging
    return data;
  }
}
