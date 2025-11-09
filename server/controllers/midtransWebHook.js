import midtransClient from "midtrans-client";
import bookingModel from "../models/booking.models.js";
import roomModel from "../models/room.models.js";

// Buat instance Core API Midtrans untuk verifikasi notifikasi
const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const midtransWebHook = async (req, res) => {
  try {
    console.log("=".repeat(60));
    console.log("🔔 WEBHOOK MIDTRANS DITERIMA");
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

    console.log(`📬 Webhook Details:`);
    console.log(`   - Order ID: ${orderId}`);
    console.log(`   - Transaction Status: ${transactionStatus}`);
    console.log(`   - Fraud Status: ${fraudStatus}`);

    // 3. Extract booking ID asli (hapus timestamp suffix jika ada)
    // Format: bookingId-timestamp atau hanya bookingId
    const bookingId = orderId.includes("-") ? orderId.split("-")[0] : orderId;

    console.log(`🔍 Extracted Booking ID: ${bookingId}`);

    // 4. Cari booking di database menggunakan bookingId yang sudah di-extract
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
    console.log(`   - User: ${booking.user}`);
    console.log(`   - Status Saat Ini: ${booking.paymentStatus}`);
    console.log(`   - Total Price: Rp${booking.totalPrice}`);

    // 5. Update status booking berdasarkan notifikasi
    let newPaymentStatus = booking.paymentStatus;

    if (transactionStatus == "settlement") {
      // Jika transaksi berhasil dan tidak dianggap fraud
      if (fraudStatus == "accept") {
        newPaymentStatus = "paid";
        console.log(`✅ Status akan diupdate menjadi: PAID`);
      }
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "expire" ||
      transactionStatus == "deny"
    ) {
      newPaymentStatus = "cancelled";
      console.log(`❌ Status akan diupdate menjadi: CANCELLED`);
    } else if (transactionStatus == "pending") {
      newPaymentStatus = "pending";
      console.log(`⏳ Status tetap: PENDING`);
    }

    // Hanya update jika ada perubahan status
    if (newPaymentStatus !== booking.paymentStatus) {
      console.log(
        `🔄 Melakukan update status dari '${booking.paymentStatus}' ke '${newPaymentStatus}'...`,
      );

      booking.paymentStatus = newPaymentStatus;
      await booking.save();

      console.log(
        `✅ Status untuk Booking ID: ${bookingId} berhasil diperbarui menjadi '${newPaymentStatus}'`,
      );

      // 🔄 Kembalikan availableRooms jika pembayaran dibatalkan/expired
      if (newPaymentStatus === "cancelled") {
        const roomData = await roomModel.findById(booking.room);
        if (roomData) {
          const roomsToRestore = booking.numberOfRooms || 1;
          roomData.availableRooms = Math.min(
            roomData.availableRooms + roomsToRestore,
            roomData.totalRooms,
          );
          await roomData.save();
          console.log(
            `🔓 Room ${roomData._id} availableRooms dikembalikan +${roomsToRestore}: ${roomData.availableRooms}/${roomData.totalRooms}`,
          );
        }
      }

      // Verifikasi update berhasil
      const updatedBooking = await bookingModel.findById(bookingId);
      console.log(
        `✔️ Verifikasi: Status di database sekarang adalah '${updatedBooking.paymentStatus}'`,
      );
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
