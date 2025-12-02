/**
 * WhatsApp Notification Test Script
 * 
 * Script sederhana untuk test WhatsApp notification secara manual
 * Jalankan: node utils/testWhatsApp.js
 */

import dotenv from "dotenv";
import {
  sendWhatsAppMessage,
  sendAdminBookingNotification,
  sendCustomerPaymentConfirmation,
} from "./whatsappService.js";

// Load environment variables
dotenv.config();

// ===== TEST DATA =====
const mockBooking = {
  _id: "674d1234567890abcdef",
  customerName: "John Doe",
  customerPhone: "08123456789", // Ganti dengan nomor HP Anda untuk testing
  customerEmail: "john@example.com",
  vehicleInfo: {
    brand: "Toyota",
    model: "Avanza",
    year: "2020",
    plateNumber: "B 1234 XYZ",
  },
  bookingType: "sparepart_and_service",
  scheduledDate: new Date("2025-12-15"),
  scheduledTime: "09:00",
  serviceLocation: "workshop",
  totalPrice: 1200000,
  dpAmount: 600000,
  remainingPayment: 600000,
  paymentStatus: "paid", // atau "dp_paid"
  paymentMethod: "ewallet",
  bookingStatus: "confirmed",
};

// ===== TEST FUNCTIONS =====

async function testSimpleMessage() {
  console.log("\n🧪 TEST 1: Send Simple WhatsApp Message");
  console.log("=" .repeat(50));
  
  const phoneNumber = process.env.ADMIN_WHATSAPP_NUMBER || "628123456789";
  const message = "🧪 Test pesan dari Workshop Booking System!\n\nJika Anda menerima pesan ini, berarti WhatsApp notification sudah berfungsi! ✅";
  
  const result = await sendWhatsAppMessage(phoneNumber, message);
  
  if (result.success) {
    console.log("✅ Test BERHASIL - Pesan terkirim!");
  } else {
    console.log("❌ Test GAGAL - Pesan tidak terkirim");
    console.log("Error:", result.error || result.message);
  }
}

async function testAdminNotification() {
  console.log("\n🧪 TEST 2: Send Admin Booking Notification");
  console.log("=".repeat(50));
  
  const result = await sendAdminBookingNotification(mockBooking);
  
  if (result.success) {
    console.log("✅ Test BERHASIL - Notifikasi admin terkirim!");
  } else {
    console.log("❌ Test GAGAL - Notifikasi admin tidak terkirim");
    console.log("Error:", result.error || result.message);
  }
}

async function testCustomerNotification() {
  console.log("\n🧪 TEST 3: Send Customer Payment Confirmation");
  console.log("=".repeat(50));
  
  const result = await sendCustomerPaymentConfirmation(mockBooking);
  
  if (result.success) {
    console.log("✅ Test BERHASIL - Notifikasi customer terkirim!");
  } else {
    console.log("❌ Test GAGAL - Notifikasi customer tidak terkirim");
    console.log("Error:", result.error || result.message);
  }
}

// ===== MAIN TEST RUNNER =====
async function runAllTests() {
  console.log("\n");
  console.log("=" .repeat(50));
  console.log("📱 WHATSAPP NOTIFICATION TEST SUITE");
  console.log("=".repeat(50));
  
  // Check environment variables
  if (!process.env.FONNTE_API_TOKEN) {
    console.log("\n❌ ERROR: FONNTE_API_TOKEN tidak ditemukan di .env");
    console.log("Silakan setup terlebih dahulu. Lihat WHATSAPP_SETUP.md\n");
    return;
  }
  
  if (!process.env.ADMIN_WHATSAPP_NUMBER) {
    console.log("\n⚠️ WARNING: ADMIN_WHATSAPP_NUMBER tidak ditemukan di .env");
    console.log("Menggunakan nomor default untuk testing\n");
  }
  
  console.log("\n✅ Environment variables OK");
  console.log(`📱 Admin WhatsApp: ${process.env.ADMIN_WHATSAPP_NUMBER || "Not set"}`);
  console.log(`🔑 API Token: ${process.env.FONNTE_API_TOKEN.substring(0, 10)}...`);
  
  // Run tests
  try {
    await testSimpleMessage();
    
    // Wait 2 seconds between tests to avoid rate limiting
    console.log("\n⏳ Waiting 2 seconds...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await testAdminNotification();
    
    console.log("\n⏳ Waiting 2 seconds...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await testCustomerNotification();
    
    console.log("\n");
    console.log("=".repeat(50));
    console.log("✅ TESTING SELESAI!");
    console.log("=".repeat(50));
    console.log("\nCek WhatsApp Anda untuk melihat pesan yang terkirim.\n");
    
  } catch (error) {
    console.error("\n❌ Error during testing:", error.message);
  }
}

// ===== RUN TESTS =====
runAllTests();
