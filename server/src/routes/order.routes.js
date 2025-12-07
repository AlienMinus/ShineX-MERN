// server/src/routes/order.routes.js
import express from "express";
import Order from "../models/Order.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// place order
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const totalAmount = items.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      status: "PLACED",
      trackingId: "TRK" + Date.now(),
    });

    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// list orders of logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// 🔹 get single order
// - normal user: only their own order
// - admin: ANY order (no user filter)
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const query = { _id: id };
    if (req.user.role !== "admin") {
      // user: restrict to their own orders
      query.user = req.user._id;
    }

    const order = await Order.findOne(query)
      .populate("user", "name email")              // so admin can see customer info
      .populate("items.product", "title price images"); // optional, if you use product info

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

// admin: update status
router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

export default router;
