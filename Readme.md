# 🚗 Workshop Booking System

> **Professional Car Audio Workshop Management & Booking Platform**

A comprehensive full-stack web application for managing car audio workshop operations, including online booking, inventory management, payment processing, and automated WhatsApp notifications.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

**Workshop Booking System** adalah platform manajemen bengkel audio mobil yang dirancang untuk:

- **Customers**: Memudahkan booking service dan pembelian sparepart audio mobil secara online
- **Workshop Admin**: Mengelola inventory, booking, teknisi, dan operasional bengkel
- **Technicians**: Menerima dan mengelola task pengerjaan service

### Key Highlights

- 🎨 **Modern UI/UX** - Responsive design dengan Tailwind CSS dan Framer Motion
- 💳 **Payment Integration** - Midtrans payment gateway dengan multiple payment methods
- 📱 **WhatsApp Notifications** - Automated notifications via Fonnte API
- 🔐 **Secure Authentication** - Clerk authentication with role-based access control
- 📊 **Real-time Dashboard** - Admin dashboard dengan statistik dan analytics
- 🖼️ **Image Management** - ImageKit CDN untuk optimized image delivery
- 📱 **PWA Ready** - Progressive Web App dengan offline capability

---

## ✨ Features

### 🛒 Customer Features

#### Online Booking System
- **Service Booking** - Book audio installation, repair, or upgrade services
- **Sparepart Shopping** - Browse and purchase car audio components
- **Hybrid Booking** - Combine service and sparepart in single booking
- **Schedule Selection** - Choose preferred date and time slots
- **Location Options** - Workshop service or on-site service at customer location

#### Payment & Transaction
- **Multiple Payment Methods** - E-Wallet (GoPay, OVO, Dana), Bank Transfer, Virtual Account
- **Down Payment (DP)** - Option to pay 50% upfront, rest upon completion
- **Free Booking** - Support for promotional free services
- **Invoice Generation** - Automatic PDF invoice generation
- **Payment Tracking** - Real-time payment status updates

#### Notifications & Updates
- **WhatsApp Notifications** - Automatic notifications for payment confirmation and status updates
- **Booking Status Tracking** - Real-time tracking: Pending → Confirmed → In Progress → Completed
- **Email Notifications** - (Optional) Email confirmations and reminders

### 👨‍💼 Admin Features

#### Dashboard & Analytics
- **Overview Dashboard** - Total bookings, revenue, pending orders
- **Statistics** - Booking trends, revenue charts, popular services
- **Audit Logs** - Track all administrative actions

#### Inventory Management
- **Sparepart Management** - CRUD operations for audio components
- **Stock Monitoring** - Real-time stock levels with low stock warnings
- **Image Upload** - Direct upload to ImageKit CDN
- **Compatibility** - Set vehicle compatibility for each sparepart
- **Pre-order** - Enable pre-order for out-of-stock items

#### Service Management
- **Service Catalog** - Manage installation, repair, upgrade packages
- **Pricing** - Flexible pricing management
- **Duration Estimates** - Set expected service duration
- **Availability Toggle** - Enable/disable services

#### Booking Management
- **Booking Overview** - View all bookings with filters (status, date, payment)
- **Technician Assignment** - Assign technicians to bookings
- **Status Updates** - Update booking progress status
- **Work Notes** - Add progress notes and photos
- **Additional Costs** - Add extra charges if needed

#### Technician Management
- **CRUD Technicians** - Add, edit, delete technician profiles
- **Specialization** - Set technician expertise (audio, electrical, etc.)
- **Availability** - Check technician availability by schedule
- **Performance Tracking** - Total jobs completed and ratings

### 👨‍🔧 Technician Features
- **Assigned Jobs** - View jobs assigned to them
- **Work Progress** - Update work status and add notes
- **Photo Upload** - Upload work progress photos

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI library |
| **Vite** | 6.3.5 | Build tool & dev server |
| **Tailwind CSS** | 4.1.8 | Utility-first CSS framework |
| **Framer Motion** | 12.23.24 | Animation library |
| **React Router** | 7.6.2 | Client-side routing |
| **Axios** | 1.9.0 | HTTP client |
| **React Hot Toast** | 2.5.2 | Toast notifications |
| **React Icons** | 5.5.0 | Icon library |
| **jsPDF** | 3.0.4 | PDF generation |
| **Clerk** | 5.31.9 | Authentication |
| **Vite PWA** | 1.1.0 | Progressive Web App |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.1.0 | Web framework |
| **MongoDB** | 8.15.1 | NoSQL database |
| **Mongoose** | 8.15.1 | MongoDB ODM |
| **Clerk SDK** | 5.1.6 | Authentication middleware |
| **Midtrans** | 1.4.3 | Payment gateway |
| **ImageKit** | 6.0.0 | Image CDN & optimization |
| **Axios** | 1.13.2 | HTTP client (for Fonnte) |
| **Multer** | 2.0.1 | File upload handling |
| **Dotenv** | 16.5.0 | Environment variables |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Nodemon** | 3.1.10 | Dev auto-restart |

### Third-Party Services

| Service | Purpose |
|---------|---------|
| **Clerk** | User authentication & authorization |
| **Midtrans** | Payment processing (Sandbox & Production) |
| **ImageKit** | CDN & image optimization |
| **Fonnte** | WhatsApp Business API for notifications |
| **MongoDB Atlas** | Cloud database hosting |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │   Utils    │            │
│  │ - Home     │  │ - Navbar   │  │ - API      │            │
│  │ - Booking  │  │ - Cards    │  │ - Payment  │            │
│  │ - Admin    │  │ - Forms    │  │ - Auth     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS (Axios)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Controllers │  │ Middlewares │  │   Routes    │         │
│  │ - Booking   │  │ - Auth      │  │ /api/...    │         │
│  │ - Sparepart │  │ - Upload    │  │             │         │
│  │ - Service   │  └─────────────┘  └─────────────┘         │
│  └─────────────┘                                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Models    │  │   Utils     │  │   Config    │         │
│  │ - Booking   │  │ - WhatsApp  │  │ - Database  │         │
│  │ - User      │  │ - Test      │  │ - ImageKit  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────┬──────────────┬──────────────┬───────────────┬──────┘
         │              │              │               │
         ↓              ↓              ↓               ↓
┌────────────┐  ┌────────────┐  ┌───────────┐  ┌───────────┐
│  MongoDB   │  │   Clerk    │  │ Midtrans  │  │  Fonnte   │
│  Database  │  │    Auth    │  │  Payment  │  │ WhatsApp  │
└────────────┘  └────────────┘  └───────────┘  └───────────┘
         ↓
┌────────────┐
│ ImageKit   │
│    CDN     │
└────────────┘
```

### Request Flow Example: Create Booking

```
1. Customer submits booking form → React Frontend
2. Frontend validates input → Send POST /api/bookings
3. Backend authenticates via Clerk → Verify user JWT
4. Backend creates booking → MongoDB (pending status)
5. Backend initiates payment → Midtrans API (get snap token)
6. Frontend redirects to payment page → Midtrans Snap
7. Customer completes payment → Midtrans processes
8. Midtrans sends webhook → POST /api/payment/webhook
9. Backend updates booking → MongoDB (paid status)
10. Backend sends WhatsApp → Fonnte API
    - Notification to admin (booking details)
    - Notification to customer (payment confirmation)
11. Frontend shows success → Navigate to My Bookings
```

---

## 🗄️ Database Schema

### Collections Overview

| Collection | Description | Relations |
|------------|-------------|-----------|
| `users` | User accounts synced from Clerk | None |
| `spareparts` | Audio components inventory | bookings.spareparts |
| `services` | Service catalog | bookings.services |
| `technicians` | Technician profiles | bookings.technician |
| `bookings` | Customer bookings | users, spareparts, services, technicians |
| `workshops` | Workshop information | None |
| `auditlogs` | Admin action logs | users |

### Detailed Schemas

#### 📦 Booking Model
```javascript
{
  _id: ObjectId,
  user: ObjectId,               // ref: 'User'
  
  // Customer Info
  customerName: String,
  customerPhone: String,       // Format: 628xxx for WhatsApp
  customerEmail: String,
  
  // Vehicle Info
  vehicleInfo: {
    brand: String,
    model: String,
    year: String,
    plateNumber: String
  },
  
  // Booking Details
  bookingType: Enum,           // 'sparepart_only', 'service_only', 'sparepart_and_service'
  spareparts: [{
    sparepart: ObjectId,       // ref: 'Sparepart'
    quantity: Number,
    price: Number
  }],
  services: [{
    service: ObjectId,         // ref: 'Service'
    price: Number
  }],
  
  // Schedule
  scheduledDate: Date,
  scheduledTime: String,       // "09:00", "10:00", etc.
  serviceLocation: Enum,       // 'workshop', 'onsite'
  onsiteAddress: String,
  
  // Pricing
  subtotalSpareparts: Number,
  subtotalServices: Number,
  taxAmount: Number,           // PPN 11%
  totalPrice: Number,
  
  // Payment
  paymentMethod: Enum,         // 'ewallet', 'transfer', 'va'
  paymentStatus: Enum,         // 'pending', 'paid', 'dp_paid', 'failed'
  dpAmount: Number,            // 50% if DP
  remainingPayment: Number,
  paidAt: Date,
  midtransOrderId: String,
  midtransTransactionId: String,
  
  // Work Progress
  technician: ObjectId,        // ref: 'Technician'
  bookingStatus: Enum,         // 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  workNotes: [{
    note: String,
    photos: [String],          // ImageKit URLs
    createdAt: Date
  }],
  additionalCosts: [{
    description: String,
    amount: Number
  }],
  completedAt: Date,
  cancelReason: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### 🔧 Sparepart Model
```javascript
{
  _id: ObjectId,
  name: String,
  category: Enum,              // 'speaker', 'amplifier', 'subwoofer', etc.
  brand: String,
  price: Number,
  stock: Number,
  lowStockThreshold: Number,
  description: String,
  specifications: Mixed,
  images: [String],            // ImageKit URLs
  compatibleVehicles: [{
    brand: String,
    model: String,
    year: String
  }],
  warranty: Number,            // in months
  isAvailable: Boolean,
  isPreOrderOnly: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 🛠️ Service Model
```javascript
{
  _id: ObjectId,
  name: String,
  category: Enum,              // 'installation', 'repair', 'upgrade', 'package'
  description: String,
  price: Number,
  estimatedDuration: Number,   // in minutes
  images: [String],            // ImageKit URLs
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 👨‍🔧 Technician Model
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  specialization: [String],    // ['audio', 'electrical', 'security']
  rating: Number,              // 0-5
  totalJobs: Number,
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 👤 User Model
```javascript
{
  _id: ObjectId,
  clerkId: String,             // Unique ID from Clerk
  email: String,
  name: String,
  role: Enum,                  // 'customer', 'admin', 'technician'
  createdAt: Date,
  updatedAt: Date
}
```

#### 🏭 Workshop Model
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String,
  operatingHours: {
    open: String,              // "08:00"
    close: String,             // "17:00"
    days: [String]             // ["Monday", "Tuesday", ...]
  },
  maxBookingsPerSlot: Number,
  timeSlots: [String],         // ["09:00", "10:00", ...]
  createdAt: Date,
  updatedAt: Date
}
```

#### 📋 Audit Log Model
```javascript
{
  _id: ObjectId,
  user: ObjectId,              // ref: 'User'
  action: String,              // 'create', 'update', 'delete'
  entity: String,              // 'booking', 'sparepart', etc.
  entityId: ObjectId,
  changes: Mixed,              // Before/after values
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x (comes with Node.js)
- **MongoDB** ≥ 6.x ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- **Git** ([Download](https://git-scm.com/))

### Required Accounts

You'll need to create accounts for:

1. **Clerk** - Authentication ([clerk.com](https://clerk.com))
2. **Midtrans** - Payment gateway ([midtrans.com](https://midtrans.com))
3. **ImageKit** - Image CDN ([imagekit.io](https://imagekit.io))
4. **Fonnte** - WhatsApp API ([fonnte.com](https://fonnte.com))
5. **MongoDB Atlas** - Database hosting ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kzherdinnn/WEB-KP.git
cd WEB-KP
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

---

## 🔧 Configuration

### 1. Backend Environment Variables

Create `server/.env` file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workshop-booking?retryWrites=true&w=majority

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Midtrans Payment
MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_IS_PRODUCTION=false

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/

# WhatsApp Notification (Fonnte)
FONNTE_API_TOKEN=your_fonnte_token
ADMIN_WHATSAPP_NUMBER=628123456789

# Server
PORT=3000
NODE_ENV=development
```

### 2. Frontend Environment Variables

Create `client/.env` file:

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
```

### 3. Database Seeding (Optional)

Populate database with sample data:

```bash
cd server
npm run seed
```

This will create:
- Sample spareparts (speakers, amplifiers, etc.)
- Sample services (installation, repair)
- Sample technicians
- Workshop information

---

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:3000`

#### Start Frontend Dev Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Backend
```bash
cd server
npm start
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication

All protected routes require authentication via Clerk:

```javascript
Headers: {
  'Authorization': 'Bearer <clerk_session_token>'
}
```

### Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Spareparts** |
| GET | `/spareparts` | Get all spareparts | Public |
| GET | `/spareparts/:id` | Get sparepart by ID | Public |
| POST | `/spareparts` | Create sparepart | Admin |
| PUT | `/spareparts/:id` | Update sparepart | Admin |
| DELETE | `/spareparts/:id` | Delete sparepart | Admin |
| **Services** |
| GET | `/services` | Get all services | Public |
| GET | `/services/:id` | Get service by ID | Public |
| POST | `/services` | Create service | Admin |
| PUT | `/services/:id` | Update service | Admin |
| DELETE | `/services/:id` | Delete service | Admin |
| **Bookings** |
| POST | `/bookings` | Create booking | User |
| GET | `/bookings/my-bookings` | Get user bookings | User |
| GET | `/bookings` | Get all bookings | Admin |
| GET | `/bookings/:id` | Get booking details | User/Admin |
| POST | `/bookings/:id/payment` | Initiate payment | User |
| PATCH | `/bookings/:id/status` | Update status | Admin |
| POST | `/bookings/:id/assign-technician` | Assign technician | Admin |
| POST | `/bookings/:id/work-notes` | Add work note | Admin/Tech |
| **Technicians** |
| GET | `/technicians` | Get all technicians | Public |
| GET | `/technicians/available` | Get available technicians | Public |
| POST | `/technicians` | Create technician | Admin |
| **Workshop** |
| GET | `/workshop` | Get workshop info | Public |
| GET | `/workshop/timeslots` | Get available time slots | Public |
| **Payment** |
| POST | `/payment/webhook` | Midtrans webhook | Midtrans |

For detailed API documentation, see [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)

---

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
cd client
npm run build
vercel --prod
```

#### Netlify
```bash
cd client
npm run build
netlify deploy --prod
```

### Backend Deployment (Railway/Render/Heroku)

#### Railway
```bash
cd server
railway up
```

#### Render
1. Connect GitHub repository
2. Select `server` folder
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Environment Variables for Production

Ensure all production environment variables are set:

- Set `NODE_ENV=production`
- Set `MIDTRANS_IS_PRODUCTION=true` for live payments
- Use production URLs for all services
- Set proper CORS origins

---

## 📁 Project Structure

```
WEB-KP/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   │   ├── icons/                   # PWA icons
│   │   └── manifest.json            # PWA manifest
│   ├── src/
│   │   ├── assets/                  # Images, fonts
│   │   ├── components/              # React components
│   │   │   ├── Admin/               # Admin components
│   │   │   ├── Booking/             # Booking components
│   │   │   ├── CompanyProfile/      # Profile components
│   │   │   ├── Featured/            # Featured items
│   │   │   ├── Footer/              # Footer component
│   │   │   ├── Hero/                # Hero section
│   │   │   ├── Navbar/              # Navigation
│   │   │   ├── Payment/             # Payment components
│   │   │   └── ServiceCard/         # Service cards
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Spareparts.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── Admin/               # Admin pages
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.js               # API client
│   │   │   └── payment.js           # Payment utilities
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Backend (Node.js + Express)
│   ├── config/                      # Configuration files
│   │   ├── database.js              # MongoDB connection
│   │   ├── clerk.js                 # Clerk config
│   │   └── imagekit.js              # ImageKit config
│   ├── controllers/                 # Request handlers
│   │   ├── bookingController.js
│   │   ├── sparepartController.js
│   │   ├── serviceController.js
│   │   ├── technicianController.js
│   │   ├── workshopController.js
│   │   ├── midtransWebHook.js
│   │   └── clerkWebHook.js
│   ├── middlewares/                 # Express middlewares
│   │   ├── auth.middleware.js       # Clerk auth
│   │   └── upload.middleware.js     # Multer upload
│   ├── models/                      # Mongoose schemas
│   │   ├── booking.models.js
│   │   ├── sparepart.models.js
│   │   ├── service.models.js
│   │   ├── technician.models.js
│   │   ├── user.models.js
│   │   ├── workshop.models.js
│   │   └── auditLog.models.js
│   ├── routes/                      # API routes
│   │   ├── bookingRoutes.js
│   │   ├── sparepartRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── technicianRoutes.js
│   │   └── workshopRoutes.js
│   ├── scripts/                     # Utility scripts
│   │   └── seedWorkshopData.js      # Database seeder
│   ├── utils/                       # Helper functions
│   │   ├── whatsappService.js       # WhatsApp notification
│   │   └── testWhatsApp.js          # WhatsApp test script
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── server.js                    # Entry point
│   ├── API_DOCUMENTATION.md         # API docs
│   ├── WHATSAPP_SETUP.md            # WhatsApp setup guide
│   └── WHATSAPP_QUICKSTART.md       # WhatsApp quick guide
│
└── README.md                        # This file
```

---

## 🔌 Integrations

### 1. Clerk Authentication

**Setup:**
1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Enable email + password authentication
4. Copy API keys to `.env`
5. Set up user metadata for roles (customer/admin/technician)

**Webhook Setup:**
- Endpoint: `https://your-domain.com/api/clerk/webhook`
- Events: `user.created`, `user.updated`, `user.deleted`

### 2. Midtrans Payment Gateway

**Setup:**
1. Register at [midtrans.com](https://midtrans.com)
2. Get Sandbox credentials for testing
3. Configure allowed payment methods
4. Set notification URL for webhooks

**Webhook:**
- URL: `https://your-domain.com/api/payment/webhook`
- Midtrans will POST payment status updates

**Test Cards (Sandbox):**
```
Card Number: 4811 1111 1111 1114
CVV: 123
Exp Date: 01/26
3D Secure: 112233
```

### 3. ImageKit CDN

**Setup:**
1. Create account at [imagekit.io](https://imagekit.io)
2. Create a folder for your workshop images
3. Copy public key, private key, URL endpoint
4. Configure upload presets

**Features Used:**
- Image optimization
- Automatic format conversion (WebP)
- Responsive images
- CDN delivery

### 4. Fonnte WhatsApp API

**Setup:**
1. Register at [fonnte.com](https://fonnte.com)
2. Connect your WhatsApp number (scan QR code)
3. Get API token from dashboard
4. Add admin WhatsApp number to `.env`

**Notifications Sent:**
- Booking confirmation to customer
- New booking alert to admin
- Payment confirmation
- Status update notifications

For detailed setup, see [WHATSAPP_SETUP.md](server/WHATSAPP_SETUP.md)

---

## 🧪 Testing

### Backend Testing

#### Test WhatsApp Notifications
```bash
cd server
node utils/testWhatsApp.js
```

#### Test Database Seeding
```bash
npm run seed
```

### Frontend Testing

#### Run Development Server
```bash
cd client
npm run dev
```

#### Build Production Bundle
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

### Testing Payment Flow

1. Create booking from frontend
2. Use Midtrans sandbox card for payment
3. Verify webhook received in backend logs
4. Check booking status updated
5. Verify WhatsApp notifications sent

---

## 🔐 Security Considerations

### Authentication
- ✅ Clerk handles user authentication securely
- ✅ JWT tokens for API requests
- ✅ Role-based access control (RBAC)
- ✅ Protected routes on frontend and backend

### Data Protection
- ✅ Environment variables for sensitive data
- ✅ `.env` files in `.gitignore`
- ✅ HTTPS in production
- ✅ CORS configuration

### Payment Security
- ✅ PCI DSS compliant via Midtrans
- ✅ No card data stored on server
- ✅ Webhook signature verification
- ✅ Server-side payment validation

### Best Practices
- ✅ Input validation on both frontend and backend
- ✅ SQL injection prevention (MongoDB ODM)
- ✅ XSS protection
- ✅ Rate limiting on API endpoints
- ✅ Audit logs for admin actions

---

## 📊 Performance Optimization

### Frontend
- ✅ Code splitting with React Router
- ✅ Lazy loading components
- ✅ Image optimization via ImageKit
- ✅ Minified production builds
- ✅ PWA for offline capability
- ✅ Framer Motion for smooth animations

### Backend
- ✅ MongoDB indexing on frequently queried fields
- ✅ Pagination for large datasets
- ✅ Efficient database queries (populate only needed fields)
- ✅ Compression middleware
- ✅ Caching strategies

### CDN & Assets
- ✅ ImageKit CDN for global image delivery
- ✅ Optimized image formats (WebP)
- ✅ Responsive images
- ✅ Lazy loading images

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Use different port
PORT=3001 npm run dev
```

#### Frontend can't connect to backend
```bash
# Verify backend is running on correct port
# Check VITE_API_URL in client/.env
# Ensure CORS is configured correctly
```

#### Database connection fails
```bash
# Verify MongoDB URI is correct
# Check if IP is whitelisted in MongoDB Atlas
# Test connection with MongoDB Compass
```

#### WhatsApp notifications not sending
```bash
# Check if FONNTE_API_TOKEN is set
# Verify WhatsApp device is connected on Fonnte
# Check phone number format (628xxx)
# Review server logs for error messages
```

#### Payment webhook not working
```bash
# Verify webhook URL is accessible (use ngrok for local testing)
# Check Midtrans dashboard for webhook logs
# Ensure MIDTRANS_SERVER_KEY is correct
# Review webhook handler logs
```

---

## 📚 Additional Documentation

- [API Documentation](server/API_DOCUMENTATION.md) - Complete API reference
- [System Flow](server/SYSTEM_FLOW.md) - Detailed system workflows
- [WhatsApp Setup](server/WHATSAPP_SETUP.md) - WhatsApp notification setup
- [Migration Guide](server/MIGRATION_GUIDE.md) - Database migration guide

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Kzherdin** - *Initial work* - [kzherdinnn](https://github.com/kzherdinnn)

---

## 🙏 Acknowledgments

- React team for the amazing library
- Clerk for hassle-free authentication
- Midtrans for reliable payment processing
- ImageKit for powerful image optimization
- Fonnte for WhatsApp Business API
- MongoDB for flexible database solution
- Tailwind CSS for utility-first CSS
- All open-source contributors

---

## 📞 Support

For support, email [your-email@example.com] or open an issue in this repository.

### Useful Links
- **Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)
- **Bug Reports**: [GitHub Issues](https://github.com/kzherdinnn/WEB-KP/issues)
- **Documentation**: [Wiki](https://github.com/kzherdinnn/WEB-KP/wiki)

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Complete booking system
- ✅ Payment integration
- ✅ WhatsApp notifications
- ✅ Admin dashboard
- ✅ PWA support

### Version 1.1 (Planned)
- ⏳ Email notifications
- ⏳ Customer reviews & ratings
- ⏳ Loyalty program
- ⏳ Advanced analytics dashboard
- ⏳ Multi-language support

### Version 2.0 (Future)
- 🔮 Mobile app (React Native)
- 🔮 Real-time chat support
- 🔮 Inventory forecasting
- 🔮 CRM integration
- 🔮 Franchise management

---

<div align="center">

**Made with ❤️ for car audio enthusiasts**

[⬆ Back to Top](#-workshop-booking-system)

</div>
