# 🔔 MIDTRANS WEBHOOK SETUP GUIDE

## 📋 **Setup Midtrans Payment Gateway & Webhook**

---

## **STEP 1: Daftar/Login ke Midtrans**

### **A. Buat Akun Midtrans (jika belum punya)**

1. **Kunjungi**: https://dashboard.midtrans.com/register
2. **Isi form registrasi**:
   - Business name: "AutoSound Workshop"
   - Email
   - Password
   - Phone number
3. **Verify email** yang dikirim Midtrans
4. **Complete profile** di dashboard

---

### **B. Login ke Dashboard**

1. **Kunjungi**: https://dashboard.sandbox.midtrans.com
2. **Login** dengan credentials Anda
3. Pastikan Anda di **SANDBOX mode** (untuk testing)

---

## **STEP 2: Get API Keys**

### **A. Client Key & Server Key**

1. Di dashboard, buka **Settings** → **Access Keys**
2. Copy credentials berikut:

```
Client Key: SB-Mid-client-xxxxxxxxx
Server Key: SB-Mid-server-xxxxxxxxx
```

3. **Simpan di `.env` file** (server):

```env
# Midtrans Payment Gateway
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

4. **Simpan di `.env.local` file** (client/frontend):

```env
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxx
```

---

## **STEP 3: Setup Webhook URL**

### **⚠️ IMPORTANT: Webhook HARUS bisa diakses dari internet**

Midtrans perlu **public URL** untuk kirim webhook notification.

---

### **OPTION A: Development (Local Testing)**

Untuk development local, gunakan **ngrok** atau **localtunnel**:

#### **Menggunakan ngrok:**

1. **Download ngrok**: https://ngrok.com/download
2. **Install** dan jalankan:

```bash
# Di terminal baru (biarkan running)
ngrok http 3000
```

3. Anda akan dapat URL seperti:
```
https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

4. **Webhook URL** yang digunakan:
```
https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payment/webhook
```

⚠️ **PENTING**: Setiap kali restart ngrok, URL berubah dan harus update di Midtrans dashboard!

---

#### **Menggunakan localtunnel (Alternative):**

```bash
# Install
npm install -g localtunnel

# Run
lt --port 3000 --subdomain autosound-workshop
```

URL: `https://autosound-workshop.loca.lt/api/payment/webhook`

---

### **OPTION B: Production (Deploy)**

Jika sudah deploy (Vercel/Railway/Render), gunakan production URL:

```
https://your-domain.vercel.app/api/payment/webhook
```

---

## **STEP 4: Configure Webhook di Midtrans Dashboard**

### **A. Set Notification URL**

1. **Login** ke Midtrans Dashboard
2. Buka **Settings** → **Configuration**
3. Scroll ke **Payment Notification URL**
4. Masukkan webhook URL Anda:

```
https://your-url.ngrok-free.app/api/payment/webhook
```

atau

```
https://your-domain.vercel.app/api/payment/webhook
```

5. **Save** settings

---

### **B. Enable Payment Methods**

Di **Settings** → **Payment Configuration**, aktifkan:

- ✅ **Credit Card** (if needed)
- ✅ **GoPay** (E-Wallet)
- ✅ **ShopeePay** (E-Wallet)
- ✅ **QRIS**
- ✅ **Bank Transfer** (Mandiri, BCA, BNI, BRI, Permata)
- ✅ **Virtual Account**

**Save** configuration.

---

## **STEP 5: Test Webhook**

### **A. Buat Test Transaction**

1. Dari frontend, buat booking
2. Inisiasi payment
3. Anda akan mendapat **Snap Token**
4. Redirect ke Midtrans payment page

---

### **B. Simulasi Payment (Sandbox)**

Di halaman pembayaran Midtrans Sandbox, gunakan test credentials:

#### **Test Credit Card:**
```
Card Number: 4811 1111 1111 1114
CVV: 123
Exp Date: 01/25
OTP/3DS: 112233
```

#### **Test Gopay:**
- Pilih Gopay
- Akan muncul simulasi
- Klik "Success"

#### **Test Bank Transfer:**
- Pilih bank (misal: BCA)
- Note nomor VA
- Klik "Bayar" (auto success di sandbox)

---

### **C. Cek Webhook di Server Log**

Setelah payment success/failed, cek log di server:

```bash
# Di terminal server Anda akan lihat:
=============================================================
🔔 WEBHOOK MIDTRANS DITERIMA (WORKSHOP BOOKING)
=============================================================
📥 Raw notification: {...}
📬 Webhook Details:
   - Order ID: BOOKING-xxx-xxx
   - Transaction ID: xxx
   - Transaction Status: settlement
   - Fraud Status: accept
🔍 Extracted Booking ID: xxx
📦 Booking ditemukan:
   - Booking ID: xxx
   - Customer: John Doe
   - Payment Status: pending
   - Total Price: Rp1,200,000
✅ Status akan diupdate menjadi: PAID
=============================================================
✅ WEBHOOK BERHASIL DIPROSES
=============================================================
```

---

## **STEP 6: Verify Webhook Works**

### **Checklist Verification:**

- [ ] Server running di `http://localhost:3000`
- [ ] Ngrok/localtunnel running dan dapat public URL
- [ ] Webhook URL configured di Midtrans dashboard
- [ ] Backend dapat receive webhook (cek log)
- [ ] Booking status auto-update setelah payment
- [ ] Database updated correctly

---

## **STEP 7: Webhook Flow Testing**

### **Complete Flow:**

```
1. User create booking
   → Backend: status = pending/pending

2. User click "Bayar"
   → Backend: POST /api/bookings/:id/payment
   → Response: snapToken

3. Frontend redirect to Midtrans
   → window.snap.pay(snapToken)

4. User select payment method
   → Fill payment info (or use test credentials)

5. User complete payment
   → Midtrans process payment

6. Midtrans send webhook
   → POST https://your-url/api/payment/webhook
   → Backend receive notification
   → Backend verify transaction
   → Backend update booking status

7. Payment status updated
   - If success: paid/confirmed
   - If DP: dp_paid/confirmed
   - If failed: failed/pending

8. User redirected back to app
   → Frontend check booking status
   → Show success/failure message
```

---

## **🔍 DEBUGGING WEBHOOK**

### **1. Webhook tidak terkirim:**

**Check:**
- ✅ Notification URL sudah benar di dashboard?
- ✅ Server running dan accessible dari internet?
- ✅ Ngrok/tunnel masih running?
- ✅ Firewall tidak block incoming requests?

**Test manually:**
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test","transaction_status":"settlement","fraud_status":"accept"}'
```

---

### **2. Webhook diterima tapi error:**

**Check server logs:**
```bash
# Look for errors in:
[nodemon] app crashed
Error [ERR_MODULE_NOT_FOUND]
```

**Common issues:**
- Order ID format tidak match
- Booking tidak ditemukan
- Database connection error

---

### **3. Status tidak update:**

**Check:**
- ✅ Webhook handler (`midtransWebHook.js`) sudah benar?
- ✅ Transaction status dari Midtrans?
- ✅ Database connection?

**Manual check booking:**
```bash
# MongoDB
db.bookings.findOne({_id: ObjectId("xxx")})
```

---

## **📊 Midtrans Sandbox Test Cards**

### **Success Payment:**
```
Card: 4811 1111 1111 1114
CVV: 123
Exp: 01/25
3DS: 112233
```

### **Failed Payment:**
```
Card: 4911 1111 1111 1113
```

### **Challenge by FDS:**
```
Card: 4411 1111 1111 1118
```

---

## **🚀 Production Checklist**

Sebelum go live ke production:

- [ ] Ganti ke **Production** dashboard
- [ ] Get **Production** API keys
- [ ] Update `.env`: `MIDTRANS_IS_PRODUCTION=true`
- [ ] Update `MIDTRANS_SERVER_KEY` & `CLIENT_KEY`
- [ ] Deploy backend ke production server
- [ ] Update webhook URL dengan production URL
- [ ] Test dengan real payment (small amount)
- [ ] Verify webhook works in production
- [ ] Setup monitoring/logging

---

## **📞 Support**

Jika ada masalah:

1. **Midtrans Documentation**: https://docs.midtrans.com
2. **Midtrans Support**: support@midtrans.com
3. **Check server logs** untuk error details
4. **Test dengan Midtrans simulator** di dashboard

---

**Setup webhook Anda sekarang dan test payment flow!** 💳🚀
