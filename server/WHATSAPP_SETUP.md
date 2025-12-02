# 📱 WhatsApp Notification Setup Guide

Sistem ini menggunakan **Fonnte API** untuk mengirim notifikasi WhatsApp ke admin dan customer.

## 🎯 Fitur Notifikasi

### 1. **Notifikasi ke Admin**
Dikirim saat pembayaran berhasil, berisi:
- Detail booking (ID, customer, kendaraan)
- Jadwal service
- Info pembayaran (total, status DP/Lunas)
- Tipe booking dan lokasi service

### 2. **Notifikasi ke Customer**
Dikirim dalam 2 kondisi:

#### a. Konfirmasi Pembayaran (Otomatis)
- Saat pembayaran berhasil melalui Midtrans
- Berisi detail booking dan bukti pembayaran
- Info DP atau Lunas

#### b. Update Status Booking (Otomatis)
- Saat admin mengubah status booking
- Status: `confirmed`, `in_progress`, `completed`, `cancelled`
- Memberikan informasi progress service

---

## 🚀 Cara Setup

### 1. Daftar di Fonnte

1. Kunjungi: [https://fonnte.com](https://fonnte.com)
2. Klik **Register** atau **Login** jika sudah punya akun
3. Verifikasi email Anda

### 2. Hubungkan WhatsApp

1. Login ke dashboard Fonnte
2. Klik menu **Device** atau **Perangkat**
3. Scan QR Code dengan WhatsApp yang akan digunakan (bisa WhatsApp pribadi atau bisnis)
4. Tunggu hingga status **Connected**

> ⚠️ **Penting**: Jangan logout dari WhatsApp Web/Desktop untuk menjaga koneksi tetap aktif.

### 3. Dapatkan API Token

1. Di dashboard Fonnte, klik menu **API**
2. Copy **API Token** Anda
3. Simpan token ini, akan digunakan di langkah berikutnya

### 4. Setup Environment Variables

Edit file `server/.env` dan tambahkan:

```bash
# ====================================
# WHATSAPP NOTIFICATION (FONNTE API)
# ====================================
FONNTE_API_TOKEN=paste_token_dari_fonnte_disini

# Nomor WhatsApp Admin (format: 628xxx tanpa + atau spasi)
# Contoh: 628123456789
ADMIN_WHATSAPP_NUMBER=628123456789
```

**Format Nomor WhatsApp:**
- ✅ Benar: `628123456789` (62 + nomor tanpa 0)
- ❌ Salah: `+628123456789`, `08123456789`, `62 812 3456 789`

### 5. Restart Server

```bash
npm run dev
```

---

## 🧪 Testing Notifikasi

### Test 1: Simulasi Pembayaran

1. Buat booking baru dari frontend
2. Lakukan pembayaran (bisa pakai Midtrans Sandbox)
3. Setelah pembayaran berhasil, cek:
   - WhatsApp admin harus menerima notifikasi booking baru
   - WhatsApp customer harus menerima konfirmasi pembayaran

### Test 2: Update Status Booking

1. Login sebagai admin
2. Buka halaman **Manage Bookings**
3. Ubah status booking (misal: Pending → Confirmed)
4. Customer harus menerima notifikasi update status

---

## 📊 Monitoring & Troubleshooting

### Cek Log di Terminal

Server akan menampilkan log seperti:

```
📱 Mengirim WhatsApp ke: 628123456789
✅ WhatsApp berhasil dikirim ke 628123456789
✅ Notifikasi WhatsApp ke admin berhasil dikirim
✅ Notifikasi WhatsApp ke customer berhasil dikirim
```

### Error: "API token not configured"

```
⚠️ FONNTE_API_TOKEN tidak diset, WhatsApp notification dilewati
```

**Solusi**: Pastikan `FONNTE_API_TOKEN` sudah diisi di `.env`

### Error: "Customer phone number tidak tersedia"

```
⚠️ Customer phone number tidak tersedia
```

**Solusi**: Pastikan customer mengisi nomor telepon saat booking

### WhatsApp Tidak Terkirim

Kemungkinan penyebab:
1. Koneksi WhatsApp di Fonnte terputus → Re-scan QR Code
2. API Token salah → Cek kembali token di dashboard Fonnte
3. Nomor tujuan tidak valid → Pastikan format nomor benar (628xxx)
4. Kuota Fonnte habis → Cek saldo/kuota di dashboard Fonnte

---

## 💰 Pricing Fonnte

Fonnte menggunakan sistem **credit**:
- Free trial: dapat beberapa credits gratis
- Paid plan: mulai dari Rp 50.000 untuk 1000 pesan

Cek pricing terbaru di: [https://fonnte.com/pricing](https://fonnte.com/pricing)

---

## 🔧 Custom Message Template

Jika ingin mengubah format pesan, edit file:
- `server/utils/whatsappService.js`

Fungsi yang bisa dikustomisasi:
- `sendAdminBookingNotification()` - Pesan ke admin
- `sendCustomerPaymentConfirmation()` - Konfirmasi pembayaran
- `sendCustomerBookingStatusUpdate()` - Update status

---

## 📝 Notes

1. **Rate Limiting**: Fonnte memiliki rate limit, jangan spam pesan dalam waktu singkat
2. **WhatsApp Business**: Lebih baik gunakan WhatsApp Business untuk admin
3. **Backup Connection**: Simpan HP yang terkoneksi dalam kondisi online
4. **Production**: Untuk production, gunakan WhatsApp Business API (lebih stable tapi lebih mahal)

---

## ❓ FAQ

**Q: Apakah bisa pakai nomor pribadi untuk admin?**  
A: Bisa, tapi disarankan pakai WhatsApp Business untuk lebih profesional.

**Q: Berapa lama pesan sampai ke WhatsApp?**  
A: Biasanya instan (1-3 detik), tergantung koneksi internet.

**Q: Apakah customer perlu install aplikasi khusus?**  
A: Tidak, notifikasi dikirim ke WhatsApp biasa mereka.

**Q: Bisa kirim gambar atau file?**  
A: Bisa! Fonnte API support kirim gambar, file, dan media lainnya. Lihat dokumentasi Fonnte untuk detailnya.

---

## 🔗 Resources

- Fonnte Dashboard: [https://fonnte.com](https://fonnte.com)
- Fonnte API Docs: [https://fonnte.com/api](https://fonnte.com/api)
- Support: Hubungi support Fonnte jika ada kendala teknis

---

**Catatan**: Dokumentasi ini dibuat untuk sistem Workshop Booking. Jika ada pertanyaan, hubungi developer.
