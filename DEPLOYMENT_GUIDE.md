# Panduan Deployment ke Vercel (MERN Stack)

Panduan ini akan membantu Anda men-deploy aplikasi MERN (MongoDB, Express, React, Node) ke Vercel. Vercel sangat bagus untuk frontend (React/Vite) dan juga mendukung backend (Express) menggunakan Serverless Functions.

## 1. Konfigurasi Proyek

### A. Buat file `vercel.json`
Buat file baru bernama `vercel.json` di root folder proyek (sejajar dengan folder `client` dan `server`). File ini memberi tahu Vercel cara membuild frontend dan backend.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/client/index.html"
    }
  ]
}
```

### B. Buat Entry Point untuk Serverless
Vercel membutuhkan entry point khusus untuk menjalankan Express sebagai serverless function.
Buat folder `server/api` dan buat file `index.js` di dalamnya (`server/api/index.js`).

```javascript
// server/api/index.js
import app from '../server.js';

export default app;
```

### C. Modifikasi `server/server.js`
Anda perlu mengekspor `app` agar bisa digunakan oleh Vercel. Selain itu, `app.listen` sebaiknya hanya dijalankan saat development lokal, bukan saat di-deploy di Vercel (karena Vercel yang akan menangani listening port).

Ubah bagian paling bawah `server/server.js` Anda menjadi seperti ini:

```javascript
// =====================================================
// 🚀 Start Server
// =====================================================
const PORT = process.env.PORT || 3000;

// Hanya jalankan app.listen jika TIDAK dalam mode production (Vercel)
// Atau jika dijalankan langsung dengan node server.js
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server is listening on http://localhost:${PORT}`);
  });
}

// Penting: Export app untuk Vercel
export default app;
```

## 2. Environment Variables (Variabel Lingkungan)

Saat men-deploy di Vercel, Anda harus memasukkan semua variabel `.env` Anda di menu **Settings > Environment Variables** di dashboard proyek Vercel.

Berikut adalah daftar variabel yang perlu Anda masukkan:

### Backend (Server)
| Nama Variabel | Deskripsi |
|---------------|-----------|
| `MONGODB_URI` | Connection string MongoDB Atlas Anda. |
| `CLERK_SECRET_KEY` | Secret Key dari Clerk Dashboard. |
| `CLERK_PUBLISHABLE_KEY` | Publishable Key dari Clerk Dashboard. |
| `SIGNING_SECRET` | Signing Secret untuk Webhook Clerk. |
| `IMAGEKIT_PUBLIC_KEY` | Public Key ImageKit. |
| `IMAGEKIT_PRIVATE_KEY` | Private Key ImageKit. |
| `IMAGEKIT_URL_ENDPOINT` | URL Endpoint ImageKit. |
| `MIDTRANS_SERVER_KEY` | Server Key Midtrans. |
| `MIDTRANS_CLIENT_KEY` | Client Key Midtrans. |
| `MIDTRANS_IS_PRODUCTION` | `true` atau `false`. |
| `EMAIL_USER` | Email Gmail untuk pengirim notifikasi. |
| `EMAIL_APP_PASSWORD` | App Password Gmail (bukan password login biasa). |
| `TELEGRAM_BOT_TOKEN` | Token Bot Telegram. |
| `TELEGRAM_ADMIN_CHAT_ID` | ID Chat Admin Telegram. |
| `ADMIN_EMAILS` | Daftar email admin (dipisahkan koma). |

### Frontend (Client)
| Nama Variabel | Deskripsi |
|---------------|-----------|
| `VITE_API_URL` | URL backend Anda setelah deploy. Isi dengan domain Vercel Anda (misal: `https://nama-proyek.vercel.app`). **JANGAN** tambahkan `/api` di belakangnya, kode frontend sudah menanganinya. |

## 3. Langkah Deployment

1.  **Push ke GitHub**: Pastikan semua perubahan kode (termasuk file baru tadi) sudah di-commit dan di-push ke repository GitHub Anda.
2.  **Buka Vercel**: Login ke [vercel.com](https://vercel.com).
3.  **Add New Project**: Klik tombol "Add New..." -> "Project".
4.  **Import Git Repository**: Pilih repository proyek Anda.
5.  **Konfigurasi**:
    *   **Framework Preset**: Vercel biasanya otomatis mendeteksi "Vite". Jika tidak, pilih "Vite".
    *   **Root Directory**: Biarkan default (`./`).
    *   **Environment Variables**: Masukkan semua variabel dari tabel di atas.
6.  **Deploy**: Klik tombol "Deploy".

## Troubleshooting Umum

*   **MongoDB Error**: Jika server tidak bisa connect ke database, pastikan di MongoDB Atlas > Network Access, Anda sudah mengizinkan IP `0.0.0.0/0` (Allow Access from Anywhere). IP Vercel berubah-ubah, jadi whitelist IP spesifik tidak akan bekerja.
*   **Cold Start**: Request pertama ke API mungkin agak lambat (beberapa detik) karena serverless function sedang "bangun". Ini normal.
