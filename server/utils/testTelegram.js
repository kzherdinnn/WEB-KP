import {
  sendTelegramMessage,
  sendAdminBookingNotification,
  sendAdminPaymentNotification,
  sendAdminStatusUpdateNotification,
} from "./telegramService.js";
import dotenv from "dotenv";

dotenv.config();

const testTelegramService = async () => {
  console.log("=".repeat(60));
  console.log("🧪 TESTING TELEGRAM BOT SERVICE");
  console.log("=".repeat(60));

  // Test 1: Simple message
  console.log("\n🤖 Test 1: Sending simple test message...");
  const result1 = await sendTelegramMessage(
    `🧪 *TEST MESSAGE*\n\n✅ Telegram Bot is working!\n\n_Sent at: ${new Date().toLocaleString("id-ID")}_`
  );

  if (result1.success) {
    console.log("✅ Test 1 PASSED - Simple message sent successfully");
  } else {
    console.log("❌ Test 1 FAILED -", result1.error);
  }

  // Wait 2 seconds before next test
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Booking notification (mock data)
  console.log("\n🤖 Test 2: Sending booking notification (mock data)...");

  const mockBooking = {
    _id: "TEST123456789",
    customerName: "John Doe",
    customerPhone: "081234567890",
    customerEmail: "john@example.com",
    vehicleInfo: {
      brand: "Toyota",
      model: "Avanza",
      plateNumber: "B 1234 XYZ",
      year: "2020",
    },
    scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
    scheduledTime: "10:00",
    serviceLocation: "workshop",
    totalPrice: 500000,
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    paymentMethod: "qris",
    bookingType: "sparepart_and_service",
    dpAmount: 0,
    remainingPayment: 0,
  };

  const result2 = await sendAdminBookingNotification(mockBooking);

  if (result2.success) {
    console.log("✅ Test 2 PASSED - Booking notification sent successfully");
  } else {
    console.log("❌ Test 2 FAILED -", result2.error);
  }

  // Wait 2 seconds before next test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 3: Payment notification
  console.log("\n🤖 Test 3: Sending payment notification (mock data)...");

  const result3 = await sendAdminPaymentNotification(mockBooking);

  if (result3.success) {
    console.log("✅ Test 3 PASSED - Payment notification sent successfully");
  } else {
    console.log("❌ Test 3 FAILED -", result3.error);
  }

  // Wait 2 seconds before next test
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Test 4: Status update notification
  console.log("\n🤖 Test 4: Sending status update notification (mock data)...");

  const mockBookingWithTechnician = {
    ...mockBooking,
    technician: {
      name: "Ahmad Teknisi",
      specialization: "Mesin & Transmisi",
    },
  };

  const result4 = await sendAdminStatusUpdateNotification(
    mockBookingWithTechnician,
    "in_progress"
  );

  if (result4.success) {
    console.log("✅ Test 4 PASSED - Status update notification sent successfully");
  } else {
    console.log("❌ Test 4 FAILED -", result4.error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 TELEGRAM BOT TEST COMPLETED");
  console.log("=".repeat(60));
  console.log("\n💡 Check your Telegram app");
  console.log("You should receive 4 test messages from your bot.\n");
};

testTelegramService();
