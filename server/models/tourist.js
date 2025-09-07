const mongoose = require("mongoose");

const TouristSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    // Encrypted fields
    passportNumber: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    encryptedVC: { type: String, required: true }, 

    tripItinerary: {
      from: { type: String, required: true },
      to: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },

    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },

    did: { type: String, unique: true, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Tourist", TouristSchema);
