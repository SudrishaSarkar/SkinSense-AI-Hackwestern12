// src/aiSystemPrompts/geminiClient.ts
import type { Env } from "../types";

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
