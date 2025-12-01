import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    // ===== USER INFO =====
    user: { type: String, ref: "user", required: true }, // User ID dari Clerk
    customerName: { type: String, required: true }, // Nama customer
    customerPhone: { type: String, required: true }, // Nomor HP customer
    customerEmail: { type: String }, // Email customer (opsional)
    
    // ===== VEHICLE INFO =====
    vehicleInfo: {
      brand: { type: String, required: true }, // Merek mobil (e.g., "Toyota")
      model: { type: String, required: true }, // Model (e.g., "Avanza")
      year: { type: String, required: true }, // Tahun (e.g., "2020")
      plateNumber: { type: String }, // Nomor plat (opsional)
    },
    
    // ===== BOOKING DETAILS =====
    bookingType: {
      type: String,
      enum: ["sparepart_only", "service_only", "sparepart_and_service"],
      required: true
    }, // Tipe booking
    
    spareparts: [
      {
        sparepart: { type: mongoose.Schema.Types.ObjectId, ref: "sparepart" },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }, // Harga saat booking (frozen)
      }
    ], // Sparepart yang dipesan
    
    services: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "service" },
        price: { type: Number, required: true }, // Harga saat booking (frozen)
      }
    ], // Layanan yang dipesan
    
    // ===== SCHEDULE =====
    scheduledDate: { type: Date, required: true }, // Tanggal booking
    scheduledTime: { type: String, required: true }, // Jam booking (e.g., "09:00")
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "technician" }, // Teknisi yang ditugaskan
    
    // ===== LOCATION =====
    serviceLocation: {
      type: String,
      enum: ["workshop", "onsite"],
      default: "workshop"
    }, // Lokasi servis
    onsiteAddress: { type: String }, // Alamat jika on-site
    
    // ===== PRICING =====
    subtotalSpareparts: { type: Number, default: 0 }, // Total harga sparepart
    subtotalServices: { type: Number, default: 0 }, // Total harga jasa
    additionalCosts: [
      {
        description: { type: String },
        amount: { type: Number },
        addedAt: { type: Date, default: Date.now }
      }
    ], // Biaya tambahan
    taxAmount: { type: Number, default: 0 }, // Pajak PPN
    totalPrice: { type: Number, required: true }, // Total harga keseluruhan
    
    // ===== PAYMENT =====
    paymentMethod: {
      type: String,
      enum: ["transfer", "ewallet", "va", "cod", "dp"],
      required: true
    }, // Metode pembayaran
    paymentStatus: {
      type: String,
      enum: ["pending", "dp_paid", "paid", "failed", "refunded"],
      default: "pending"
    }, // Status pembayaran
    dpAmount: { type: Number, default: 0 }, // Jumlah DP (jika ada)
    remainingPayment: { type: Number, default: 0 }, // Sisa pembayaran
    midtransOrderId: { type: String }, // Order ID dari Midtrans
    midtransTransactionId: { type: String }, // Transaction ID dari Midtrans
    paymentProofUrl: { type: String }, // Bukti transfer manual
    paidAt: { type: Date }, // Waktu pembayaran
    
    // ===== BOOKING STATUS =====
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending"
    }, // Status booking
    
    // ===== WORK PROGRESS =====
    workNotes: [
      {
        note: { type: String },
        addedBy: { type: String }, // User/technician yang menambahkan
        addedAt: { type: Date, default: Date.now },
        photos: [{ type: String }] // Foto progress
      }
    ], // Catatan pekerjaan
    
    completedAt: { type: Date }, // Waktu selesai
    
    // ===== WARRANTY & INVOICE =====
    warrantyEndDate: { type: Date }, // Tanggal akhir garansi
    invoiceUrl: { type: String }, // URL invoice PDF
    
    // ===== CANCELLATION =====
    cancellationReason: { type: String }, // Alasan pembatalan
    cancelledAt: { type: Date }, // Waktu pembatalan
    cancelledBy: { type: String }, // Siapa yang membatalkan
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
