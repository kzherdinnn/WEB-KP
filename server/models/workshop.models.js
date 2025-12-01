import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nama bengkel
    address: { type: String, required: true }, // Alamat bengkel
    contact: { type: String, required: true }, // Kontak bengkel
    city: { type: String, required: true }, // Kota
    email: { type: String }, // Email bengkel
    description: { type: String }, // Deskripsi bengkel
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    }, // Jam operasional
    timeSlots: [{ type: String }], // Slot waktu tersedia (e.g., ["09:00", "10:00", "11:00"])
    maxBookingsPerSlot: { type: Number, default: 3 }, // Max booking per slot
    admin: { type: String, ref: "user", required: true }, // Admin bengkel
    images: [{ type: String }], // Foto bengkel
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }, // Koordinat untuk map
    isActive: { type: Boolean, default: true }, // Apakah bengkel aktif
  },
  { timestamps: true }
);

const workshopModel = mongoose.model("workshop", workshopSchema);
export default workshopModel;
