# Quick Test Instructions

## ✅ Everything is Connected!

Frontend ↔ Backend ↔ Gemini API - all wired up.

## 🚀 How to Test (3 Steps)

### 1️⃣ Start Backend (Terminal 1)

```powershell
cd backend-workers
npm run dev
```

**Wait for:** `⬣ Listening on http://127.0.0.1:8787`

**Test it:** Open http://localhost:8787/test in browser
- Should see: `{"status":"ok","message":"Worker is running!"}`

### 2️⃣ Start Frontend (Terminal 2 - NEW TERMINAL)

```powershell
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

### 3️⃣ Test in Browser

1. Open: http://localhost:5173
2. Login/Signup (any email/password works)
3. Upload a face photo
4. Fill the form (gender, age, questions)
5. Click "Generate my skin care plan"
6. Wait 10-30 seconds (Gemini API call)
7. See results! 🎉

## ⚠️ Before Testing - Set Gemini API Key

**Required for skin analysis to work:**

```powershell
cd backend-workers
wrangler secret put GEMINI_API_KEY
```

When prompted, paste your Gemini API key.

**Get key from:** https://makersuite.google.com/app/apikey

## 🐛 Quick Troubleshooting

**Backend won't start?**
- Make sure you're in `backend-workers` folder
- Run `npm install` if needed

**Frontend can't connect?**
- Make sure backend is running on port 8787
- Check: http://localhost:8787/test works

**"Generate" button does nothing?**
- Check browser console (F12) for errors
- Check Network tab - is API call happening?
- Make sure Gemini API key is set

**No results showing?**
- Check browser console for errors
- Check Network tab - did API return data?
- Make sure image is a clear face photo

## ✅ Success Checklist

- [ ] Backend running on port 8787
- [ ] Frontend running on port 5173
- [ ] Can upload image
- [ ] Can fill form
- [ ] "Generate" button works
- [ ] Results appear in UI

## 📊 What You Should See

After clicking "Generate":
1. Loading spinner appears
2. After 10-30 seconds, results appear
3. Skin analysis bars (acne, redness, etc.)
4. AM/PM routine steps
5. Product recommendations with prices

---

**Full testing guide:** See `TESTING_GUIDE.md` for detailed instructions.

