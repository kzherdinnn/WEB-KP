import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  city: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }], // ⬅️ ini penting!
}, { timestamps: true });

const hotelModel = mongoose.model("hotel", hotelSchema);
export default hotelModel;
