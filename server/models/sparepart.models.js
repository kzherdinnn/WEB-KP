import mongoose from "mongoose";

const sparepartSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nama sparepart (e.g., "Speaker Pioneer TS-G1620F")
    category: { 
      type: String, 
      required: true,
      enum: ["speaker", "amplifier", "subwoofer", "headunit", "kabel", "accessory", "other"]
    }, // Kategori sparepart
    brand: { type: String, required: true }, // Merek (e.g., "Pioneer", "JBL")
    price: { type: Number, required: true }, // Harga sparepart
    discount: { type: Number, default: 0 }, // Diskon dalam persen
    stock: { type: Number, required: true, default: 0 }, // Stok tersedia
    lowStockThreshold: { type: Number, default: 5 }, // Ambang batas stok rendah
    description: { type: String }, // Deskripsi sparepart
    specifications: { type: Object }, // Spesifikasi teknis (JSON object)
    images: [{ type: String }], // Array gambar sparepart
    compatibleVehicles: [
      {
        brand: String, // Merek mobil (e.g., "Toyota")
        model: String, // Model (e.g., "Avanza")
        year: String, // Tahun (e.g., "2015-2020")
      }
    ], // Kendaraan yang kompatibel
    warranty: { type: Number, default: 0 }, // Garansi dalam bulan
    isAvailable: { type: Boolean, default: true }, // Apakah tersedia untuk dijual
    isPreOrderOnly: { type: Boolean, default: false }, // Hanya pre-order
  },
  { timestamps: true }
);

const sparepartModel = mongoose.model("sparepart", sparepartSchema);
export default sparepartModel;
