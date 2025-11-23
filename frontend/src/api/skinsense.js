/**
 * API client for SkinSense AI Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

/**
 * Convert file to base64 string and detect MIME type
 * Returns: { base64: string, mimeType: string }
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract base64 and MIME type from data URL
      const dataUrl = reader.result;
      const match = dataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
      if (!match) {
        reject(new Error("Invalid image format"));
        return;
      }
      const mimeType = match[1]; // e.g., "image/jpeg", "image/png"
      const base64 = match[2];
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate complete skincare recommendation bundle
 * @param {string} imageBase64 - Base64 encoded image (without data URL prefix)
 * @param {string} mimeType - MIME type of the image (e.g., "image/jpeg", "image/png")
 * @param {object} lifestyle - Optional lifestyle data
 * @returns {Promise<object>} Complete recommendation bundle
 */
export async function generateRecommendationBundle(imageBase64, mimeType, lifestyle = null) {
  const url = `${API_BASE_URL}/api/recommendation-bundle`;

  const body = {
    imageBase64,
    mimeType, // Include MIME type so backend knows the actual format
    ...(lifestyle && { lifestyle }),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    // Check if backend returned a specific error message
    const errorMessage = error.error || error.details || `API error: ${response.status}`;
    // Include full error details for debugging
    const fullError = new Error(errorMessage);
    fullError.details = error;
    fullError.status = response.status;
    throw fullError;
  }

  return await response.json();
}

