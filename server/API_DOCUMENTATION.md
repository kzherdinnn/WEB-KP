# 🔧 WORKSHOP BOOKING API - DOCUMENTATION

Backend API untuk sistem booking bengkel audio mobil dengan integrasi pembayaran Midtrans.

---

## 📋 FITUR UTAMA

### 1️⃣ **Manajemen Sparepart**
- ✅ CRUD sparepart (speaker, amplifier, subwoofer, dll)
- ✅ Cek stok real-time
- ✅ Warning stok rendah
- ✅ Kompatibilitas kendaraan
- ✅ Pre-order untuk stok habis

### 2️⃣ **Manajemen Layanan**
- ✅ CRUD layanan (pasang, repair, upgrade, paket)
- ✅ Estimasi durasi pengerjaan
- ✅ Harga jasa

### 3️⃣ **Sistem Booking**
- ✅ Booking sparepart + layanan
- ✅ Pilih jadwal & teknisi
- ✅ Info kendaraan customer
- ✅ Lokasi servis (bengkel / on-site)

### 4️⃣ **Pembayaran (Midtrans)**
- ✅ Pembayaran penuh
- ✅ Sistem DP (50%)
- ✅ Multiple metode (VA, E-Wallet, Transfer)
- ✅ Webhook otomatis
- ✅ Status tracking

### 5️⃣ **Manajemen Teknisi**
- ✅ CRUD teknisi
- ✅ Spesialisasi
- ✅ Rating & total jobs
- ✅ Cek ketersediaan berdasarkan jadwal

### 6️⃣ **Work Progress**
- ✅ Catatan pekerjaan
- ✅ Foto progress
- ✅ Biaya tambahan
- ✅ Status tracking (pending → confirmed → in_progress → completed)

---

## 🚀 ENDPOINTS API

### **🔩 SPAREPARTS** (`/api/spareparts`)

#### **GET** `/api/spareparts`
Dapatkan semua sparepart dengan filter.

**Query Parameters:**
- `category` - Filter by kategori (speaker, amplifier, subwoofer, dll)
- `brand` - Filter by merek
- `search` - Search by nama/deskripsi
- `inStock` - Filter hanya yang ada stok (`true`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Speaker Pioneer TS-G1620F",
      "category": "speaker",
      "brand": "Pioneer",
      "price": 500000,
      "stock": 10,
      "lowStockThreshold": 5,
      "isAvailable": true,
      "warranty": 12
    }
  ],
  "total": 1
}
```

#### **GET** `/api/spareparts/:id`
Dapatkan detail sparepart.

#### **GET** `/api/spareparts/:id/stock`
Cek status stok sparepart.

**Response:**
```json
{
  "success": true,
  "data": {
    "sparepartId": "...",
    "name": "Speaker Pioneer TS-G1620F",
    "stock": 3,
    "status": "low_stock",
    "message": "Only 3 items left",
    "isPreOrderOnly": false
  }
}
```

#### **GET** `/api/spareparts/:id/compatibility`
Cek kompatibilitas dengan kendaraan.

**Query Parameters:**
- `brand` - Merek mobil (e.g., "Toyota")
- `model` - Model mobil (e.g., "Avanza")
- `year` - Tahun mobil (e.g., "2020")

**Response:**
```json
{
  "success": true,
  "data": {
    "isCompatible": true,
    "message": "This sparepart is compatible with your vehicle"
  }
}
```

#### **POST** `/api/spareparts` (ADMIN)
Buat sparepart baru.

**Body:**
```json
{
  "name": "Speaker Pioneer TS-G1620F",
  "category": "speaker",
  "brand": "Pioneer",
  "price": 500000,
  "stock": 10,
  "lowStockThreshold": 5,
  "description": "6.5\" 2-Way Coaxial Speaker",
  "specifications": {
    "power": "300W",
    "impedance": "4 ohm"
  },
  "compatibleVehicles": [
    {
      "brand": "Toyota",
      "model": "Avanza",
      "year": "2015-2023"
    }
  ],
  "warranty": 12
}
```

---

### **🛠️ SERVICES** (`/api/services`)

#### **GET** `/api/services`
Dapatkan semua layanan.

**Query Parameters:**
- `category` - Filter by kategori (installation, repair, upgrade, package)
- `search` - Search by nama/deskripsi
- `available` - Filter hanya yang tersedia (`true`)

#### **POST** `/api/services` (ADMIN)
Buat layanan baru.

**Body:**
```json
{
  "name": "Pasang Head Unit + Speaker",
  "category": "installation",
  "description": "Pasang complete head unit dan speaker",
  "price": 200000,
  "estimatedDuration": 120
}
```

---

### **👨‍🔧 TECHNICIANS** (`/api/technicians`)

#### **GET** `/api/technicians`
Dapatkan semua teknisi.

**Query Parameters:**
- `available` - Filter hanya yang tersedia (`true`)
- `specialization` - Filter by spesialisasi

#### **GET** `/api/technicians/available`
Cek teknisi yang tersedia di jadwal tertentu.

**Query Parameters:**
- `date` - Tanggal (YYYY-MM-DD)
- `time` - Waktu (HH:MM)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "phone": "08123456789",
      "specialization": ["audio", "security"],
      "rating": 4.5,
      "totalJobs": 150
    }
  ]
}
```

---

### **🏪 WORKSHOP** (`/api/workshop`)

#### **GET** `/api/workshop`
Dapatkan informasi bengkel.

#### **GET** `/api/workshop/timeslots`
Dapatkan slot waktu yang tersedia.

**Query Parameters:**
- `date` - Tanggal (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "bookingsCount": 2,
      "maxBookings": 3,
      "isAvailable": true
    },
    {
      "time": "10:00",
      "bookingsCount": 3,
      "maxBookings": 3,
      "isAvailable": false
    }
  ]
}
```

---

### **📅 BOOKINGS** (`/api/bookings`)

#### **POST** `/api/bookings`
Buat booking baru.

**Body:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "08123456789",
  "customerEmail": "john@example.com",
  "vehicleInfo": {
    "brand": "Toyota",
    "model": "Avanza",
    "year": "2020",
    "plateNumber": "B 1234 XYZ"
  },
  "bookingType": "sparepart_and_service",
  "spareparts": [
    {
      "sparepartId": "...",
      "quantity": 2
    }
  ],
  "services": [
    {
      "serviceId": "..."
    }
  ],
  "scheduledDate": "2025-12-15",
  "scheduledTime": "09:00",
  "serviceLocation": "workshop",
  "paymentMethod": "ewallet"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "...",
    "customerName": "John Doe",
    "totalPrice": 1200000,
    "bookingStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

#### **GET** `/api/bookings/my-bookings`
Dapatkan booking milik user yang login.

#### **GET** `/api/bookings/:id`
Dapatkan detail booking.

#### **POST** `/api/bookings/:id/payment`
Inisiasi pembayaran dengan Midtrans.

**Body:**
```json
{
  "paymentType": "full"  // atau "dp" untuk DP 50%
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "snapToken": "...",
    "snapRedirectUrl": "https://app.midtrans.com/snap/...",
    "orderId": "BOOKING-...-1234567890",
    "amount": 1200000
  }
}
```

#### **POST** `/api/bookings/:id/cancel`
Cancel booking.

**Body:**
```json
{
  "reason": "Berubah pikiran"
}
```

---

### **🔧 ADMIN ENDPOINTS**

#### **GET** `/api/bookings` (ADMIN)
Dapatkan semua booking.

**Query Parameters:**
- `status` - Filter by booking status
- `paymentStatus` - Filter by payment status
- `date` - Filter by scheduled date

#### **POST** `/api/bookings/:id/assign-technician` (ADMIN)
Assign teknisi ke booking.

**Body:**
```json
{
  "technicianId": "..."
}
```

#### **PATCH** `/api/bookings/:id/status` (ADMIN)
Update status booking.

**Body:**
```json
{
  "status": "in_progress"
}
```

Valid statuses: `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

#### **POST** `/api/bookings/:id/work-notes` (ADMIN/TECHNICIAN)
Tambah catatan pekerjaan.

**Body:**
```json
{
  "note": "Speaker sudah terpasang dengan baik",
  "photos": ["https://...", "https://..."]
}
```

#### **POST** `/api/bookings/:id/additional-cost` (ADMIN)
Tambah biaya tambahan.

**Body:**
```json
{
  "description": "Kabel tambahan",
  "amount": 50000
}
```

#### **GET** `/api/bookings/statistics/dashboard` (ADMIN)
Dapatkan statistik dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "pendingBookings": 10,
    "confirmedBookings": 5,
    "inProgressBookings": 3,
    "completedBookings": 130,
    "cancelledBookings": 2,
    "totalRevenue": 50000000
  }
}
```

---

## 💳 PAYMENT FLOW (MIDTRANS)

### **Alur Lengkap:**

```
1. User buat booking
   → Status: pending / pending

2. User inisiasi pembayaran
   POST /api/bookings/:id/payment
   → Dapatkan snapToken

3. Frontend redirect ke Midtrans Snap
   → User bayar

4. Midtrans kirim webhook
   POST /api/payment/webhook
   → Backend update status otomatis

5. Status berubah:
   - Jika success → paid / confirmed (atau dp_paid jika DP)
   - Jika gagal → failed / pending
   - Jika pending → pending / pending
```

### **Payment Status:**
- `pending` - Belum bayar
- `dp_paid` - DP sudah dibayar (50%)
- `paid` - Lunas
- `failed` - Pembayaran gagal
- `refunded` - Refund (future)

### **Booking Status:**
- `pending` - Menunggu konfirmasi/pembayaran
- `confirmed` - Sudah dikonfirmasi
- `in_progress` - Sedang dikerjakan
- `completed` - Selesai
- `cancelled` - Dibatalkan

---

## 🔐 ENVIRONMENT VARIABLES

```env
# Database
MONGODB_URI=mongodb+srv://...

# Clerk Authentication
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

# Port
PORT=3000
```

---

## 🚀 CARA MENJALANKAN

1. **Install dependencies:**
```bash
npm install
```

2. **Setup `.env`:**
Copy `.env.example` ke `.env` dan isi semua variable.

3. **Jalankan development server:**
```bash
npm run dev
```

4. **Server berjalan di:**
```
http://localhost:3000
```

---

## 📦 TECH STACK

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Clerk** - Authentication
- **Midtrans** - Payment Gateway
- **ImageKit** - Image Storage

---

## 🎯 NEXT STEPS

### Yang perlu ditambahkan:
1. ✅ Middleware untuk role checking (admin/user/technician)
2. ✅ Generate PDF invoice
3. ✅ Send WhatsApp notification (via WhatsApp Business API)
4. ✅ Email notification
5. ✅ Warranty tracking system
6. ✅ Review & rating system

---

## 📞 SUPPORT

Jika ada pertanyaan atau issue, silakan hubungi tim development.

**Happy Coding! 🚀**
