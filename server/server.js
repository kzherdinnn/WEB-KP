import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// Impor router Anda
import userRouter from "./routes/userRoutes.js";
import sparepartRouter from "./routes/sparepartRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";
import technicianRouter from "./routes/technicianRoutes.js";
import workshopRouter from "./routes/workshopRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import auditLogRouter from "./routes/auditLogRoutes.js";
import articleRouter from "./routes/articleRoutes.js";
import { connectImageKit } from "./config/imagekit.js";
import imagekitRoutes from "./routes/imagekitRoutes.js";
import { midtransWebHook } from "./controllers/midtransWebHook.js";

// ✅ Impor controller webhook yang sudah Anda buat
import clerkWebHooks from "./controllers/clerkWebHook.js";

// =====================================================
// ⚙️ Konfigurasi Aplikasi
// =====================================================
const app = express();
await connectDB();
await connectImageKit();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://stayza.vercel.app",
];

// =====================================================
// 🌍 Middleware & Rute Publik (Tidak Perlu Login)
// =====================================================
app.get("/", (req, res) => res.send("🚀 Server is working!"));

// Webhook Midtrans
app.post("/api/payment/webhook", express.json(), midtransWebHook);

// ✅ RUTE WEBHOOK CLERK
// Penting: Rute ini harus didefinisikan SEBELUM express.json() global
// dan harus menggunakan express.raw() agar verifikasi berhasil.
app.post(
  "/api/clerk-webhook",
  express.raw({ type: "application/json" }),
  clerkWebHooks
);

// Middleware CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware umum untuk mengubah body request menjadi JSON
app.use(express.json());

// =====================================================
// 🔒 Middleware Otentikasi Clerk (Untuk Protected Routes)
// =====================================================
// Menggunakan ClerkExpressWithAuth untuk attach auth ke semua requests
// tapi tidak memblok request yang tidak authenticated
app.use(ClerkExpressWithAuth());

// =====================================================
// 🧩 Rute API yang Dilindungi (Memerlukan Login)
// =====================================================
app.use("/api/user", userRouter);
app.use("/api/spareparts", sparepartRouter);
app.use("/api/services", serviceRouter);
app.use("/api/technicians", technicianRouter);
app.use("/api/workshop", workshopRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/audit-logs", auditLogRouter);
app.use("/api/articles", articleRouter);
app.use("/api/imagekit", imagekitRoutes);

// =====================================================
// 🚀 Start Server
// =====================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
