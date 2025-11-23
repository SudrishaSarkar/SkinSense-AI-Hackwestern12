# Testing Guide - SkinSense AI

## ✅ Connection Status

Everything is connected:

- ✅ Frontend → Backend API (`http://localhost:8787`)
- ✅ Backend → Gemini Vision API
- ✅ Backend → Product matching & price comparison
- ✅ All routes are wired up

## 🚀 Quick Start Testing

### Step 1: Set Up Backend API Key

**IMPORTANT:** You need a Gemini API key for skin analysis to work.

```bash
cd backend-workers
wrangler secret put GEMINI_API_KEY
# When prompted, paste your Gemini API key
```

Or set it temporarily in `wrangler.toml` (not recommended for production):

```toml
GEMINI_API_KEY = "AIzaSyAqQ-DZ00ZrtQNQ-0iKHPGZMN3BLfbei1Y"
```

### Step 2: Start Backend Server

Open **Terminal 1**:

```bash
cd backend-workers
npm run dev
```

You should see:

```
⬣ Listening on http://127.0.0.1:8787
```

**Test the backend is running:**

- Open browser: http://localhost:8787
- Should see API info JSON
- Or: http://localhost:8787/test
- Should see: `{"status":"ok","message":"Worker is running!"}`

### Step 3: Start Frontend Server

Open **Terminal 2** (new terminal):

```bash
cd frontend
npm run dev
```

You should see:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network:  use --host to expose
```

### Step 4: Test the Full Flow

1. **Open browser:** http://localhost:5173

2. **Login/Signup:**

   - Use any email/password (frontend-only auth for demo)
   - Click "Log in" or "Sign up"

3. **Upload Image:**

   - Click "📸 Upload or capture a photo"
   - Select a clear face photo (JPEG/PNG, max 10MB)
   - Should see "Image added ✔"

4. **Fill Form:**

   - Select Gender
   - Select Age Range
   - Answer Likert questions (oily, dry, intensity)
   - Button should become active when all fields filled

5. **Generate Plan:**

   - Click "Generate my skin care plan"
   - Should see loading spinner
   - Wait for API response (may take 10-30 seconds for Gemini)

6. **View Results:**
   - Should automatically scroll to "Step 1: AI Skin Analysis"
   - See skin analysis bars (acne, redness, oiliness, dryness)
   - See skin summary text
   - Scroll down to see:
     - Step 2: Routine (AM/PM)
     - Step 3: Products (with prices)
     - Step 4: Stores

## 🧪 Testing Individual Endpoints

### Test Backend API Directly

**1. Test endpoint (health check):**

```bash
curl http://localhost:8787/test
```

**2. Get API info:**

```bash
curl http://localhost:8787/
```

**3. Test skin analysis (requires base64 image):**

```bash
# This is complex - better to test via frontend
# Or use Postman/Insomnia with a base64 image
```

### Test Frontend → Backend Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Generate my skin care plan"
4. Look for request to: `http://localhost:8787/api/recommendation-bundle`
5. Check:
   - ✅ Request sent (Status 200 = success)
   - ✅ Response contains: `skin_profile`, `routine`, `recommended_products`, `price_comparisons`

## 🐛 Troubleshooting

### Backend won't start

- **Error:** `wrangler: command not found`

  - Fix: `npm install -g wrangler` or `npm install` in `backend-workers`

- **Error:** `GEMINI_API_KEY is not set`
  - Fix: Set it via `wrangler secret put GEMINI_API_KEY`

### Frontend can't connect to backend

- **Error:** `Failed to fetch` or `Network error`
  - Check: Is backend running on port 8787?
  - Check: Open http://localhost:8787/test in browser
  - Check: Browser console for CORS errors (shouldn't happen in dev)

### Gemini API errors

- **Error:** `API error: 401` or `Invalid API key`

  - Fix: Check your Gemini API key is correct
  - Get key from: https://makersuite.google.com/app/apikey

- **Error:** `API error: 429` (Rate limit)
  - Fix: Wait a few minutes, Gemini has rate limits

### Image upload issues

- **Error:** "Please upload an image file"

  - Fix: Make sure file is JPEG/PNG
  - Fix: Check file size < 10MB

- **Error:** "Image does not contain a face"
  - Fix: Upload a clear photo of a face
  - This is intentional validation

### No data showing in results

- **Check:** Browser console for errors
- **Check:** Network tab - did API call succeed?
- **Check:** Is `apiData` populated? (React DevTools → Components)

## 📊 Expected API Response Structure

When you click "Generate", the API should return:

```json
{
  "skin_profile": {
    "skin_analysis": {
      "acne": "mild",
      "redness": "moderate",
      "dryness": "none",
      "oiliness": "mild",
      "texture_notes": ["visible congestion", "smooth texture"],
      "non_medical_summary": "Your skin appears...",
      "probable_triggers": ["stress", "sleep"],
      "routine_focus": ["barrier repair", "oil control"]
    },
    "cycle_lifestyle": { ... },
    "combined_triggers": []
  },
  "routine": {
    "am": [
      { "step_name": "Cleanser", "instruction": "..." }
    ],
    "pm": [ ... ]
  },
  "recommended_products": [ ... ],
  "price_comparisons": [ ... ]
}
```

## 🎯 Quick Test Checklist

- [ ] Backend starts on port 8787
- [ ] Frontend starts on port 5173
- [ ] Can login/signup
- [ ] Can upload image
- [ ] Can fill form
- [ ] "Generate" button becomes active
- [ ] API call succeeds (check Network tab)
- [ ] Results display in UI
- [ ] Skin analysis bars show data
- [ ] Routine shows AM/PM steps
- [ ] Products show with prices

## 🔍 Debug Mode

**Enable verbose logging:**

Backend (add to `src/index.ts`):

```typescript
console.log("Request:", pathname, request.method);
```

Frontend (already in code):

```javascript
console.error("Error generating plan:", error);
```

Check browser console and terminal for logs.

## 📝 Notes

- **Local mode:** Backend uses `ENVIRONMENT = "local"` which returns mock price data instantly
- **Gemini calls:** May take 10-30 seconds (Gemini Vision API)
- **Price fetching:** In local mode, returns mock data. In production, fetches real prices.

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Backend shows "Worker is running!" at `/test`
2. ✅ Frontend loads without errors
3. ✅ Image upload works
4. ✅ Form validation works
5. ✅ "Generate" button calls API
6. ✅ Results appear in UI sections
7. ✅ No errors in browser console
8. ✅ No errors in backend terminal

---

**Need help?** Check:

- Browser DevTools Console (F12)
- Backend terminal output
- Network tab in DevTools
