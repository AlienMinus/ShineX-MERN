import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, adminOnly);

// CREATE product
router.post("/products", async (req, res) => {
  try {
    const { title, price, category, brand, description, imageUrl, stock } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    // 🔹 normalize category: lowercase + trimmed
    const normalizedCategory = category
      ? category.trim().toLowerCase()
      : undefined;

    const product = await Product.create({
      title,
      price,
      category: normalizedCategory,   // 👈 use normalized
      brand,
      description,
      images: imageUrl ? [imageUrl] : [],
      stock: stock ?? 0,
    });

    res.status(201).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create product" });
  }
});


// UPDATE product
router.put("/products/:id", async (req, res) => {
  try {
    const { imageUrl, ...rest } = req.body;

    const update = { ...rest };
    if (imageUrl) update.images = [imageUrl];

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE product
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ADMIN: list all orders (unchanged)
router.get("/orders", async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
