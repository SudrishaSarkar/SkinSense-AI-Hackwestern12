/**
 * API client for SkinSense AI Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

/**
 * Convert file to base64 string (removes data URL prefix)
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove "data:image/jpeg;base64," prefix
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate complete skincare recommendation bundle
 * @param {string} imageBase64 - Base64 encoded image (without data URL prefix)
 * @param {object} lifestyle - Optional lifestyle data
 * @returns {Promise<object>} Complete recommendation bundle
 */
export async function generateRecommendationBundle(imageBase64, lifestyle = null) {
  const url = `${API_BASE_URL}/api/recommendation-bundle`;

  const body = {
    imageBase64,
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
    throw new Error(errorMessage);
  }

  return await response.json();
}

