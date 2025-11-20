import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    hotel: { type: String, ref: "bengkel", required: true },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    totalRooms: { type: Number, default: 1, required: true }, // Total kapasitas kamar
    availableRooms: { type: Number, default: 1, required: true }, // Kamar yang masih tersedia
  },
  { timestamps: true },
);

const roomModel = mongoose.model("room", roomSchema);

export default roomModel;
