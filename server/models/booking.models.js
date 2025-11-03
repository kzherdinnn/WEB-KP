import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    user: { type: String, ref: "user", required: true },
    room: { type: String, ref: "room", required: true },
    hotel: { type: String, ref: "hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, required: true },
    numberOfRooms: { type: Number, required: true, default: 1 }, // Jumlah kamar yang dipesan
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const bookingModel = mongoose.model("booking", bookingSchema);
export default bookingModel;
