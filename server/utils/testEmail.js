import { sendEmail, sendBookingConfirmationEmail } from "./emailService.js";
import dotenv from "dotenv";

dotenv.config();

const testEmailService = async () => {
  console.log("=" .repeat(60));
  console.log("🧪 TESTING EMAIL SERVICE");
  console.log("=".repeat(60));

  // Test 1: Simple email
  console.log("\n📧 Test 1: Sending simple test email...");
  const result1 = await sendEmail(
    process.env.EMAIL_USER, // Send to yourself for testing
    "🧪 Test Email - Workshop Booking System",
    `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #667eea;">✅ Email Service Working!</h1>
        <p>This is a test email from your Workshop Booking System.</p>
        <p>If you received this, email notifications are configured correctly.</p>
        <hr>
        <p style="color: #6b7280; font-size: 14px;">Sent at: ${new Date().toLocaleString("id-ID")}</p>
      </div>
    `
  );

  if (result1.success) {
    console.log("✅ Test 1 PASSED - Simple email sent successfully");
  } else {
    console.log("❌ Test 1 FAILED -", result1.error);
  }

  // Test 2: Booking confirmation email (mock data)
  console.log("\n📧 Test 2: Sending booking confirmation email (mock data)...");
  
  const mockBooking = {
    _id: "TEST123456789",
    customerName: "John Doe",
    customerEmail: process.env.EMAIL_USER, // Send to yourself
    customerPhone: "081234567890",
    vehicleInfo: {
      brand: "Toyota",
      model: "Avanza",
      plateNumber: "B 1234 XYZ",
      year: "2020"
    },
    scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
    scheduledTime: "10:00",
    serviceLocation: "workshop",
    totalPrice: 500000,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    paymentMethod: "qris"
  };

  const result2 = await sendBookingConfirmationEmail(mockBooking);

  if (result2.success) {
    console.log("✅ Test 2 PASSED - Booking confirmation email sent successfully");
  } else {
    console.log("❌ Test 2 FAILED -", result2.error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 EMAIL SERVICE TEST COMPLETED");
  console.log("=".repeat(60));
  console.log("\n💡 Check your email inbox:", process.env.EMAIL_USER);
  console.log("You should receive 2 test emails.\n");
};

testEmailService();
