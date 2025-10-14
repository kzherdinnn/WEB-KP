import hotelModel from "../models/hotel.models.js";
import userModel from "../models/user.models.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const admin = req.user._id;

    const hotel = await hotelModel.findOne({ admin });
    if (hotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    await hotelModel.create({ name, address, contact, city, admin });
    await userModel.findByIdAndUpdate(admin, { role: "admin" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ➕ Ambil semua hotel
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find().populate("rooms");
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
