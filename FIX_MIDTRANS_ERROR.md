# 💳 FIX MIDTRANS ERROR

## ❌ **ERROR:**
```
Midtrans Snap not loaded. Please check your configuration.
```

**Artinya:** Script Midtrans Snap belum dimuat karena Client Key belum disetting.

---

## ✅ **SOLUTION:**

### **1. Get Client Key**
1. Login ke [Midtrans Dashboard (Sandbox)](https://dashboard.sandbox.midtrans.com)
2. Go to **Settings** > **Access Keys**
3. Copy **Client Key** (starts with `SB-Mid-client-...`)

### **2. Update .env.local**
Buka file `client/.env.local` dan tambahkan Client Key:

```env
VITE_API_URL=http://localhost:3000
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-YOUR_KEY_HERE
```

*(Ganti `YOUR_KEY_HERE` dengan key asli Anda)*

### **3. Restart Frontend**
Karena mengubah `.env`, Anda harus restart server frontend:

```bash
# Stop server (Ctrl+C)
# Start again:
npm run dev
```

---

## 🔧 **WHAT I FIXED:**

Saya sudah update `client/src/utils/payment.js` untuk:
1. **Auto-load script:** Tidak perlu edit HTML manual.
2. **Check Env Var:** Akan memberi error jelas jika `VITE_MIDTRANS_CLIENT_KEY` belum ada.
3. **Dynamic Loading:** Script hanya diload saat tombol bayar diklik.

---

## 🚀 **TRY AGAIN:**

Setelah update `.env.local` dan restart:
1. Buka halaman Booking
2. Klik "Buat Booking & Bayar"
3. Popup Midtrans akan muncul! 🎉

---

**Segera update .env.local Anda!**
