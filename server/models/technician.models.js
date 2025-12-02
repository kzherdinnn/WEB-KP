import mongoose from "mongoose";

const technicianSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nama teknisi
    phone: { type: String, required: true }, // Nomor HP teknisi
    email: { type: String }, // Email teknisi (opsional)
    specialization: [{ type: String }], // Spesialisasi (e.g., ["audio", "security"])
    isAvailable: { type: Boolean, default: true }, // Apakah tersedia
    photoUrl: { type: String }, // Foto teknisi
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating teknisi
    totalJobs: { type: Number, default: 0 }, // Total pekerjaan yang sudah dikerjakan
  },
  { timestamps: true }
);

const technicianModel = mongoose.model("technician", technicianSchema);
export default technicianModel;
