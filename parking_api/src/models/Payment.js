import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    pidx: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "FAILED", "SUCCESS"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "CASH"],
      default: "ONLINE",
    },
    provider: {
      type: String,
      enum: ["KHALTI", "ESEWA"],
      default: "KHALTI",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
