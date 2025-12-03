# 🔧 WORKSHOP BOOKING SYSTEM

Sistem booking bengkel audio mobil modern dengan integrasi pembayaran Midtrans, notifikasi otomatis, dan manajemen stok real-time.

---

## 🆕 LATEST UPDATES (December 3, 2024)

### **Major: Notification System Migration**

System notifikasi telah dimigrasikan dari WhatsApp (unofficial API) ke sistem yang lebih reliable:

- **📧 Email Notifications (Customer)** - Gmail SMTP untuk konfirmasi booking, payment, status updates
- **🤖 Telegram Bot (Admin)** - Instant notifications untuk admin tentang bookings baru, payments, updates

**Benefits:**
- ✅ No risk of account bans (100% official APIs)
- ✅ Free forever
- ✅ More professional for customers
- ✅ Instant admin alerts via Telegram
- ✅ Email provides permanent record for customers

---

## 🎯 OVERVIEW

Sistem ini memungkinkan user untuk:
- ✅ Browse sparepart & layanan bengkel
- ✅ Cek stok real-time & kompatibilitas kendaraan
- ✅ Booking jadwal pemasangan dengan teknisi
- ✅ Pembayaran via Midtrans (Full / DP 50%)
- ✅ Track progress pekerjaan
- ✅ Lihat riwayat servis & garansi
- ✅ Notifikasi email otomatis
- ✅ Notifikasi admin via Telegram

---

## 🚀 QUICK START

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd WEB-KP
```

### 2. **Setup Server**
```bash
cd server
npm install
cp .env.example .env
# Edit .env dengan credentials Anda (Lihat panduan di bawah)
npm run dev
```

### 3. **Setup Client**
```bash
cd client
npm install
cp .env.example .env
# Edit .env dengan credentials Anda
npm run dev
```

Aplikasi akan berjalan di:
- Frontend: **http://localhost:5173**
- Backend: **http://localhost:3000**

---

## ⚙️ ENVIRONMENT SETUP GUIDE

File `.env` diperlukan di folder `server/` dan `client/`. Gunakan `.env.example` sebagai template.

### **1. SERVER (.env)**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `CLERK_PUBLISHABLE_KEY` | Clerk Auth Public Key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Auth Secret Key | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk Webhook Secret | `whsec_...` |
| `MIDTRANS_CLIENT_KEY` | Midtrans Client Key | `SB-Mid-client-...` |
| `MIDTRANS_SERVER_KEY` | Midtrans Server Key | `SB-Mid-server-...` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key | `public_...` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit Private Key | `private_...` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL | `https://ik.imagekit.io/...` |
| `EMAIL_USER` | Gmail Address | `workshop@gmail.com` |
| `EMAIL_APP_PASSWORD` | Google App Password | `abcdefghijklmnop` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | `123:ABC...` |
| `TELEGRAM_ADMIN_CHAT_ID` | Admin Chat ID | `123456789` |

### **2. CLIENT (.env)**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk Public Key | `pk_test_...` |
| `VITE_API_URL` | Backend URL | `http://localhost:3000` |
| `VITE_MIDTRANS_CLIENT_KEY` | Midtrans Client Key | `SB-Mid-client-...` |
| `VITE_IMAGEKIT_URL_ENDPOINT` | ImageKit URL | `https://ik.imagekit.io/...` |
| `VITE_IMAGEKIT_PUBLIC_KEY` | ImageKit Public Key | `public_...` |

---

## 📚 DOCUMENTATION

Detail lengkap tersedia di file dokumentasi berikut:

- 📖 **[API Documentation](./API_DOCUMENTATION.md)** - Daftar lengkap endpoint API
- 📊 **[System Flow](./SYSTEM_FLOW.md)** - Diagram alur sistem dan database schema
- 📧 **[Email Setup Guide](./EMAIL_SETUP.md)** - Panduan konfigurasi Gmail SMTP
- 🤖 **[Telegram Setup Guide](./TELEGRAM_SETUP.md)** - Panduan membuat Telegram Bot

---

## 🛠️ TECH STACK

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Framer Motion
- Clerk Auth (Client)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Midtrans Payment Gateway
- ImageKit Storage
- Nodemailer (Email)
- Telegram Bot API

---

## 📁 PROJECT STRUCTURE

```
WEB-KP/
├── client/                 # Frontend React App
│   ├── src/
│   ├── .env.example
│   └── ...
├── server/                 # Backend Express App
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/              # Email & Telegram services here
│   ├── .env.example
│   └── ...
├── API_DOCUMENTATION.md    # API Docs
├── SYSTEM_FLOW.md          # System Diagrams
├── EMAIL_SETUP.md          # Email Guide
├── TELEGRAM_SETUP.md       # Telegram Guide
└── Readme.md               # This file
```

---

## 🤝 CONTRIBUTING

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

## 📄 LICENSE

This project is licensed under the ISC License.
