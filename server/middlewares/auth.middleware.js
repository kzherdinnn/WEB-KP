import userModel from "../models/user.models.js";

export const protectedRoute = async (req, res, next) => {
  try {
    console.log(`\n🔐 Auth Middleware - ${req.method} ${req.path}`);
    console.log(`   req.auth:`, req.auth ? "✅ Ada" : "❌ Tidak ada");
    console.log(`   req.auth.userId:`, req.auth?.userId || "undefined");
    
    // Middleware Clerk (`ClerkExpressWithAuth`) sudah memvalidasi token
    // dan memastikan `req.auth` serta `req.auth.userId` ada.
    if (!req.auth || !req.auth.userId) {
      console.log(`   ❌ Tidak authenticated!`);
      return res.status(401).json({
        success: false,
        message: "Tidak Terotentikasi. ID Pengguna tidak ditemukan setelah verifikasi.",
      });
    }

    // Model User Anda menyimpan ID Clerk (`user_...`) langsung di field `_id` sebagai String.
    // Oleh karena itu, kita gunakan `findById` untuk mencari pengguna yang cocok di database Anda.
    let user = await userModel.findById(req.auth.userId);

    // Jika user tidak ada di database, buat otomatis
    if (!user) {
      console.log(`   ⚠️ User ${req.auth.userId} tidak ditemukan, membuat otomatis...`);
      const newUserData = {
        _id: req.auth.userId,
        email: req.auth.sessionClaims?.email || "unknown@email.com",
        username: req.auth.sessionClaims?.username || "User " + req.auth.userId.slice(-8),
        image: req.auth.sessionClaims?.image_url || "https://via.placeholder.com/150",
        role: "user", // Default role untuk user baru
      };

      user = await userModel.create(newUserData);
      console.log(`   ✅ User baru otomatis dibuat: ${user._id}`);
    } else {
      console.log(`   ✅ User ditemukan: ${user._id}`);
    }

    // Lampirkan seluruh dokumen pengguna dari database Anda ke object `req`.
    // Ini memungkinkan rute selanjutnya untuk mengakses data seperti `req.user.role` atau `req.user.email`.
    req.user = user;

    // Lanjutkan ke middleware berikutnya atau ke controller rute yang sebenarnya.
    next();
  } catch (error) {
    // Menangkap error yang mungkin terjadi selama proses pencarian di database.
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat mencari data pengguna.",
    });
  }
};