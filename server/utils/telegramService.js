import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Telegram Bot Service
 * Untuk mengirim notifikasi ke admin via Telegram
 */

let bot;

// Inisialisasi bot
if (process.env.TELEGRAM_BOT_TOKEN) {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
} else {
  console.warn("TELEGRAM_BOT_TOKEN tidak diset, Telegram notification dinonaktifkan");
}

/**
 * Fungsi generic untuk mengirim pesan Telegram ke admin
 * @param {string} message - Pesan yang akan dikirim (mendukung Markdown)
 */
export const sendTelegramMessage = async (message) => {
  try {
    if (!bot || !process.env.TELEGRAM_ADMIN_CHAT_ID) {
      console.warn("Telegram bot tidak dikonfigurasi, notifikasi dilewati");
      return { success: false, message: "Telegram not configured" };
    }

    console.log(`Mengirim Telegram ke admin...`);

    const result = await bot.sendMessage(
      process.env.TELEGRAM_ADMIN_CHAT_ID,
      message,
      { parse_mode: "Markdown" }
    );

    console.log(`Telegram berhasil dikirim ke admin`);
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error("Error mengirim Telegram:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Kirim notifikasi ke admin saat ada booking baru dan pembayaran berhasil
 */
export const sendAdminBookingNotification = async (booking, paymentDetailsObj = {}) => {
  // Format tanggal
  const bookingDate = new Date(booking.scheduledDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format service location
  let locationText = "";
  if (booking.serviceLocation === "onsite") {
    locationText = `*Lokasi*: Onsite\n*Alamat*: ${booking.onsiteAddress || "-"}`;
  } else {
    locationText = `*Lokasi*: Workshop`;
  }

  // Format services
  let servicesText = "";
  if (booking.services && booking.services.length > 0) {
    const servicesList = booking.services
      .map((s) => {
        const name = s.service?.name || "Service";
        const price = s.price || 0;
        return `  - ${name}: Rp${price.toLocaleString("id-ID")}`;
      })
      .join("\n");
    servicesText = `\n*LAYANAN SERVICE*\n${servicesList}`;
  }

  // Format spareparts
  let sparepartsText = "";
  if (booking.spareparts && booking.spareparts.length > 0) {
    const sparepartsList = booking.spareparts
      .map((sp) => {
        const name = sp.sparepart?.name || "Sparepart";
        const qty = sp.quantity || 0;
        const price = sp.price || 0;
        const total = qty * price;
        return `  - ${name} (${qty}x): Rp${total.toLocaleString("id-ID")}`;
      })
      .join("\n");
    sparepartsText = `\n*SPAREPARTS*\n${sparepartsList}`;
  }

  // Format payment details
  const subtotalServices = booking.subtotalServices || 0;
  const subtotalSpareparts = booking.subtotalSpareparts || 0;
  const taxAmount = booking.taxAmount || 0;
  const totalPrice = booking.totalPrice || 0;

  let paymentDetails = "";
  if (booking.paymentStatus === "paid") {
    paymentDetails = `*Status*: LUNAS`;
  } else if (booking.paymentStatus === "dp_paid") {
    paymentDetails = `*Status*: DOWN PAYMENT\n*DP*: Rp${booking.dpAmount?.toLocaleString("id-ID")}\n*Sisa*: Rp${booking.remainingPayment?.toLocaleString("id-ID")}`;
  }

  // Format detailed payment method
  let paymentMethodDetail = booking.paymentMethod.toUpperCase();
  if (paymentDetailsObj && paymentDetailsObj.paymentType) {
    if (paymentDetailsObj.paymentType === "bank_transfer" && paymentDetailsObj.bank) {
      paymentMethodDetail = `BANK TRANSFER - ${paymentDetailsObj.bank.toUpperCase()}`;
      if (paymentDetailsObj.vaNumber) paymentMethodDetail += `\nVA: \`${paymentDetailsObj.vaNumber}\``;
    } else if (paymentDetailsObj.paymentType === "cstore" && paymentDetailsObj.store) {
      paymentMethodDetail = `${paymentDetailsObj.store.toUpperCase()}`;
      if (paymentDetailsObj.paymentCode) paymentMethodDetail += `\nKode: \`${paymentDetailsObj.paymentCode}\``;
    } else if (paymentDetailsObj.paymentType === "qris") {
      paymentMethodDetail = "QRIS";
      if (paymentDetailsObj.issuer) paymentMethodDetail += ` (${paymentDetailsObj.issuer})`;
    } else if (paymentDetailsObj.paymentType === "echannel") {
      paymentMethodDetail = "MANDIRI BILL";
      if (paymentDetailsObj.billKey) paymentMethodDetail += `\nBill Key: \`${paymentDetailsObj.billKey}\``;
    }
  }

  const message = `
*NOTIFIKASI BOOKING BARU*

*INFORMASI CUSTOMER*
Nama: ${booking.customerName}
No. HP: ${booking.customerPhone}
Email: ${booking.customerEmail || "-"}

*DATA KENDARAAN*
Merek/Model: ${booking.vehicleInfo?.brand || ""} ${booking.vehicleInfo?.model || ""}
No. Plat: ${booking.vehicleInfo?.plateNumber || "-"}
Tahun: ${booking.vehicleInfo?.year || "-"}

*JADWAL SERVICE*
Tanggal: ${bookingDate}
Waktu: ${booking.scheduledTime}
${locationText}
${servicesText}
${sparepartsText}

*RINCIAN PEMBAYARAN*
Subtotal Service: Rp${subtotalServices.toLocaleString("id-ID")}
Subtotal Spareparts: Rp${subtotalSpareparts.toLocaleString("id-ID")}
Pajak (11%): Rp${taxAmount.toLocaleString("id-ID")}
*Total*: *Rp${totalPrice.toLocaleString("id-ID")}*

${paymentDetails}
Metode: ${paymentMethodDetail}

*ID Booking*: \`${booking._id}\`
Diterima: ${new Date().toLocaleString("id-ID")}

_Silakan akses dashboard admin untuk detail lengkap dan penugasan teknisi._
`.trim();

  return await sendTelegramMessage(message);
};

/**
 * Kirim notifikasi ke admin saat pembayaran berhasil
 */
export const sendAdminPaymentNotification = async (booking, paymentDetailsObj = {}) => {
  let paymentInfo = "";
  if (booking.paymentStatus === "paid") {
    paymentInfo = `*Status*: LUNAS\n*Total*: Rp${booking.totalPrice?.toLocaleString("id-ID")}`;
  } else if (booking.paymentStatus === "dp_paid") {
    paymentInfo = `*Status*: DOWN PAYMENT TERBAYAR\n*DP*: Rp${booking.dpAmount?.toLocaleString("id-ID")}\n*Sisa*: Rp${booking.remainingPayment?.toLocaleString("id-ID")}`;
  }

  // Format detailed payment method
  let paymentMethodDetail = booking.paymentMethod.toUpperCase();
  if (paymentDetailsObj && paymentDetailsObj.paymentType) {
    if (paymentDetailsObj.paymentType === "bank_transfer" && paymentDetailsObj.bank) {
      paymentMethodDetail = `BANK TRANSFER - ${paymentDetailsObj.bank.toUpperCase()}`;
      if (paymentDetailsObj.vaNumber) paymentMethodDetail += `\nVA: \`${paymentDetailsObj.vaNumber}\``;
    } else if (paymentDetailsObj.paymentType === "cstore" && paymentDetailsObj.store) {
      paymentMethodDetail = `${paymentDetailsObj.store.toUpperCase()}`;
      if (paymentDetailsObj.paymentCode) paymentMethodDetail += `\nKode: \`${paymentDetailsObj.paymentCode}\``;
    } else if (paymentDetailsObj.paymentType === "qris") {
      paymentMethodDetail = "QRIS";
      if (paymentDetailsObj.issuer) paymentMethodDetail += ` (${paymentDetailsObj.issuer})`;
    } else if (paymentDetailsObj.paymentType === "echannel") {
      paymentMethodDetail = "MANDIRI BILL";
      if (paymentDetailsObj.billKey) paymentMethodDetail += `\nBill Key: \`${paymentDetailsObj.billKey}\``;
    }
  }

  const message = `
*PEMBAYARAN DITERIMA*

*BOOKING INFO*
ID: \`${booking._id}\`
Customer: ${booking.customerName}
Phone: ${booking.customerPhone}

*PAYMENT*
${paymentInfo}
Metode: ${paymentMethodDetail}

Waktu: ${new Date().toLocaleString("id-ID")}
`.trim();

  return await sendTelegramMessage(message);
};

/**
 * Kirim notifikasi ke admin saat status booking berubah
 */
export const sendAdminStatusUpdateNotification = async (booking, newStatus) => {
  let statusText = newStatus.toUpperCase();
  
  switch (newStatus) {
    case "confirmed":
      statusText = "TERKONFIRMASI";
      break;
    case "in_progress":
      statusText = "SEDANG DIKERJAKAN";
      break;
    case "completed":
      statusText = "SELESAI";
      break;
    case "cancelled":
      statusText = "DIBATALKAN";
      break;
  }

  let technicianInfo = "";
  if (booking.technician && (newStatus === "confirmed" || newStatus === "in_progress")) {
    technicianInfo = `\n*Teknisi*: ${booking.technician.name || "-"}\n*Spesialisasi*: ${booking.technician.specialization || "-"}`;
  }

  const message = `
*UPDATE STATUS BOOKING*

*Status Baru*: *${statusText}*

*BOOKING INFO*
ID: \`${booking._id}\`
Customer: ${booking.customerName}
Phone: ${booking.customerPhone}${technicianInfo}

*Service*: ${new Date(booking.scheduledDate).toLocaleDateString("id-ID")} | ${booking.scheduledTime}

Waktu Update: ${new Date().toLocaleString("id-ID")}
`.trim();

  return await sendTelegramMessage(message);
};

export default {
  sendTelegramMessage,
  sendAdminBookingNotification,
  sendAdminPaymentNotification,
  sendAdminStatusUpdateNotification,
};
