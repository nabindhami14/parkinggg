import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["customer", "owner", "admin"],
      default: ["customer"], // Set the default value as an array
    },
    coordinates: {
      type: [String],
    },
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    ],
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
    documents: {
      front: {
        iv: String,
        key: String,
        encryptedFilePath: String,
        originalFileName: String,
      },
      back: {
        iv: String,
        key: String,
        encryptedFilePath: String,
        originalFileName: String,
      },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
