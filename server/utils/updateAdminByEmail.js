/**
 * Script untuk Update User yang Sudah Ada Menjadi Admin Berdasarkan Email
 *
 * Cara penggunaan:
 * node utils/updateAdminByEmail.js
 */

import mongoose from "mongoose";
import userModel from "../models/user.models.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const updateAdminByEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Ambil ADMIN_EMAILS dari .env
    const adminEmailsStr = process.env.ADMIN_EMAILS;

    if (!adminEmailsStr) {
      console.error("❌ Error: ADMIN_EMAILS tidak ditemukan di file .env!");
      console.log("\n💡 Tambahkan ke .env:");
      console.log("ADMIN_EMAILS=your.email@gmail.com");
      process.exit(1);
    }

    // Parse email list
    const adminEmails = adminEmailsStr
      .split(",")
      .map((email) => email.trim().toLowerCase());

    console.log("\n📋 Email Admin yang akan diproses:");
    adminEmails.forEach((email, index) => {
      console.log(`   ${index + 1}. ${email}`);
    });
    console.log("━".repeat(60));

    let successCount = 0;
    let notFoundCount = 0;
    let alreadyAdminCount = 0;

    // Update setiap email
    for (const email of adminEmails) {
      const user = await userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, 'i') }
      });

      if (!user) {
        console.log(`❌ User dengan email "${email}" tidak ditemukan di database`);
        notFoundCount++;
        continue;
      }

      if (user.role === "admin") {
        console.log(`⚠️  User "${user.username}" (${email}) sudah menjadi Admin`);
        alreadyAdminCount++;
        continue;
      }

      // Update role menjadi admin
      user.role = "admin";
      await user.save();

      console.log(`✅ User "${user.username}" (${email}) berhasil dijadikan Admin!`);
      successCount++;
    }

    // Summary
    console.log("\n" + "═".repeat(60));
    console.log("📊 SUMMARY");
    console.log("═".repeat(60));
    console.log(`✅ Berhasil diupdate    : ${successCount}`);
    console.log(`⚠️  Sudah admin         : ${alreadyAdminCount}`);
    console.log(`❌ Tidak ditemukan     : ${notFoundCount}`);
    console.log(`📧 Total email diproses: ${adminEmails.length}`);
    console.log("═".repeat(60));

    if (notFoundCount > 0) {
      console.log("\n💡 Tips untuk email yang tidak ditemukan:");
      console.log("   1. Pastikan user sudah login minimal 1x (agar ter-sync dari Clerk)");
      console.log("   2. Cek ejaan email di file .env");
      console.log("   3. Email HARUS sama persis dengan yang digunakan di Clerk");
    }

    if (successCount > 0) {
      console.log("\n🎉 User yang berhasil diupdate sekarang bisa:");
      console.log("   - Mendaftarkan bengkel");
      console.log("   - Mengelola kamar bengkel");
      console.log("   - Akses Admin Dashboard");
      console.log("\n⚠️  User perlu LOGOUT dan LOGIN ULANG agar perubahan berlaku!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Jalankan fungsi
updateAdminByEmail();
