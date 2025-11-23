import { getGoogleAccessToken } from "./googleAuth";

export async function callGeminiVision(
  base64Image: string,
  mimeType: string,
  prompt: string,
  env: Env
) {
  const accessToken = await getGoogleAccessToken(env);

  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

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
          { text: prompt },
        ],
      },
    ],
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(
      `Gemini Vision Error ${resp.status}: ${JSON.stringify(data)}`
    );
  }

  return data;
}
