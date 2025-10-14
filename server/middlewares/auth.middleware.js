import userModel from "../models/user.models.js";

export const protectedRoute = async (req, res, next) => {
  try {
    // Middleware Clerk (`ClerkExpressRequireAuth`) sudah memvalidasi token
    // dan memastikan `req.auth` serta `req.auth.userId` ada.
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: "Tidak Terotentikasi. ID Pengguna tidak ditemukan setelah verifikasi.",
      });
    }

    // Model User Anda menyimpan ID Clerk (`user_...`) langsung di field `_id` sebagai String.
    // Oleh karena itu, kita gunakan `findById` untuk mencari pengguna yang cocok di database Anda.
    const user = await userModel.findById(req.auth.userId);

    // Kasus ini kritis: Pengguna valid di Clerk, tetapi tidak ada di database Anda.
    // Ini biasanya terjadi jika data pengguna tidak dibuat melalui Webhook setelah mendaftar.
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan di database. Mungkin ada masalah sinkronisasi.",
      });
    }

    // Lampirkan seluruh dokumen pengguna dari database Anda ke object `req`.
    // Ini memungkinkan rute selanjutnya untuk mengakses data seperti `req.user.role` atau `req.user.email`.
    req.user = user;

    // Lanjutkan ke middleware berikutnya atau ke controller rute yang sebenarnya.
    next();
  } catch (error) {
    // Menangkap error yang mungkin terjadi selama proses pencarian di database.
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server internal saat mencari data pengguna.",
    });
  }
};