import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,               // "Home", "Office"
  fullName: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },       // null for Google-only accounts
    googleId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    addresses: [addressSchema],
    defaultAddress: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
