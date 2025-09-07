import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  image: String,
  aadharid: String
});

const AlertSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["panic", "geofence", "anomaly"],
  },
  time: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  policeUnitAssigned: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "acknowledged", "resolved"],
    default: "pending",
  }
})

export const User = mongoose.model("User", UserSchema);
export const Alert = mongoose.model("Alert", AlertSchema);
