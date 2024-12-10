import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    available: {
      type: Boolean,
      default: true,
    },
    spotType: {
      type: String,
      enum: ["Indoor", "Open"],
      default: "Open",
    },
    pricePerHour: {
      car: {
        type: Number,
        default: 10,
      },
      bike: {
        type: Number,
        default: 50,
      },
    },
    capacity: {
      car: {
        type: Number,
        default: 10,
      },
      bike: {
        type: Number,
        default: 50,
      },
    },

    coordinates: {
      type: String,
      required: true,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    isFree: { type: Boolean, default: false },
    imageUrls: [String],

    coordinates: [String],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    reservations: {
      car: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
        },
      ],
      bike: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
        },
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot;
