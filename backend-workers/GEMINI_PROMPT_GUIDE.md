# Gemini Vision Prompt Guide

## Overview
This guide explains how to modify the Gemini Vision prompt for skin analysis without breaking the frontend/backend integration.

## Current Implementation
The skin analysis happens in `src/routes/analyzeSkin.ts` which:
1. Receives a base64-encoded image
2. Sends it to Gemini Vision API with `SKIN_ANALYSIS_PROMPT`
3. Expects a JSON response matching the `SkinAnalysis` type

## Required JSON Schema

**⚠️ IMPORTANT:** The prompt MUST return JSON matching this exact structure:

```typescript
{
  acne: "none" | "mild" | "moderate" | "severe",
  redness: "none" | "mild" | "moderate" | "severe",
  dryness: "none" | "mild" | "moderate" | "severe",
  oiliness: "none" | "mild" | "moderate" | "severe",
  texture_notes: string[],           // Array of texture observations
  non_medical_summary: string,       // Brief human-readable summary
  probable_triggers: string[],       // Array of potential triggers
  routine_focus: string[]            // Array of focus areas for routine
}
```

### Field Descriptions

- **acne**: Severity level of acne/breakouts
- **redness**: Severity level of redness/inflammation
- **dryness**: Severity level of dryness/flakiness
- **oiliness**: Severity level of oiliness/shine
- **texture_notes**: Specific observations like "visible congestion", "flakiness", "rough texture"
- **non_medical_summary**: Plain-language explanation (2-3 sentences) of what the model sees
- **probable_triggers**: Potential causes like "stress", "sleep", "barrier damage", "hormonal"
- **routine_focus**: Areas to focus on like "barrier repair", "oil control", "hydration", "soothing"

## Where to Edit

**File:** `src/ai/prompts.ts`

**Variable:** `SKIN_ANALYSIS_PROMPT`

You can modify the prompt text to:
- Improve analysis accuracy
- Add more detailed instructions
- Change the tone/style of responses
- Add specific observation guidelines

**Just make sure the JSON structure matches exactly!**

## Example Prompt Template

```typescript
export const SKIN_ANALYSIS_PROMPT = `You are a skincare expert analyzing a facial skin image.

Analyze the image and return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "acne": "none" | "mild" | "moderate" | "severe",
  "redness": "none" | "mild" | "moderate" | "severe",
  "dryness": "none" | "mild" | "moderate" | "severe",
  "oiliness": "none" | "mild" | "moderate" | "severe",
  "texture_notes": ["observation1", "observation2"],
  "non_medical_summary": "Brief 2-3 sentence summary",
  "probable_triggers": ["trigger1", "trigger2"],
  "routine_focus": ["focus1", "focus2"]
}

Guidelines:
- Be specific but non-medical in language
- Focus on visible, observable characteristics
- Consider lighting and image quality
- Return valid JSON only`;
```

## Testing Your Prompt

1. Update `SKIN_ANALYSIS_PROMPT` in `src/ai/prompts.ts`
2. Run `npm run dev` in `backend-workers`
3. Test with: `POST /api/analyze-skin` with `{ "image": "base64..." }`
4. Verify the response matches the schema above

## Error Handling

If the image doesn't contain a face, return:
```json
{
  "error": "Please upload a clear photo of your face",
  "acne": "none",
  "redness": "none",
  "dryness": "none",
  "oiliness": "none",
  "texture_notes": [],
  "non_medical_summary": "Unable to analyze: image does not appear to contain a face",
  "probable_triggers": [],
  "routine_focus": []
}
```

## Integration Points

The `SkinAnalysis` response flows through:
1. `analyzeSkin.ts` → Returns `SkinAnalysis`
2. `recommendationBundle.ts` → Uses it to create `SkinProfile`
3. `routineGenerator.ts` → Generates routine based on analysis
4. `productMatcher.ts` → Matches products to skin profile
5. Frontend → Displays all data in UI

**All of these depend on the exact JSON structure above!**

