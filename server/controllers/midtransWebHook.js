import midtransClient from "midtrans-client";
import bookingModel from "../models/booking.models.js";
import dotenv from "dotenv";

dotenv.config();

// Inisialisasi Midtrans Notification Client
const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Handler webhook Midtrans
export const midtransWebHook = async (req, res) => {
  try {
    const notification = req.body;

    // Dapatkan status transaksi dari Midtrans
    const statusResponse = await core.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`📬 Webhook diterima dari Midtrans untuk Order ID: ${orderId}`);
    console.log(`Status transaksi: ${transactionStatus}`);

    // Ambil bookingId dari orderId (sesuai logika kamu)
    // Misal order_id = "BOOKING-<id>", kita bisa split
    const bookingId = orderId.replace("BOOKING-", "");

    // Logika update sesuai status
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      await bookingModel.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "Midtrans",
      });
      console.log(`✅ Booking ${bookingId} ditandai sebagai sudah dibayar.`);
    } else if (transactionStatus === "deny" || transactionStatus === "expire" || transactionStatus === "cancel") {
      await bookingModel.findByIdAndUpdate(bookingId, {
        isPaid: false,
        paymentMethod: "Midtrans",
      });
      console.log(`❌ Booking ${bookingId} gagal / dibatalkan.`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("🔥 Error saat memproses webhook Midtrans:", error);
    res.status(500).json({ message: "Server error" });
  }
};
