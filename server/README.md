# 🔧 WORKSHOP BOOKING SYSTEM - BACKEND

Backend API untuk sistem booking bengkel audio mobil dengan pembayaran Midtrans terintegrasi.

---

## 🎯 OVERVIEW

Sistem ini memungkinkan user untuk:
- ✅ Browse sparepart & layanan bengkel
- ✅ Cek stok real-time & kompatibilitas kendaraan
- ✅ Booking jadwal pemasangan dengan teknisi
- ✅ Pembayaran via Midtrans (Full / DP 50%)
- ✅ Track progress pekerjaan
- ✅ Lihat riwayat servis & garansi

---

## 🚀 QUICK START

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd server
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Setup Environment**
Copy `.env.example` ke `.env` dan isi semua variable:
```bash
cp .env.example .env
```

Edit `.env` dengan credentials Anda.

### 4. **Seed Database** (Optional)
Isi database dengan data sample:
```bash
npm run seed
```

### 5. **Run Development Server**
```bash
npm run dev
```

Server berjalan di: **http://localhost:3000**

---

## 📁 PROJECT STRUCTURE

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── imagekit.js        # ImageKit config
├── controllers/
│   ├── bookingController.js       # ✨ Main booking logic
│   ├── sparepartController.js     # Sparepart CRUD
│   ├── serviceController.js       # Service CRUD
│   ├── technicianController.js    # Technician management
│   ├── workshopController.js      # Workshop info
│   ├── userController.js          # User management
│   ├── midtransWebHook.js         # ✨ Payment webhook
│   ├── clerkWebHook.js            # Auth webhook
│   └── auditLogController.js      # Audit logs
├── models/
│   ├── booking.models.js          # ✨ Booking schema
│   ├── sparepart.models.js        # Sparepart schema
│   ├── service.models.js          # Service schema
│   ├── technician.models.js       # Technician schema
│   ├── workshop.models.js         # Workshop schema
│   ├── user.models.js             # User schema
│   └── auditLog.models.js         # Audit log schema
├── routes/
│   ├── bookingRoutes.js
│   ├── sparepartRoutes.js
│   ├── serviceRoutes.js
│   ├── technicianRoutes.js
│   ├── workshopRoutes.js
│   ├── userRoutes.js
│   ├── imagekitRoutes.js
│   └── auditLogRoutes.js
├── scripts/
│   └── seedWorkshopData.js        # Database seeder
├── middlewares/
│   └── (authentication, validation)
├── utils/
│   └── (helper functions)
├── .env.example
├── server.js                      # ✨ Main entry point
├── package.json
├── API_DOCUMENTATION.md           # 📚 Full API docs
├── MIGRATION_GUIDE.md             # 🔄 Migration from hotel
└── SYSTEM_FLOW.md                 # 📊 Flow diagrams
```

---

## 🔧 API ENDPOINTS

### **Core Resources:**

| Resource | Endpoint | Description |
|----------|----------|-------------|
| Spareparts | `/api/spareparts` | Manage spareparts |
| Services | `/api/services` | Manage services |
| Technicians | `/api/technicians` | Manage technicians |
| Workshop | `/api/workshop` | Workshop info & time slots |
| Bookings | `/api/bookings` | Booking management |
| Payment | `/api/payment/webhook` | Midtrans webhook |

📚 **Full API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 💳 PAYMENT INTEGRATION

### **Midtrans Snap**
- Support: E-Wallet, VA, QRIS, Transfer
- DP Support: 50% down payment
- Auto status update via webhook

### **Payment Flow:**
```
1. Create booking → pending
2. Initiate payment → get snapToken
3. User pays via Midtrans
4. Webhook updates status → paid/dp_paid
5. Booking auto-confirmed
```

---

## 🗂️ DATABASE MODELS

### **Main Entities:**

1. **Sparepart** - Audio car parts (speaker, amplifier, etc)
2. **Service** - Installation, repair, packages
3. **Technician** - Workshop technicians
4. **Workshop** - Workshop info & operating hours
5. **Booking** - User bookings with payment tracking
6. **User** - User accounts (Clerk sync)

📊 **Schema Relationships**: [SYSTEM_FLOW.md](./SYSTEM_FLOW.md)

---

## 🔐 AUTHENTICATION

**Clerk Authentication** digunakan untuk:
- User login/signup
- Protected routes
- Role-based access (admin, user, technician)

Middleware: `ClerkExpressWithAuth()`

---

## 📦 SCRIPTS

| Command | Description |
|---------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run development server (nodemon) |
| `npm run seed` | Seed database with sample data |

---

## 🔄 MIGRATION FROM HOTEL SYSTEM

Jika Anda migrasi dari sistem booking hotel:

📖 **Lihat**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

**Key Changes:**
- `hotel` → `workshop`
- `room` → `sparepart` + `service`
- `checkIn/Out` → `scheduledDate/Time`
- Tambahan: `technician`, `workNotes`, `additionalCosts`

---

## 🛠️ TECH STACK

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: Clerk
- **Payment**: Midtrans
- **Storage**: ImageKit
- **Dev**: Nodemon

---

## 📊 SYSTEM FEATURES

### ✅ **Booking System**
- Multiple booking types (sparepart only, service only, combined)
- Vehicle compatibility check
- Real-time stock validation
- Time slot availability check
- Technician assignment

### ✅ **Payment System**
- Full payment support
- DP (Down Payment) 50% support
- Multiple payment methods
- Auto status update via webhook
- Payment proof upload (manual transfer)

### ✅ **Work Management**
- Work progress notes
- Photo documentation
- Additional costs tracking
- Status transitions tracking
- Auto stock reduction on completion

### ✅ **Reporting**
- Booking statistics
- Revenue tracking
- Technician performance
- Stock alerts

---

## 🔍 TESTING

### **Manual Testing:**

1. **Get Spareparts**
```bash
GET http://localhost:3000/api/spareparts
```

2. **Create Booking**
```bash
POST http://localhost:3000/api/bookings
Authorization: Bearer {clerk_token}
Content-Type: application/json

{
  "customerName": "Test User",
  "customerPhone": "08123456789",
  ...
}
```

3. **Initiate Payment**
```bash
POST http://localhost:3000/api/bookings/{id}/payment
{
  "paymentType": "full"
}
```

---

## ⚙️ ENVIRONMENT VARIABLES

Required environment variables:

```env
# Database
MONGODB_URI=...

# Authentication
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
CLERK_WEBHOOK_SECRET=...

# Payment
MIDTRANS_CLIENT_KEY=...
MIDTRANS_SERVER_KEY=...
MIDTRANS_IS_PRODUCTION=false

# Image Storage
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...

# Server
PORT=3000
```

📝 **Template**: [.env.example](./.env.example)

---

## 🆘 TROUBLESHOOTING

### **Common Issues:**

**1. Cannot connect to MongoDB**
- Check `MONGODB_URI` in `.env`
- Ensure IP whitelist in MongoDB Atlas

**2. Clerk authentication failed**
- Verify `CLERK_SECRET_KEY`
- Check if token is sent in Authorization header

**3. Midtrans webhook not working**
- Ensure webhook URL is configured in Midtrans dashboard
- Check `MIDTRANS_SERVER_KEY`
- Test with Midtrans simulator

**4. Stock not reducing**
- Stock reduces when booking status = `completed`
- Check booking status flow

---

## 🚀 DEPLOYMENT

### **Vercel (Recommended)**

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

`vercel.json` already configured.

### **Other Platforms**
- Railway
- Render
- Heroku
- AWS/GCP

---

## 📚 DOCUMENTATION

- 📖 [API Documentation](./API_DOCUMENTATION.md)
- 🔄 [Migration Guide](./MIGRATION_GUIDE.md)
- 📊 [System Flow](./SYSTEM_FLOW.md)

---

## 🤝 CONTRIBUTING

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

---

## 📄 LICENSE

This project is licensed under the ISC License.

---

## 📞 SUPPORT

For questions or issues:
- Check documentation
- Open GitHub issue
- Contact development team

---

## 🎉 CREDITS

Developed with ❤️ for workshop automation.

**Happy Coding! 🚀**
