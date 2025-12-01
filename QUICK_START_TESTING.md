# ⚡ QUICK START TESTING

## 🧪 **API Testing dengan Browser/Postman**

### **Test 1: Get Spareparts (No Auth Required)**

**Browser:**
```
http://localhost:3000/api/spareparts
```

**Expected Result:**
```json
{
  "success": true,
  "data": [...5 spareparts...],
  "total": 5
}
```

---

### **Test 2: Get Services**

**Browser:**
```
http://localhost:3000/api/services
```

**Expected Result:**
```json
{
  "success": true,  
  "data": [...6 services...],
  "total": 6
}
```

---

### **Test 3: Get Workshop Info**

**Browser:**
```
http://localhost:3000/api/workshop
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "name": "AutoSound Workshop",
    "address": "...",
    "timeSlots": ["09:00", "10:00", ...],
    ...
  }
}
```

---

### **Test 4: Get Available Time Slots**

**Browser:**
```
http://localhost:3000/api/workshop/timeslots?date=2025-12-15
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "bookingsCount": 0,
      "maxBookings": 3,
      "isAvailable": true
    },
    ...
  ]
}
```

---

## ✅ **QUICK VERIFICATION CHECKLIST**

Buka browser dan test URL ini satu per satu:

- [ ] http://localhost:3000/api/spareparts → Returns 5 items
- [ ] http://localhost:3000/api/services → Returns 6 items  
- [ ] http://localhost:3000/api/technicians → Returns 3 items
- [ ] http://localhost:3000/api/workshop → Returns workshop info
- [ ] http://localhost:3000/api/workshop/timeslots?date=2025-12-15 → Returns time slots

**Jika semua return data → Backend API ✅ WORKS!**

---

## 💳 **MIDTRANS QUICK SETUP**

### **Step 1: Get Credentials (5 menit)**

1. Login: https://dashboard.sandbox.midtrans.com
2. Settings → Access Keys
3. Copy:
   - Client Key: `SB-Mid-client-xxxxx`
   - Server Key: `SB-Mid-server-xxxxx`

### **Step 2: Update .env Files**

**Server** (`server/.env`):
```env
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_IS_PRODUCTION=false
```

**Client** (`client/.env.local`):
```env
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
```

### **Step 3: Setup Webhook (10 menit)**

**Option A: Using ngrok (Recommended for testing)**
```bash
# Download: https://ngrok.com/download
# Run in separate terminal:
ngrok http 3000
```

Copy URL: `https://xxxx.ngrok-free.app`

**Midtrans Dashboard:**
1. Settings → Configuration
2. Payment Notification URL:
   ```
   https://xxxx.ngrok-free.app/api/payment/webhook
   ```
3. Save

**Option B: Skip webhook for now**
- Anda bisa simulate webhook manually (lihat E2E_TESTING_GUIDE.md)

---

## 🎯 **FRONTEND TEST (Basic)**

### **Test dengan existing frontend:**

1. **Pastikan frontend running:**
   ```bash
   cd client
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:5173
   ```

3. **Test fetch dari console:**
   ```javascript
   // Open browser console (F12)
   
   // Test get spareparts
   fetch('http://localhost:3000/api/spareparts')
     .then(r => r.json())
     .then(data => console.log(data));
   
   // Test get services
   fetch('http://localhost:3000/api/services')
     .then(r => r.json())
     .then(data => console.log(data));
   ```

**If API calls work → Frontend can access backend ✅**

---

## 📊 **CURRENT STATUS**

```
✅ Backend API: RUNNING & TESTED
✅ Frontend Utils: CREATED
   - src/config/api.js
   - src/utils/api.js
   - src/utils/payment.js
   - src/pages/Spareparts.jsx
   
⏳ Midtrans: Need YOUR credentials
⏳ Full Frontend: Need to complete pages
⏳ E2E Testing: Ready with guides
```

---

## 🚀 **NEXT IMMEDIATE ACTIONS**

### **TODAY (15 minutes):**
1. ✅ Test APIs in browser (5 URLs above)
2. ✅ Get Midtrans credentials
3. ✅ Update .env files

### **TOMORROW:**
1. Complete frontend pages
2. Test booking flow
3. Implement payment

---

**Start with browser API tests NOW!** 🧪
