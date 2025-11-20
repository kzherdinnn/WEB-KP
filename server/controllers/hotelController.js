import hotelModel from "../models/hotel.models.js";
import userModel from "../models/user.models.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const admin = req.user._id;

    // ✅ Validasi: Hanya admin yang bisa mendaftarkan bengkel
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya admin yang dapat mendaftarkan bengkel.",
      });
    }

    const hotel = await hotelModel.findOne({ admin });
    if (hotel) {
      return res.json({ success: false, message: "Bengkel already registered" });
    }

    await hotelModel.create({ name, address, contact, city, admin });

    res.json({ success: true, message: "Bengkel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ➕ Ambil semua bengkel
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find().populate("rooms");
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
