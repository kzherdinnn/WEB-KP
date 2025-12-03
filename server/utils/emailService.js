import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Email Service menggunakan Gmail SMTP
 * Untuk mengirim notifikasi ke customer
 */

// Konfigurasi transporter Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * Fungsi generic untuk mengirim email
 * @param {string} to - Email tujuan
 * @param {string} subject - Subject email
 * @param {string} html - HTML content email
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Skip jika email tidak dikonfigurasi
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn("Email configuration tidak diset, email notification dilewati");
      return { success: false, message: "Email not configured" };
    }

    console.log(`Mengirim email ke: ${to}`);

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Workshop Booking System"}" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log(`Email berhasil dikirim ke ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error mengirim email:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Kirim email konfirmasi pembayaran ke customer
 */
export const sendBookingConfirmationEmail = async (booking) => {
  const customerEmail = booking.customerEmail;

  if (!customerEmail) {
    console.warn("Customer email tidak tersedia");
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

  // Format payment info
  let paymentInfo = "";
  if (isPaid) {
    paymentInfo = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Total Dibayar</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Rp${booking.totalPrice?.toLocaleString("id-ID")}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Status Pembayaran</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="color: #10b981; font-weight: bold;">LUNAS</span></td>
      </tr>
    `;
  } else if (isDpPaid) {
    paymentInfo = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>DP Dibayar</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Rp${booking.dpAmount?.toLocaleString("id-ID")}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Sisa Pembayaran</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Rp${booking.remainingPayment?.toLocaleString("id-ID")}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Status Pembayaran</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="color: #f59e0b; font-weight: bold;">DOWN PAYMENT TERBAYAR</span></td>
      </tr>
    `;
  }

  // Format service location with address
  let locationInfo = "";
  if (booking.serviceLocation === "onsite") {
    locationInfo = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Lokasi Service</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Onsite</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Alamat Onsite</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.onsiteAddress || "-"}</td>
      </tr>
    `;
  } else {
    locationInfo = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Lokasi Service</strong></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Workshop</td>
      </tr>
    `;
  }

  // Format services list
  let servicesHtml = "";
  if (booking.services && booking.services.length > 0) {
    const servicesList = booking.services
      .map((s) => {
        const serviceName = s.service?.name || "Service";
        const servicePrice = s.price || 0;
        return `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${serviceName} <span style="float: right; font-weight: bold;">Rp${servicePrice.toLocaleString("id-ID")}</span></li>`;
      })
      .join("");
    
    servicesHtml = `
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Detail Layanan Service</h3>
        <ul style="margin: 0; padding: 0; list-style: none; color: #374151;">
          ${servicesList}
        </ul>
      </div>
    `;
  }

  // Format spareparts list
  let sparepartsHtml = "";
  if (booking.spareparts && booking.spareparts.length > 0) {
    const sparepartsList = booking.spareparts
      .map((sp) => {
        const partName = sp.sparepart?.name || "Sparepart";
        const partQty = sp.quantity || 0;
        const partPrice = sp.price || 0;
        const partTotal = partQty * partPrice;
        return `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${partName} <span style="color: #6b7280;">(${partQty} unit)</span><span style="float: right; font-weight: bold;">Rp${partTotal.toLocaleString("id-ID")}</span></li>`;
      })
      .join("");
    
    sparepartsHtml = `
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Detail Spareparts</h3>
        <ul style="margin: 0; padding: 0; list-style: none; color: #374151;">
          ${sparepartsList}
        </ul>
      </div>
    `;
  }

  // Format price breakdown
  const subtotalServices = booking.subtotalServices || 0;
  const subtotalSpareparts = booking.subtotalSpareparts || 0;
  const taxAmount = booking.taxAmount || 0;
  const totalPrice = booking.totalPrice || 0;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konfirmasi Pembayaran</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">KONFIRMASI PEMBAYARAN BERHASIL</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 14px; color: #374151; margin-bottom: 5px;">
        Kepada Yth.
      </p>
      <p style="font-size: 16px; color: #1f2937; margin-top: 0; margin-bottom: 20px; font-weight: 600;">
        ${booking.customerName}
      </p>
      
      <p style="font-size: 14px; color: #374151; margin-bottom: 30px; line-height: 1.6;">
        Terima kasih atas pembayaran Anda. Booking service kendaraan Anda telah berhasil dikonfirmasi. Berikut adalah detail lengkap pesanan Anda:
      </p>

      <!-- Booking Info -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Informasi Booking</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; "><strong>ID Booking</strong></td>
            <td style="padding: 8px 0; ">${booking._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tanggal Booking</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(booking.createdAt || Date.now()).toLocaleDateString("id-ID")}</td>
          </tr>
        </table>
      </div>

      <!-- Vehicle Info -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Informasi Kendaraan</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Merek/Model</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.vehicleInfo?.brand || ""} ${booking.vehicleInfo?.model || ""}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Nomor Plat</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.vehicleInfo?.plateNumber || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Tahun</strong></td>
            <td style="padding: 8px 0;">${booking.vehicleInfo?.year || "-"}</td>
          </tr>
        </table>
      </div>

      <!-- Schedule -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Jadwal Service</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tanggal</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${bookingDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Waktu</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking.scheduledTime}</td>
          </tr>
          ${locationInfo}
        </table>
      </div>

      <!-- Services List -->
      ${servicesHtml}

      <!-- Spareparts List -->
      ${sparepartsHtml}

      <!-- Payment Summary -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Rincian Pembayaran</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Subtotal Layanan Service</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">Rp${subtotalServices.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Subtotal Spareparts</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">Rp${subtotalSpareparts.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">Pajak (PPN 11%)</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">Rp${taxAmount.toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 15px 0; border-top: 2px solid #667eea;"><strong style="font-size: 16px;">TOTAL</strong></td>
            <td style="padding: 15px 0; border-top: 2px solid #667eea; text-align: right;"><strong style="font-size: 18px; color: #667eea;">Rp${totalPrice.toLocaleString("id-ID")}</strong></td>
          </tr>
          ${paymentInfo}
        </table>
      </div>

      ${isDpPaid ? `
      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
          <strong>Catatan:</strong> Sisa pembayaran dapat dilakukan setelah service selesai.
        </p>
      </div>
      ` : ""}

      <p style="font-size: 13px; color: #374151; margin-bottom: 10px; line-height: 1.6;">
        Tim kami akan menghubungi Anda untuk konfirmasi lebih lanjut mengenai jadwal service.
      </p>

      <p style="font-size: 13px; color: #374151; margin-top: 25px; margin-bottom: 5px;">
        Hormat kami,
      </p>
      <p style="font-size: 14px; color: #1f2937; margin-top: 0; font-weight: 600;">
        Workshop Booking System
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.5;">
        Email ini dikirim secara otomatis, mohon tidak membalas email ini.<br>
        &copy; 2024 Workshop Booking System. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const subject = `Konfirmasi Pembayaran - Booking #${booking._id}`;
  return await sendEmail(customerEmail, subject, html);
};

/**
 * Kirim email update status booking ke customer
 */
export const sendBookingStatusUpdateEmail = async (booking, newStatus) => {
  const customerEmail = booking.customerEmail;

  if (!customerEmail) {
    console.warn("Customer email tidak tersedia");
    return;
  }

  let statusMessage = "";
  let statusDescription = "";
  let statusColor = "#3b82f6";

  switch (newStatus) {
    case "confirmed":
      statusDescription = "TERKONFIRMASI";
      statusMessage = "Booking Anda telah dikonfirmasi dan siap untuk diproses.";
      statusColor = "#3b82f6";
      break;
    case "in_progress":
      statusDescription = "SEDANG DIKERJAKAN";
      statusMessage = "Service kendaraan Anda saat ini sedang dalam proses pengerjaan oleh teknisi kami.";
      statusColor = "#f59e0b";
      break;
    case "completed":
      statusDescription = "SELESAI";
      statusMessage = "Service kendaraan Anda telah selesai dikerjakan.";
      statusColor = "#10b981";
      break;
    case "cancelled":
      statusDescription = "DIBATALKAN";
      statusMessage = "Booking Anda telah dibatalkan.";
      statusColor = "#ef4444";
      break;
    default:
      statusDescription = newStatus.toUpperCase();
      statusMessage = `Status booking Anda telah diperbarui menjadi ${newStatus}.`;
  }

  let technicianInfo = "";
  if (booking.technician && (newStatus === "confirmed" || newStatus === "in_progress")) {
    technicianInfo = `
      <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Teknisi yang Ditugaskan</h3>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 5px 0;"><strong>Nama</strong></td>
            <td style="padding: 5px 0;">${booking.technician.name || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Spesialisasi</strong></td>
            <td style="padding: 5px 0;">${booking.technician.specialization || "-"}</td>
          </tr>
        </table>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Status Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">UPDATE STATUS BOOKING</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 14px; color: #374151; margin-bottom: 5px;">
        Kepada Yth.
      </p>
      <p style="font-size: 16px; color: #1f2937; margin-top: 0; margin-bottom: 20px; font-weight: 600;">
        ${booking.customerName}
      </p>
      
      <p style="font-size: 14px; color: #374151; margin-bottom: 25px; line-height: 1.6;">
        ${statusMessage}
      </p>

      <!-- Status Badge -->
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="display: inline-block; background-color: ${statusColor}; color: #ffffff; padding: 10px 25px; border-radius: 20px; font-weight: 600; font-size: 16px;">
          ${statusDescription}
        </span>
      </div>

      ${technicianInfo}

      <!-- Booking Details -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1f2937; font-size: 16px; margin-top: 0; margin-bottom: 15px; font-weight: 600;">Detail Booking</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ID Booking</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${booking._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Tanggal Service</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(booking.scheduledDate).toLocaleDateString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Waktu</strong></td>
            <td style="padding: 8px 0;">${booking.scheduledTime}</td>
          </tr>
        </table>
      </div>

      ${newStatus === "completed" ? `
      <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #065f46; font-size: 13px; line-height: 1.5;">
          Terima kasih atas kepercayaan Anda menggunakan layanan kami. Semoga kendaraan Anda selalu dalam kondisi prima.
        </p>
      </div>
      ` : ""}

      <p style="font-size: 13px; color: #374151; margin-top: 25px; margin-bottom: 5px;">
        Hormat kami,
      </p>
      <p style="font-size: 14px; color: #1f2937; margin-top: 0; font-weight: 600;">
        Workshop Booking System
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #6b7280; font-size: 11px;">
        &copy; 2024 Workshop Booking System
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const subject = `Update Status Booking - ${statusDescription}`;
  return await sendEmail(customerEmail, subject, html);
};

export default {
  sendEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
};
