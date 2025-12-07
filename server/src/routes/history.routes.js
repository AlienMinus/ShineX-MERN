import express from "express";
import { auth } from "../middleware/auth.js";
import { SearchHistory, ViewHistory } from "../models/History.js";

const router = express.Router();

router.get("/search", auth, async (req, res) => {
  const history = await SearchHistory.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(history);
});

router.get("/views", auth, async (req, res) => {
  const history = await ViewHistory.find({ user: req.user._id })
    .populate("product")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(history);
});

export default router;
