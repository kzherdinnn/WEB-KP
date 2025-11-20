/**
 * Utility Script untuk Set User menjadi Admin
 *
 * Cara penggunaan:
 * 1. Pastikan MongoDB sudah running
 * 2. Jalankan: node utils/setAdmin.js <USER_CLERK_ID>
 *
 * Contoh:
 * node utils/setAdmin.js user_34wL072XeDUAgscwq6KLs9R8MAO
 */

import mongoose from "mongoose";
import userModel from "../models/user.models.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const setUserAsAdmin = async (userId) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Validasi input
    if (!userId) {
      console.error("❌ Error: User ID tidak diberikan!");
      console.log("\nCara penggunaan:");
      console.log("node utils/setAdmin.js <USER_CLERK_ID>");
      console.log("\nContoh:");
      console.log("node utils/setAdmin.js user_34wL072XeDUAgscwq6KLs9R8MAO");
      process.exit(1);
    }

    // Cari user berdasarkan ID
    const user = await userModel.findById(userId);

    if (!user) {
      console.error(`❌ User dengan ID "${userId}" tidak ditemukan di database!`);
      console.log("\n💡 Tips:");
      console.log("1. Pastikan user sudah login minimal sekali (agar ter-sync dari Clerk)");
      console.log("2. Cek ID user di MongoDB Compass atau collection 'users'");
      console.log("3. Format ID harus seperti: user_xxxxxxxxxxxxx");
      process.exit(1);
    }

    // Cek apakah sudah admin
    if (user.role === "admin") {
      console.log(`⚠️  User "${user.username}" (${user.email}) sudah menjadi Admin!`);
      process.exit(0);
    }

    // Update role menjadi admin
    user.role = "admin";
    await user.save();

    console.log("\n🎉 SUCCESS! User berhasil dijadikan Admin!");
    console.log("━".repeat(50));
    console.log(`👤 Username: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 User ID: ${user._id}`);
    console.log(`👨‍💼 Role: ${user.role}`);
    console.log("━".repeat(50));
    console.log("\n✅ User sekarang bisa:");
    console.log("  - Mendaftarkan bengkel");
    console.log("  - Mengelola kamar bengkel");
    console.log("  - Akses Admin Dashboard");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Ambil user ID dari command line arguments
const userId = process.argv[2];

// Jalankan fungsi
setUserAsAdmin(userId);
