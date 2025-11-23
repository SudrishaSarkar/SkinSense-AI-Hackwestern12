import { callGemini } from "../ai/geminiClient";
import { SKIN_ANALYSIS_PROMPT } from "../ai/prompts";
import type { Env, SkinAnalysis } from "../types";

export async function handleAnalyzeSkin(request: Request, env: Env) {
  const body = (await request.json()) as {
    image?: string;
    image_url?: string;
  };

  const imageData = body.image || body.image_url || "";

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: SKIN_ANALYSIS_PROMPT },
          ...(imageData
            ? [{ inline_data: { mime_type: "image/jpeg", data: imageData } }]
            : []),
        ],
      },
    ],
  };

  const result = (await callGemini(
    "gemini-1.5-pro-latest",
    payload,
    env
  )) as SkinAnalysis;

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
