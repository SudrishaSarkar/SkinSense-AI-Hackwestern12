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
 * Generate skincare routine using Gemini AI (frontend)
 * @param {object} skinAnalysisJson - The skin analysis from Gemini Vision
 * @param {object} lifestyle - Optional lifestyle data
 * @returns {Promise<object>} Routine with steps array
 */
export async function generateRoutineFrontend(skinAnalysisJson, lifestyle = null) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Please add it to your .env file."
    );
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  const prompt = `You are an expert skincare consultant. Generate a COMPLETE, personalized skincare routine from scratch based on the user's skin analysis.

Skin Analysis:
${JSON.stringify(skinAnalysisJson, null, 2)}

${lifestyle ? `Lifestyle Factors:\n${JSON.stringify(lifestyle, null, 2)}` : ""}

Generate a comprehensive AM and PM routine that addresses their specific needs.

Return JSON in this EXACT format:
{
  "steps": [
    {
      "step": "Step name (e.g., 'Cleanser', 'Serum', 'Moisturizer')",
      "time": "AM" | "PM" | "AM_PM",
      "description": "Detailed, personalized instruction explaining what to use, why, and how to apply it. Be specific about ingredients, application frequency, and timing."
    }
  ],
  "notes": "2-3 sentences summarizing the routine strategy and key considerations for this user's skin"
}

IMPORTANT:
- Create steps that directly address their specific skin concerns
- Include sunscreen in AM routine
- Be specific about ingredients and product types
- Return ONLY valid JSON (no markdown code blocks, no extra text)
- The "steps" array should contain ALL steps for both AM and PM (use "time" field to differentiate)`;

  try {
    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    const response = result.response;
    const text = response.text();

    // Extract JSON
    let jsonString = text.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)```/i) || 
                      jsonString.match(/```\s*([\s\S]*?)```/i);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    const routine = JSON.parse(jsonString);
    return routine;
  } catch (error) {
    console.error("Error generating routine:", error);
    throw new Error(`Failed to generate routine: ${error.message || "Unknown error"}`);
  }
}

/**
 * Generate product recommendations using Gemini AI (frontend)
 * @param {object} skinAnalysisJson - The skin analysis from Gemini Vision
 * @param {object} routine - The generated routine
 * @returns {Promise<array>} Array of recommended products
 */
export async function generateProductsFrontend(skinAnalysisJson, routine) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not set. Please add it to your .env file."
    );
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

  const prompt = `You are an expert skincare consultant. Based on the user's skin analysis and routine, recommend specific skincare products.

Skin Analysis:
${JSON.stringify(skinAnalysisJson, null, 2)}

Routine:
${JSON.stringify(routine, null, 2)}

Recommend 6-8 specific skincare products that match their needs. For each product, provide:
- Product name (be specific, use real brand names if possible)
- Category (cleanser, serum, moisturizer, sunscreen, treatment, etc.)
- Key ingredients
- Why it's recommended for their skin
- Price estimate (in CAD)

Return JSON in this format:
{
  "products": [
    {
      "name": "Product Name",
      "brand": "Brand Name",
      "category": "Category",
      "key_ingredients": ["ingredient1", "ingredient2"],
      "recommendation_reason": "Why this product is good for their skin",
      "price_estimate": 25.99
    }
  ]
}

IMPORTANT: Return ONLY valid JSON (no markdown code blocks, no extra text).`;

  try {
    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    const response = result.response;
    const text = response.text();

    // Extract JSON
    let jsonString = text.trim();
    const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)```/i) || 
                      jsonString.match(/```\s*([\s\S]*?)```/i);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    const data = JSON.parse(jsonString);
    return data.products || [];
  } catch (error) {
    console.error("Error generating products:", error);
    throw new Error(`Failed to generate products: ${error.message || "Unknown error"}`);
  }
}

/**
 * Generate complete skincare recommendation bundle
 * NEW FLOW: All Gemini calls from frontend
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

  // STEP 1: Analyze image with Gemini Vision
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

  // STEP 2: Generate routine with Gemini
  console.log("🤖 Step 2: Generating routine with Gemini (frontend)...");
  let routine;
  try {
    routine = await generateRoutineFrontend(skinAnalysisJson, lifestyle);
    console.log("✅ Routine generated:", routine);
  } catch (error) {
    console.error("❌ Routine generation failed:", error);
    throw new Error(
      `Failed to generate routine: ${error.message || "Unknown error"}`
    );
  }

  // STEP 3: Generate products with Gemini
  console.log("🛍️ Step 3: Generating product recommendations with Gemini (frontend)...");
  let products;
  try {
    products = await generateProductsFrontend(skinAnalysisJson, routine);
    console.log("✅ Products generated:", products);
  } catch (error) {
    console.error("❌ Product generation failed:", error);
    // Don't throw - products are optional
    products = [];
  }

  // STEP 4: Fetch prices from backend (uses Amazon & Sephora API keys)
  console.log("💰 Step 4: Fetching prices from backend...");
  const priceComparisons = [];
  
  if (products.length > 0) {
    try {
      // Fetch prices for each product from backend
      const pricePromises = products.map(async (product) => {
        try {
          const priceResponse = await fetch(`${API_BASE_URL}/api/price-compare?product=${encodeURIComponent(product.name)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (priceResponse.ok) {
            // Backend returns PriceComparisonResult with product_name, prices, cheapest_store
            const priceData = await priceResponse.json();
            return priceData; // Already in the correct format
          }
        } catch (err) {
          console.error(`Price fetch failed for ${product.name}:`, err);
        }
        // Fallback if price fetch fails
        return {
          product_name: product.name,
          prices: [
            {
              store: "AmazonCA",
              price: null,
              url: `https://www.amazon.ca/s?k=${encodeURIComponent(product.name)}`,
              image: null,
              last_checked: Date.now(),
            },
            {
              store: "SephoraCA",
              price: null,
              url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(product.name)}`,
              image: null,
              last_checked: Date.now(),
            },
            {
              store: "Shoppers",
              price: null,
              url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(product.name)}`,
              image: null,
              last_checked: Date.now(),
            },
          ],
          cheapest_store: undefined,
        };
      });

      const fetchedPrices = await Promise.all(pricePromises);
      priceComparisons.push(...fetchedPrices);
      console.log("✅ Prices fetched for", fetchedPrices.length, "products");
    } catch (error) {
      console.error("❌ Price fetching failed:", error);
      // Continue without prices - not critical
    }
  }

  // Return complete bundle
  return {
    skin_analysis: skinAnalysisJson,
    routine: routine,
    recommended_products: products,
    price_comparisons: priceComparisons,
  };
}
