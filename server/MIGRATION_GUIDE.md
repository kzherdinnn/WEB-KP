# 🔄 MIGRATION GUIDE: Hotel → Workshop

Panduan lengkap untuk migrasi dari sistem booking hotel ke sistem booking bengkel.

---

## 📝 RINGKASAN PERUBAHAN

### **Models yang Dihapus:**
- ❌ `hotel.models.js`
- ❌ `room.models.js`

### **Models yang Baru:**
- ✅ `sparepart.models.js` - Untuk sparepart audio mobil
- ✅ `service.models.js` - Untuk layanan bengkel
- ✅ `technician.models.js` - Untuk data teknisi
- ✅ `workshop.models.js` - Menggantikan hotel.models.js
- ✅ `booking.models.js` - **DIUPDATE** untuk workshop booking

### **Controllers yang Dihapus:**
- ❌ `hotelController.js`
- ❌ `roomController.js`

### **Controllers yang Baru:**
- ✅ `sparepartController.js`
- ✅ `serviceController.js`
- ✅ `technicianController.js`
- ✅ `workshopController.js`
- ✅ `bookingController.js` - **DIUPDATE** sepenuhnya
- ✅ `midtransWebHook.js` - **DIUPDATE** untuk workshop

### **Routes yang Dihapus:**
- ❌ `/api/hotel`
- ❌ `/api/room`

### **Routes yang Baru:**
- ✅ `/api/spareparts`
- ✅ `/api/services`
- ✅ `/api/technicians`
- ✅ `/api/workshop`
- ✅ `/api/bookings` - **DIUPDATE**

---

## 🚀 LANGKAH-LANGKAH MIGRASI

### **1. Update Dependencies**
Semua dependencies sudah ada, tidak perlu install tambahan.

```bash
npm install
```

### **2. Update Environment Variables**
Pastikan `.env` sudah lengkap:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Clerk
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SECRET=...

# Midtrans
MIDTRANS_CLIENT_KEY=...
MIDTRANS_SERVER_KEY=...
MIDTRANS_IS_PRODUCTION=false

# ImageKit
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...

PORT=3000
```

### **3. Seed Database**
Isi database dengan data sample untuk testing:

```bash
npm run seed
```

Ini akan membuat:
- ✅ 5 Spareparts
- ✅ 6 Services
- ✅ 3 Technicians
- ✅ 1 Workshop Info

### **4. Jalankan Server**
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### **5. Test API Endpoints**
Gunakan Postman/Thunder Client untuk test:

#### Test 1: Get Spareparts
```
GET http://localhost:3000/api/spareparts
```

#### Test 2: Get Services
```
GET http://localhost:3000/api/services
```

#### Test 3: Get Available Time Slots
```
GET http://localhost:3000/api/workshop/timeslots?date=2025-12-15
```

#### Test 4: Create Booking
```
POST http://localhost:3000/api/bookings
Content-Type: application/json
Authorization: Bearer {clerk_token}

{
  "customerName": "Test User",
  "customerPhone": "08123456789",
  "customerEmail": "test@example.com",
  "vehicleInfo": {
    "brand": "Toyota",
    "model": "Avanza",
    "year": "2020"
  },
  "bookingType": "sparepart_and_service",
  "spareparts": [
    {
      "sparepartId": "{sparepart_id}",
      "quantity": 1
    }
  ],
  "services": [
    {
      "serviceId": "{service_id}"
    }
  ],
  "scheduledDate": "2025-12-15",
  "scheduledTime": "09:00",
  "serviceLocation": "workshop",
  "paymentMethod": "ewallet"
}
```

---

## 🔍 PERBEDAAN UTAMA

### **Booking System**

#### **LAMA (Hotel):**
```javascript
{
  user: String,
  room: ObjectId,
  hotel: ObjectId,
  checkInDate: Date,
  checkOutDate: Date,
  guests: Number,
  numberOfRooms: Number,
  paymentStatus: "pending" | "paid" | "cancelled"
}
```

#### **BARU (Workshop):**
```javascript
{
  user: String,
  customerName: String,
  customerPhone: String,
  vehicleInfo: {
    brand: String,
    model: String,
    year: String
  },
  bookingType: "sparepart_only" | "service_only" | "sparepart_and_service",
  spareparts: [{ sparepart: ObjectId, quantity: Number, price: Number }],
  services: [{ service: ObjectId, price: Number }],
  scheduledDate: Date,
  scheduledTime: String,
  technician: ObjectId,
  paymentStatus: "pending" | "dp_paid" | "paid" | "failed" | "refunded",
  bookingStatus: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled",
  workNotes: [...],
  additionalCosts: [...]
}
```

### **Payment Flow**

#### **LAMA:**
- Hanya full payment
- Status: `pending` → `paid` / `cancelled`

#### **BARU:**
- Support **DP (50%)** dan **full payment**
- Status lebih detail:
  - `pending` - Belum bayar
  - `dp_paid` - DP sudah dibayar
  - `paid` - Lunas
  - `failed` - Gagal
  - `refunded` - Dikembalikan

### **Webhook Updates**

#### **LAMA:**
```javascript
// Mengembalikan availableRooms
if (newPaymentStatus === "cancelled") {
  roomData.availableRooms += booking.numberOfRooms;
}
```

#### **BARU:**
```javascript
// Support DP payment
if (booking.dpAmount > 0 && booking.remainingPayment > 0) {
  newPaymentStatus = "dp_paid";
} else {
  newPaymentStatus = "paid";
}

// Auto-confirm when paid
updateData.bookingStatus = "confirmed";
```

---

## ⚠️ CATATAN PENTING

### **Data Lama**
Jika Anda memiliki data booking hotel yang lama di database:

1. **Backup database** terlebih dahulu
2. Data lama **TIDAK AKAN KOMPATIBEL** dengan model baru
3. Anda bisa:
   - Drop database dan mulai fresh ✅ (Recommended)
   - Atau buat collection baru untuk workshop
   - Atau migrate data manual

### **Frontend Updates**
Frontend Anda perlu diupdate untuk:

1. **Endpoints baru:**
   - `/api/hotel` → `/api/workshop`
   - `/api/room` → `/api/spareparts` & `/api/services`

2. **Request body baru** untuk booking
3. **Payment flow** yang support DP
4. **Status tracking** yang lebih detail

---

## 📚 RESOURCES

- **API Documentation**: `API_DOCUMENTATION.md`
- **Seed Data**: Run `npm run seed`
- **Models**: Check `models/` directory
- **Controllers**: Check `controllers/` directory

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot find module hotel.models.js"
✅ **Fix**: File sudah dihapus, pastikan tidak ada import lama di code Anda.

### Error: "Booking validation failed"
✅ **Fix**: Periksa request body sesuai dengan format baru di dokumentasi.

### Error: "Midtrans webhook failed"
✅ **Fix**: Pastikan `MIDTRANS_SERVER_KEY` sudah benar di `.env`

### Sparepart stock tidak berkurang
✅ **Fix**: Stock berkurang **otomatis** saat booking status berubah ke `completed`

---

## ✅ CHECKLIST MIGRASI

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured
- [ ] Database seeded (`npm run seed`)
- [ ] Server running (`npm run dev`)
- [ ] Test endpoints dengan Postman
- [ ] Webhook Midtrans configured
- [ ] Frontend updated untuk endpoints baru
- [ ] Payment flow tested

---

## 🎉 SELAMAT!

Sistem booking workshop Anda sudah siap digunakan!

Untuk pertanyaan lebih lanjut, lihat `API_DOCUMENTATION.md` atau hubungi tim development.

**Happy Coding! 🚀**
