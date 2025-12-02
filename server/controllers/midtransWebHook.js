import midtransClient from "midtrans-client";
import bookingModel from "../models/booking.models.js";
import {
  sendAdminBookingNotification,
  sendCustomerPaymentConfirmation,
} from "../utils/whatsappService.js";

// Buat instance Core API Midtrans untuk verifikasi notifikasi
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const midtransWebHook = async (req, res) => {
  try {
    console.log("=".repeat(60));
    console.log("🔔 WEBHOOK MIDTRANS DITERIMA (WORKSHOP BOOKING)");
    console.log("=".repeat(60));

    // 1. Terima notifikasi dari Midtrans
    const notificationJson = req.body;
    console.log(
      "📥 Raw notification:",
      JSON.stringify(notificationJson, null, 2),
    );

    // 2. Verifikasi notifikasi menggunakan utility dari Midtrans
    const statusResponse =
      await coreApi.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const transactionId = statusResponse.transaction_id;

    console.log(`📬 Webhook Details:`);
    console.log(`   - Order ID: ${orderId}`);
    console.log(`   - Transaction ID: ${transactionId}`);
    console.log(`   - Transaction Status: ${transactionStatus}`);
    console.log(`   - Fraud Status: ${fraudStatus}`);

    // 3. Extract booking ID dari order ID
    // Format: BOOKING-{bookingId}-{timestamp}
    const bookingIdMatch = orderId.match(/BOOKING-([a-f0-9]+)-/);
    const bookingId = bookingIdMatch ? bookingIdMatch[1] : orderId.split("-")[1];

    console.log(`🔍 Extracted Booking ID: ${bookingId}`);

    // 4. Cari booking di database
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      console.warn(`⚠️ Booking tidak ditemukan untuk Order ID: ${orderId}`);
      return res.status(200).json({
        success: true,
        message: "Booking tidak ditemukan, notifikasi diabaikan.",
      });
    }

    console.log(`📦 Booking ditemukan:`);
    console.log(`   - Booking ID: ${booking._id}`);
    console.log(`   - Customer: ${booking.customerName}`);
    console.log(`   - Payment Status: ${booking.paymentStatus}`);
    console.log(`   - Total Price: Rp${booking.totalPrice}`);
    console.log(`   - DP Amount: Rp${booking.dpAmount}`);

    // 5. Update status booking berdasarkan notifikasi
    let newPaymentStatus = booking.paymentStatus;
    let updateData = {
      midtransTransactionId: transactionId,
      midtransOrderId: orderId,
    };

    if (transactionStatus == "settlement" || transactionStatus == "capture") {
      // Jika transaksi berhasil dan tidak dianggap fraud
      if (fraudStatus == "accept") {
        // Check if this is DP or full payment
        if (booking.dpAmount > 0 && booking.remainingPayment > 0) {
          newPaymentStatus = "dp_paid";
          console.log(`✅ Status akan diupdate menjadi: DP_PAID`);
        } else {
          newPaymentStatus = "paid";
          console.log(`✅ Status akan diupdate menjadi: PAID`);
        }
        updateData.paidAt = new Date();
        updateData.bookingStatus = "confirmed"; // Auto confirm when paid
      }
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "expire" ||
      transactionStatus == "deny"
    ) {
      newPaymentStatus = "failed";
      console.log(`❌ Status akan diupdate menjadi: FAILED`);
    } else if (transactionStatus == "pending") {
      newPaymentStatus = "pending";
      console.log(`⏳ Status tetap: PENDING`);
    }

    // Hanya update jika ada perubahan status
    if (newPaymentStatus !== booking.paymentStatus) {
      console.log(
        `🔄 Melakukan update status dari '${booking.paymentStatus}' ke '${newPaymentStatus}'...`,
      );

      updateData.paymentStatus = newPaymentStatus;
      
      Object.keys(updateData).forEach(key => {
        booking[key] = updateData[key];
      });
      
      await booking.save();

      console.log(
        `✅ Status untuk Booking ID: ${bookingId} berhasil diperbarui menjadi '${newPaymentStatus}'`,
      );

      // Verifikasi update berhasil
      const updatedBooking = await bookingModel.findById(bookingId);
      console.log(
        `✔️ Verifikasi: Status di database sekarang adalah '${updatedBooking.paymentStatus}'`,
      );

      // ===== SEND WHATSAPP NOTIFICATIONS =====
      if (newPaymentStatus === "paid" || newPaymentStatus === "dp_paid") {
        console.log("📱 Mengirim notifikasi WhatsApp...");
        
        // Populate booking dengan data lengkap untuk notifikasi
        const populatedBooking = await bookingModel
          .findById(bookingId)
          .populate("spareparts.sparepart services.service");

        // Kirim notifikasi ke admin
        try {
          await sendAdminBookingNotification(populatedBooking);
          console.log("✅ Notifikasi WhatsApp ke admin berhasil dikirim");
        } catch (error) {
          console.error("❌ Error mengirim notifikasi ke admin:", error.message);
        }

        // Kirim notifikasi ke customer
        try {
          await sendCustomerPaymentConfirmation(populatedBooking);
          console.log("✅ Notifikasi WhatsApp ke customer berhasil dikirim");
        } catch (error) {
          console.error("❌ Error mengirim notifikasi ke customer:", error.message);
        }
      }
    } else {
      console.log(`ℹ️ Status tidak berubah, tetap '${booking.paymentStatus}'`);
    }

    console.log("=".repeat(60));
    console.log("✅ WEBHOOK BERHASIL DIPROSES");
    console.log("=".repeat(60));

    // 6. Kirim respons 200 OK ke Midtrans untuk mengonfirmasi penerimaan
    res.status(200).json({
      success: true,
      message: "Webhook berhasil diproses.",
      orderId: orderId,
      bookingId: bookingId,
      newStatus: newPaymentStatus,
    });
  } catch (error) {
    console.error("=".repeat(60));
    console.error("🔥 ERROR PADA MIDTRANS WEBHOOK");
    console.error("=".repeat(60));
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan internal pada webhook.",
    });
  }
};
