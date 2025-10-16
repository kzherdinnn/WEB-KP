import midtransClient from "midtrans-client";
import bookingModel from "../models/booking.models.js";

// Buat instance Core API Midtrans untuk verifikasi notifikasi
const coreApi = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const midtransWebHook = async (req, res) => {
    try {
        // 1. Terima notifikasi dari Midtrans
        const notificationJson = req.body;

        // 2. Verifikasi notifikasi menggunakan utility dari Midtrans
        const statusResponse = await coreApi.transaction.notification(notificationJson);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`📬 Webhook diterima. Order ID: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

        // 3. Cari booking di database Anda langsung menggunakan orderId
        const booking = await bookingModel.findById(orderId);
        if (!booking) {
            // Jika booking tidak ditemukan, mungkin sudah dihapus atau ID salah.
            // Tetap kirim 200 OK agar Midtrans tidak mengirim ulang.
            console.warn(`Webhook diterima untuk booking yang tidak ditemukan. Order ID: ${orderId}`);
            return res.status(200).json({ success: true, message: "Booking tidak ditemukan, notifikasi diabaikan." });
        }

        // 4. Update status booking berdasarkan notifikasi
        let newPaymentStatus = booking.paymentStatus;

        if (transactionStatus == 'settlement') {
            // Jika transaksi berhasil dan tidak dianggap fraud
            if (fraudStatus == 'accept') {
                newPaymentStatus = 'paid'; // ✅ PERBAIKAN: Update field 'paymentStatus' menjadi 'paid'
            }
        } else if (transactionStatus == 'cancel' || transactionStatus == 'expire' || transactionStatus == 'deny') {
            newPaymentStatus = 'cancelled'; // ✅ PERBAIKAN: Update field 'paymentStatus' menjadi 'cancelled'
        }
        // Untuk status 'pending', kita biarkan saja karena status awal sudah 'pending'.

        // Hanya update jika ada perubahan status
        if (newPaymentStatus !== booking.paymentStatus) {
            booking.paymentStatus = newPaymentStatus;
            await booking.save();
            console.log(`✅ Status untuk Booking ID: ${orderId} berhasil diperbarui menjadi '${newPaymentStatus}'.`);
        }

        // 5. Kirim respons 200 OK ke Midtrans untuk mengonfirmasi penerimaan
        res.status(200).json({ success: true, message: "Webhook berhasil diproses." });

    } catch (error) {
        console.error("🔥 Error pada Midtrans Webhook:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan internal pada webhook." });
    }
};