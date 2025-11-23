# SkinSense-AI-Hackwestern12

## Quick Links

- **Backend API Documentation**: See `backend-workers/README.md` (if exists)
- **Gemini Prompt Guide**: See `backend-workers/GEMINI_PROMPT_GUIDE.md` (for editing AI prompts)
- **Frontend**: `frontend/` directory
- **Backend**: `backend-workers/` directory

## Project Structure

```
SkinSense-AI-Hackwestern12/
├── backend-workers/          # Cloudflare Workers backend
│   ├── src/
│   │   ├── ai/               # Gemini AI integration
│   │   │   ├── prompts.ts   # ⚠️ AI prompts (can be edited)
│   │   │   └── geminiClient.ts
│   │   ├── routes/           # API route handlers
│   │   ├── logic/            # Business logic
│   │   └── types/            # TypeScript type definitions
│   └── GEMINI_PROMPT_GUIDE.md  # Guide for editing prompts
├── frontend/                 # React + Vite frontend
└── README.md                 # This file
```

## For Prompt Editors

If you're working on improving the Gemini Vision prompt for skin analysis:

1. **Read**: `backend-workers/GEMINI_PROMPT_GUIDE.md`
2. **Edit**: `backend-workers/src/ai/prompts.ts` → `SKIN_ANALYSIS_PROMPT`
3. **Test**: Run `cd backend-workers && npm run dev`
4. **Important**: The JSON structure must match `SkinAnalysis` type exactly!

See the guide for full details.
