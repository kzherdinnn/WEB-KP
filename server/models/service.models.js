import mongoose from "mongoose";

const serviceSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nama layanan (e.g., "Pasang Head Unit")
    category: {
      type: String,
      required: true,
      enum: ["installation", "repair", "upgrade", "consultation", "package", "other"]
    }, // Kategori layanan
    description: { type: String }, // Deskripsi layanan
    price: { type: Number, required: true }, // Harga jasa
    discount: { type: Number, default: 0 }, // Diskon dalam persen
    estimatedDuration: { type: Number, required: true }, // Estimasi durasi dalam menit
    isAvailable: { type: Boolean, default: true }, // Apakah layanan tersedia
    includedItems: [{ type: String }], // Item yang termasuk dalam paket (opsional)
    images: [{ type: String }], // Gambar layanan
  },
  { timestamps: true }
);

const serviceModel = mongoose.model("service", serviceSchema);
export default serviceModel;
