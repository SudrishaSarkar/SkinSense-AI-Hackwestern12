/**
 * API client for SkinSense AI Backend
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Convert file to base64 string (removes data URL prefix)
 * Returns { base64: string, mimeType: string }
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove "data:image/jpeg;base64," prefix
      const dataUrl = reader.result;
      const [header, base64] = dataUrl.split(",");
      // Extract mime type from header: "data:image/jpeg;base64"
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : file.type || "image/jpeg";
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze skin image using Gemini Vision API (frontend)
 * @param {string} base64 - Base64 encoded image (without data URL prefix)
 * @param {string} mimeType - MIME type of the image
 * @param {string[]} preExistingConditions - Optional pre-existing conditions
 * @param {object} likertAnswers - Optional Likert scale answers
 * @returns {Promise<object>} SkinAnalysisResponse JSON from Gemini
 */
export async function analyzeImageFrontend(
  base64,
  mimeType,
  preExistingConditions = [],
  likertAnswers = {
    oily: 3,
    hydrated: 3,
    sensitive: 3,
    breakouts: 3,
  }
) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Please add it to your .env file."
    );
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build the prompt (same as backend)
  const prompt = `
You are a non-medical skincare analysis assistant.

You will receive:
- A facial image
- Some self-reported answers about the user's skin

Your job:
1. Visually analyze the skin (non-medical, cosmetic only).
2. Combine this with the user's answers.
3. Return STRICT JSON describing your findings using this schema:

{
  "ai_findings": {
    "acne": string | null,            // e.g. "mild inflammatory acne on cheeks" or null
    "redness": string | null,         // e.g. "moderate diffuse redness around nose" or null
    "dryness": string | null,         // e.g. "dry patches around mouth" or null
    "oiliness": string | null,        // e.g. "oily t-zone with visible shine" or null
    "texture": string[],              // short bullet points describing texture
    "other_observations": string[]    // other non-medical notes visible in the image
  },
  "combined_interpretation": string   // 2–4 sentences summarizing your view of their skin
}

Rules:
- DO NOT mention diseases, diagnoses, or medical conditions.
- DO NOT recommend prescription treatments.
- DO NOT wrap the JSON in backticks or markdown.
- DO NOT add any extra keys beyond the schema.
- Be concise but specific.

User context:
- Pre-existing conditions: ${JSON.stringify(preExistingConditions)}
- Self-reported Likert answers (1–5):
  - Oily: ${likertAnswers.oily}
  - Hydrated: ${likertAnswers.hydrated}
  - Sensitive: ${likertAnswers.sensitive}
  - Breakouts: ${likertAnswers.breakouts}
`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const response = result.response;
    const text = response.text();

    // Try to extract JSON from the response
    // Remove markdown code fences if present
    let jsonString = text.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)```/i) || 
                      jsonString.match(/```\s*([\s\S]*?)```/i);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    // Parse the JSON
    const analysis = JSON.parse(jsonString);
    return analysis;
  } catch (error) {
    console.error("Error calling Gemini Vision API:", error);
    throw new Error(
      `Failed to analyze image: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Generate complete skincare recommendation bundle
 * NEW FLOW: Calls Gemini from frontend, then sends analysis to backend
 * @param {string|object} imageData - Base64 encoded image string OR { base64, mimeType } object
 * @param {object} lifestyle - Optional lifestyle data
 * @param {string[]} preExistingConditions - Optional pre-existing conditions
 * @param {object} likertAnswers - Optional Likert scale answers
 * @returns {Promise<object>} Complete recommendation bundle
 */
export async function generateRecommendationBundle(
  imageData,
  lifestyle = null,
  preExistingConditions = [],
  likertAnswers = {
    oily: 3,
    hydrated: 3,
    sensitive: 3,
    breakouts: 3,
  }
) {
  const url = `${API_BASE_URL}/api/recommendation-bundle`;

  // Handle both old format (string) and new format (object with base64 and mimeType)
  const imageBase64 =
    typeof imageData === "string" ? imageData : imageData?.base64 || imageData;
  const mimeType =
    typeof imageData === "string" ? undefined : imageData?.mimeType;

  // Validate we have base64 data
  if (!imageBase64 || typeof imageBase64 !== "string") {
    throw new Error(
      "Invalid image data format. Expected string or { base64, mimeType } object."
    );
  }

  // STEP 1: Call Gemini Vision API from frontend
  console.log("🔍 Step 1: Analyzing image with Gemini (frontend)...");
  let skinAnalysisJson;
  try {
    skinAnalysisJson = await analyzeImageFrontend(
      imageBase64,
      mimeType || "image/jpeg",
      preExistingConditions,
      likertAnswers
    );
    console.log("✅ Gemini analysis complete:", skinAnalysisJson);
  } catch (error) {
    console.error("❌ Gemini analysis failed:", error);
    throw new Error(
      `Failed to analyze image: ${error.message || "Unknown error"}`
    );
  }

  // STEP 2: Send pre-analyzed JSON to backend (along with image for display purposes)
  const body = {
    skinAnalysisJson, // Pre-analyzed skin analysis from Gemini
    imageBase64, // Keep image for display/fallback
    ...(mimeType && { mimeType }),
    ...(lifestyle && { lifestyle }),
  };

  console.log(
    "📤 Step 2: Sending pre-analyzed data to backend:",
    url,
    "skinAnalysisJson keys:",
    Object.keys(skinAnalysisJson)
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    // Check if backend returned a specific error message
    const errorMessage =
      error.error || error.details || `API error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return await response.json();
}
