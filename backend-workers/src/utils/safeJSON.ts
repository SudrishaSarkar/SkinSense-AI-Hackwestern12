/**
 * Safe JSON parser that never throws
 * Returns parsed JSON or a fallback object if parsing fails
 */
export function safeJSON(text: string): any {
  if (!text || typeof text !== "string") {
    return { raw_text: text, error: "Invalid input: not a string" };
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // Return a structured object with the raw text for debugging
    return {
      raw_text: text,
      parse_error: e instanceof Error ? e.message : String(e),
      error: "Failed to parse JSON - Gemini may have returned natural language",
    };
  }
}

/**
 * Strips markdown code fences from JSON strings
 * Handles both ```json and ``` formats
 */
export function stripCodeFences(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  // Remove ```json ... ``` or ``` ... ```
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  return text.trim();
}

/**
 * Safe JSON parser with code fence stripping
 * First strips markdown, then parses JSON safely
 */
export function safeJSONParse(text: string): any {
  const cleaned = stripCodeFences(text);
  return safeJSON(cleaned);
}

