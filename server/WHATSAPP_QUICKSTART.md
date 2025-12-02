# 📱 WhatsApp Notification - Quick Start

## ✅ Yang Sudah Dikerjakan

Sistem notifikasi WhatsApp sudah terintegrasi dengan fitur berikut:

### 1. **Notifikasi Otomatis ke Admin & Customer**
   - ✅ Saat pembayaran berhasil (Paid/DP)
   - ✅ Saat booking status berubah (confirmed, in_progress, completed, cancelled)

### 2. **File yang Ditambahkan/Diubah**
   - ✅ `utils/whatsappService.js` - Service untuk WhatsApp
   - ✅ `controllers/midtransWebHook.js` - Integrasi notifikasi saat payment
   - ✅ `controllers/bookingController.js` - Notifikasi saat status update
   - ✅ `.env.example` - Template untuk konfigurasi

---

## 🚀 Cara Setup (3 Langkah)

### 1️⃣ Daftar & Setup Fonnte
1. Buka: https://fonnte.com
2. Register/Login
3. Scan QR Code untuk hubungkan WhatsApp
4. Copy **API Token** dari dashboard

### 2️⃣ Update `.env`
Tambahkan di file `server/.env`:
```bash
FONNTE_API_TOKEN=paste_token_disini
ADMIN_WHATSAPP_NUMBER=628123456789
```

### 3️⃣ Restart Server
```bash
# Ctrl+C untuk stop server
npm run dev
```

**SELESAI!** 🎉 Notifikasi WhatsApp sudah aktif.

---

## 📋 Format Nomor WhatsApp

- ✅ **Benar**: `628123456789` (62 tanpa +, nomor tanpa 0 di depan)
- ❌ **Salah**: `+628123456789`, `08123456789`, `62 812 3456 789`

---

## 🧪 Testing

### Test Pembayaran:
1. Buat booking dari frontend
2. Bayar menggunakan Midtrans
3. Setelah payment berhasil:
   - Admin akan terima notifikasi detail booking
   - Customer akan terima konfirmasi pembayaran

### Test Update Status:
1. Login sebagai admin
2. Ubah status booking
3. Customer akan terima notifikasi update status

---

## 📱 Contoh Pesan yang Dikirim

### Pesan ke Admin:
```
🔔 BOOKING BARU - PEMBAYARAN BERHASIL

📋 Detail Booking:
• ID Booking: 674d...
• Nama Customer: John Doe
• No. HP: 08123456789
...
```

### Pesan ke Customer:
```
Halo John Doe! 👋

✅ PEMBAYARAN BERHASIL

Terima kasih sudah melakukan pembayaran...
```

---

## 🔍 Troubleshooting

Jika notifikasi tidak terkirim, cek log di terminal:

✅ **Success**: 
```
📱 Mengirim WhatsApp ke: 628123456789
✅ WhatsApp berhasil dikirim
```

❌ **Error**:
```
⚠️ FONNTE_API_TOKEN tidak diset
```
→ **Solusi**: Pastikan sudah mengisi `FONNTE_API_TOKEN` di `.env`

---

## 📚 Dokumentasi Lengkap

Lihat `WHATSAPP_SETUP.md` untuk:
- Setup detail
- Troubleshooting lengkap
- Custom message template
- FAQ

---

## 💰 Biaya

- **Free Trial**: Dapat credits gratis untuk testing
- **Paid**: Mulai dari Rp 50.000/1000 pesan
- Info: https://fonnte.com/pricing

---

**Questions?** Lihat dokumentasi lengkap atau hubungi developer.
