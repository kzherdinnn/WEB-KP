import axios from "axios";

/**
 * WhatsApp Service menggunakan Fonnte API
 * Dokumentasi: https://fonnte.com/api
 */

const FONNTE_API_URL = "https://api.fonnte.com/send";

/**
 * Kirim pesan WhatsApp
 * @param {string} phoneNumber - Nomor WhatsApp tujuan (format: 628xxx)
 * @param {string} message - Pesan yang akan dikirim
 * @returns {Promise<Object>} Response dari API
 */
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Skip jika API token tidak diset
    if (!process.env.FONNTE_API_TOKEN) {
      console.warn("⚠️ FONNTE_API_TOKEN tidak diset, WhatsApp notification dilewati");
      return { success: false, message: "API token not configured" };
    }

    // Format nomor telepon (hapus +, spasi, dan karakter non-digit)
    const formattedPhone = phoneNumber.replace(/[^0-9]/g, "");
    
    // Pastikan nomor dimulai dengan 62 (Indonesia)
    const finalPhone = formattedPhone.startsWith("62") 
      ? formattedPhone 
      : `62${formattedPhone.startsWith("0") ? formattedPhone.substring(1) : formattedPhone}`;

    console.log(`📱 Mengirim WhatsApp ke: ${finalPhone}`);

    const response = await axios.post(
      FONNTE_API_URL,
      {
        target: finalPhone,
        message: message,
        countryCode: "62", // Indonesia
      },
      {
        headers: {
          Authorization: process.env.FONNTE_API_TOKEN,
        },
      }
    );

    console.log(`✅ WhatsApp berhasil dikirim ke ${finalPhone}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error mengirim WhatsApp:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Kirim notifikasi ke admin saat ada booking baru dan pembayaran berhasil
 */
export const sendAdminBookingNotification = async (booking) => {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  
  if (!adminPhone) {
    console.warn("⚠️ ADMIN_WHATSAPP_NUMBER tidak diset");
    return;
  }

  // Format tanggal
  const bookingDate = new Date(booking.scheduledDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const message = `
*NOTIFIKASI BOOKING BARU*

DETAIL BOOKING
ID Booking: ${booking._id}
Nama Customer: ${booking.customerName}
No. HP: ${booking.customerPhone}
Email: ${booking.customerEmail || "-"}

DATA KENDARAAN
Merek/Model: ${booking.vehicleInfo?.brand || ""} ${booking.vehicleInfo?.model || ""}
No. Plat: ${booking.vehicleInfo?.plateNumber || "-"}
Tahun: ${booking.vehicleInfo?.year || "-"}

JADWAL SERVICE
Tanggal: ${bookingDate}
Waktu: ${booking.scheduledTime}
Lokasi: ${booking.serviceLocation === "onsite" ? "Onsite - " + booking.onsiteAddress : "Workshop"}

INFORMASI PEMBAYARAN
Total: Rp${booking.totalPrice?.toLocaleString("id-ID")}
Status: ${booking.paymentStatus === "paid" ? "LUNAS" : "DP TERBAYAR - Rp" + booking.dpAmount?.toLocaleString("id-ID")}
Metode: ${booking.paymentMethod.toUpperCase()}
Tipe: ${booking.bookingType.replace(/_/g, " ").toUpperCase()}

Waktu Diterima: ${new Date().toLocaleString("id-ID")}

---
Silakan akses dashboard admin untuk detail lengkap dan penugasan teknisi.
`.trim();

  return await sendWhatsAppMessage(adminPhone, message);
};

/**
 * Kirim notifikasi ke customer saat pembayaran berhasil
 */
export const sendCustomerPaymentConfirmation = async (booking) => {
  const customerPhone = booking.customerPhone;
  
  if (!customerPhone) {
    console.warn("⚠️ Customer phone number tidak tersedia");
    return;
  }

  const bookingDate = new Date(booking.scheduledDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPaid = booking.paymentStatus === "paid";
  const isDpPaid = booking.paymentStatus === "dp_paid";

  let paymentInfo = "";
  if (isPaid) {
    paymentInfo = `Total Dibayar: Rp${booking.totalPrice?.toLocaleString("id-ID")}
Status Pembayaran: LUNAS`;
  } else if (isDpPaid) {
    paymentInfo = `DP Dibayar: Rp${booking.dpAmount?.toLocaleString("id-ID")}
Sisa Pembayaran: Rp${booking.remainingPayment?.toLocaleString("id-ID")}
Status Pembayaran: DOWN PAYMENT TERBAYAR`;
  }

  const message = `
Yth. *${booking.customerName}*,

*KONFIRMASI PEMBAYARAN BERHASIL*

Terima kasih atas pembayaran Anda. Booking service kendaraan Anda telah berhasil dikonfirmasi.

DETAIL BOOKING
ID Booking: ${booking._id}

INFORMASI KENDARAAN
${booking.vehicleInfo?.brand || ""} ${booking.vehicleInfo?.model || ""}
No. Plat: ${booking.vehicleInfo?.plateNumber || "-"}

JADWAL SERVICE
Tanggal: ${bookingDate}
Waktu: ${booking.scheduledTime}
Lokasi: ${booking.serviceLocation === "onsite" ? "Onsite" : "Workshop"}

INFORMASI PEMBAYARAN
${paymentInfo}

Status Booking: ${booking.bookingStatus === "confirmed" ? "Terkonfirmasi" : "Menunggu Konfirmasi"}

${isDpPaid ? "CATATAN:\nSisa pembayaran dapat dilakukan setelah service selesai.\n" : ""}Tim kami akan menghubungi Anda untuk konfirmasi lebih lanjut.

---
Terima kasih atas kepercayaan Anda.
Workshop Booking System
`.trim();

  return await sendWhatsAppMessage(customerPhone, message);
};

/**
 * Kirim notifikasi ke customer saat booking status berubah
 */
export const sendCustomerBookingStatusUpdate = async (booking, newStatus) => {
  const customerPhone = booking.customerPhone;
  
  if (!customerPhone) {
    console.warn("⚠️ Customer phone number tidak tersedia");
    return;
  }

  let statusMessage = "";
  let statusDescription = "";

  switch (newStatus) {
    case "confirmed":
      statusDescription = "TERKONFIRMASI";
      statusMessage = "Booking Anda telah dikonfirmasi dan siap untuk diproses.";
      break;
    case "in_progress":
      statusDescription = "SEDANG DIKERJAKAN";
      statusMessage = "Service kendaraan Anda saat ini sedang dalam proses pengerjaan oleh teknisi kami.";
      break;
    case "completed":
      statusDescription = "SELESAI";
      statusMessage = "Service kendaraan Anda telah selesai dikerjakan.";
      break;
    case "cancelled":
      statusDescription = "DIBATALKAN";
      statusMessage = "Booking Anda telah dibatalkan.";
      break;
    default:
      statusDescription = newStatus.toUpperCase();
      statusMessage = `Status booking Anda telah diperbarui menjadi ${newStatus}.`;
  }

  const message = `
Yth. *${booking.customerName}*,

*UPDATE STATUS BOOKING*

${statusMessage}

DETAIL BOOKING
ID Booking: ${booking._id}
Status: ${statusDescription}

JADWAL SERVICE
Tanggal: ${new Date(booking.scheduledDate).toLocaleDateString("id-ID")}
Waktu: ${booking.scheduledTime}

${newStatus === "completed" ? "---\nTerima kasih atas kepercayaan Anda menggunakan layanan kami.\nSemoga kendaraan Anda selalu dalam kondisi prima.\n" : ""}
Workshop Booking System
`.trim();

  return await sendWhatsAppMessage(customerPhone, message);
};

export default {
  sendWhatsAppMessage,
  sendAdminBookingNotification,
  sendCustomerPaymentConfirmation,
  sendCustomerBookingStatusUpdate,
};
