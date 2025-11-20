import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    admin: { type: String, ref: "user", required: true },
    rooms: [{ type: String, ref: "room" }],
  },
  { timestamps: true },
);

// Use explicit collection name 'hotels' to preserve existing data while
// the model name is updated to 'bengkel'. This avoids needing a DB migration.
const hotelModel = mongoose.model("bengkel", hotelSchema, "hotels");
export default hotelModel;
