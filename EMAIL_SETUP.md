# 📧 Email Notification Setup Guide (Gmail SMTP)

Panduan setup notifikasi email menggunakan Gmail SMTP untuk mengirim email ke customer.

---

## 🎯 Mengapa Email?

✅ **Reliable** - Tidak akan kena ban seperti WhatsApp unofficial  
✅ **Gratis** - Gmail menyediakan SMTP gratis  
✅ **Professional** - Email lebih profesional untuk bukti transaksi  
✅ **Persistent** - Customer bisa simpan email sebagai bukti  

---

## 📋 Prerequisites

- Akun Gmail yang aktif
- Akses ke Google Account Settings

---

## 🔧 Setup Steps

### 1. Create App Password di Gmail

Gmail tidak mengizinkan login langsung dengan password biasa untuk aplikasi. Anda harus membuat **App Password**.

#### Langkah-langkah:

1. **Buka Google Account:**
   - Go to: https://myaccount.google.com/
   - Login dengan akun Gmail Anda

2. **Enable 2-Step Verification** (jika belum):
   - Go to: **Security** → **2-Step Verification**
   - Klik **Get Started** dan ikuti instruksi
   - **PENTING:** App Password hanya bisa dibuat setelah 2FA aktif

3. **Generate App Password:**
   - Go to: **Security** → **2-Step Verification** → scroll down
   - Klik **App passwords** (di bagian bawah)
   - Atau langsung: https://myaccount.google.com/apppasswords
   
4. **Create New App Password:**
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Nama: `Workshop Booking System`
   - Klik **Generate**

5. **Copy Password:**
   - Google akan menampilkan 16-character password
   - **SALIN PASSWORD INI** (contoh: `abcd efgh ijkl mnop`)
   - Anda hanya bisa lihat password ini **SEKALI**
   - Simpan di tempat aman

---

### 2. Configure Environment Variables

Buka file `server/.env` dan tambahkan konfigurasi email:

```env
# ===== EMAIL NOTIFICATION (GMAIL SMTP) =====
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
EMAIL_FROM_NAME=Workshop Booking System
```

**Penjelasan:**
- `EMAIL_USER`: Email Gmail Anda (contoh: `bengkelkp@gmail.com`)
- `EMAIL_APP_PASSWORD`: App Password yang sudah di-generate (16 karakter, **tanpa spasi**)
- `EMAIL_FROM_NAME`: Nama pengirim yang akan muncul di email customer

**Contoh `.env` yang benar:**
```env
EMAIL_USER=bengkelkp@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
EMAIL_FROM_NAME=Bengkel KP Workshop
```

---

### 3. Restart Server

Setelah update `.env`, restart backend server:

```bash
# Stop server (Ctrl+C di terminal)
# Start ulang
npm run dev
```

---

## ✅ Testing

### Test dengan Script Test

Buat file test untuk memastikan email berfungsi:

```bash
node server/utils/testEmail.js
```

Atau buat file `server/utils/testEmail.js`:

```javascript
import { sendEmail } from "./emailService.js";
import dotenv from "dotenv";

dotenv.config();

const testEmail = async () => {
  console.log("Testing email service...");
  
  const result = await sendEmail(
    "youremail@example.com", // Ganti dengan email Anda
    "Test Email from Workshop System",
    "<h1>Hello!</h1><p>This is a test email.</p>"
  );
  
  console.log("Result:", result);
};

testEmail();
```

### Test End-to-End Flow

1. **Create a booking** di aplikasi
2. **Complete payment** via Midtrans
3. **Check customer email** - harus menerima email konfirmasi pembayaran
4. **Update booking status** di admin dashboard
5. **Check customer email** - harus menerima email update status

---

## 📫 Email Templates

Sistem akan mengirim 2 jenis email:

### 1. **Booking Confirmation Email**
Dikirim saat pembayaran berhasil:
- ✅ Detail booking
- ✅ Informasi kendaraan
- ✅ Jadwal service
- ✅ Status pembayaran
- ✅ Professional HTML design

### 2. **Status Update Email**
Dikirim saat status booking berubah:
- ✅ Status baru (Confirmed, In Progress, Completed, Cancelled)
- ✅ Informasi teknisi (jika sudah ditugaskan)
- ✅ Detail jadwal service
- ✅ Color-coded status badges

---

## 🔍 Troubleshooting

### Email tidak terkirim

**Problem:** Console menunjukkan error "Invalid login"

**Solution:**
1. Pastikan 2-Step Verification sudah aktif
2. Generate ulang App Password
3. Copy password tanpa spasi: `abcdefghijklmnop` (bukan `abcd efgh ijkl mnop`)
4. Pastikan `EMAIL_USER` dan `EMAIL_APP_PASSWORD` sudah benar di `.env`

---

### Email masuk ke Spam

**Problem:** Customer komplain email masuk spam folder

**Solution:**
1. Minta customer tandai email sebagai "Not Spam"
2. Untuk production, pertimbangkan:
   - Verifikasi domain (SPF, DKIM records)
   - Pakai dedicated email service (SendGrid, Mailgun)
   - Jangan gunakan Gmail untuk volume besar (>100 email/day)

---

### App Password option tidak muncul

**Problem:** Tidak ada menu "App passwords" di Google Account

**Solution:**
1. Pastikan **2-Step Verification** sudah aktif
2. Tunggu 24 jam setelah enable 2FA
3. Gunakan browser bukan mobile app
4. Logout dan login ulang ke Google Account

---

## 📊 Email Sending Limits

### Gmail SMTP Limits:
- **500 emails per day** (gratis)
- **100 recipients per email**
- Jika melebihi, akun akan suspended 24 jam

### Untuk Production (volume tinggi):
Gunakan professional email service:
- **SendGrid** - 100 emails/day gratis, $15/month untuk 50K emails
- **Mailgun** - 5,000 emails/month gratis
- **AWS SES** - $0.10 per 1,000 emails

---

## 🎨 Customization

### Edit Email Templates

Template ada di: `server/utils/emailService.js`

Anda bisa customize:
- **HTML styling** - Ubah warna, font, layout
- **Content** - Tambah/kurangi informasi
- **Logo** - Tambah logo company (embed base64 image)
- **Footer** - Tambah link social media, contact info

---

## 📝 Best Practices

1. ✅ **Jangan hardcode password** - Selalu pakai `.env`
2. ✅ **Jangan commit `.env`** - Add ke `.gitignore`
3. ✅ **Test di development** sebelum production
4. ✅ **Monitor email delivery** - Check logs
5. ✅ **Backup App Password** - Simpan di password manager

---

## 🔒 Security Notes

- ❌ **JANGAN share App Password**
- ❌ **JANGAN commit ke Git**
- ✅ **Rotate password** jika tercurigai leak
- ✅ **Gunakan dedicated Gmail** untuk aplikasi (bukan personal)
- ✅ **Enable monitoring** di Google Account security

---

## 📞 Support

### Gmail Help:
- https://support.google.com/accounts/answer/185833
- https://support.google.com/mail/answer/7126229

### Issues?
Check console logs untuk error details:
```bash
npm run dev
# Lihat log saat email dikirim
```

---

## ✨ Production Upgrade

Untuk production, pertimbangkan upgrade ke:

### **SendGrid** (Recommended)
- 100 emails/day gratis
- $15/month untuk 50K emails
- Better deliverability
- Analytics & tracking
- API docs: https://docs.sendgrid.com/

**Migration:** Tinggal ganti transporter di `emailService.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

---

**🎉 Setup Complete!** Email notifications sudah siap digunakan.
