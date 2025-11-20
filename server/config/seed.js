import mongoose from "mongoose";
import dotenv from "dotenv";
import hotelModel from "../models/hotel.models.js";
import roomModel from "../models/room.models.js";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Bersihkan data lama
    await hotelModel.deleteMany();
    await roomModel.deleteMany();

    // Tambah contoh bengkel
    const hotel = await hotelModel.create({
        name: "Stayza Bandung Resort",
        description: "Bengkel modern dengan fasilitas lengkap.",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        pricePerNight: 550000,
        rating: 4.7,
        city: "Bandung",
        address: "Jl. Setiabudi No. 45, Bandung, Jawa Barat",
        contact: "+62 812-3456-7890",
        admin: "admin@stayza.com",
        location: {
          type: "Point",
          coordinates: [107.60981, -6.914744] // (long, lat)
        }
      });
      

    // Tambah beberapa room
    await roomModel.create({
        hotel: hotel._id,
        type: "Deluxe Room",
        pricePerNight: 750000,
        amenities: ["AC", "WiFi", "TV", "Kamar Mandi Dalam", "Sarapan"],
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          "https://images.unsplash.com/photo-1582719478175-2d13d88ec8ed"
        ],
        isAvailable: true
      });
      

    console.log("✅ Dummy bengkel & room berhasil ditambahkan!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
