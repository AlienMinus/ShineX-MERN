import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },   // 👈 description
    category: { type: String, index: true },
    brand: String,
    price: { type: Number, required: true, index: true },
    images: [String],                             // 👈 array of image URLs
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    attributes: { type: Map, of: String },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
