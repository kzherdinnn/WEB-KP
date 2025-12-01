# ❌ JSON PARSE ERROR - FIX GUIDE

## 🔍 **ERROR:**
```
Unexpected token '<', '<!DOCTYPE '... is not valid JSON
```

**Artinya:** Frontend dapat HTML dari backend (error page) instead of JSON

---

## ✅ **SOLUTION - CREATE .ENV.LOCAL:**

### **Step 1: Create Environment File**

Buat file baru: `client/.env.local`

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Clerk (sudah ada dari .env, kalau belum copy dari .env)
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Midtrans (optional, isi nanti)
# VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
```

### **Step 2: Restart Frontend**

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔧 **ALTERNATIVE QUICK FIX:**

If error masih ada, kemungkinan API_URL tidak proper. Check console log dengan:

1. **Open browser console** (F12)
2. **Check logs:** Should see `🔍 Fetching spareparts...`
3. **Check URL:** Should call `http://localhost:3000/api/spareparts`

---

## ✅ **VERIFY BACKEND:**

Test backend manual:

```
http://localhost:3000/api/spareparts
```

Should return JSON with 5 spareparts ✅

---

## 📝 **COMMON ISSUES:**

### **Issue 1: CORS Error**
**Solution:** Backend already has CORS enabled, tapi pastikan origin correct

### **Issue 2: Wrong Port**
**Solution:** Check backend running on port 3000, frontend on 5174

### **Issue 3: Env not loaded**
**Solution:** File name must be `.env.local` (not `.env.txt`)

---

## 🎯 **AFTER FIX:**

Refresh browser → Error should be gone → See 5 spareparts!

---

## 🛠️ **DEBUG STEPS:**

1. ✅ Backend running? → Check `http://localhost:3000/api/spareparts`
2. ✅ `.env.local` created? → Check file exists in `client/` folder
3. ✅ Frontend restarted? → Stop & restart `npm run dev`
4. ✅ Check console → See logs `🔍 Fetching spareparts...`

---

**Create .env.local file now and restart frontend!** 🚀
