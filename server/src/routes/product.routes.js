import express from "express";
import Product from "../models/Product.js";
import { SearchHistory, ViewHistory } from "../models/History.js";

const router = express.Router();

/**
 * GET /api/products/categories
 * Public – returns distinct category names
 * IMPORTANT: this must be BEFORE "/:id"
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category", {
      category: { $exists: true, $ne: "" },
    });

    console.log("Distinct categories:", categories);

    categories.sort((a, b) => a.localeCompare(b));
    res.json(categories);
  } catch (e) {
    console.error("Error loading categories:", e);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category,
      minPrice,
      maxPrice,
      sort = "latest",
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // category filter – case-insensitive
    if (category) {
      filter.category = {
        $regex: new RegExp(`^${category.trim()}$`, "i"),
      };
    }

    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    if (search) {
      filter.$text = { $search: search };
    }

    let query = Product.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      query.skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// store search history (only if user is available)
router.post("/search-history", async (req, res) => {
  try {
    const { query, filters } = req.body;

    // if no user attached, just ignore (avoid crash)
    if (!req.user?._id) {
      return res.json({ status: "ignored_no_user" });
    }

    await SearchHistory.create({ user: req.user._id, query, filters });
    res.json({ status: "ok" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// product detail + view history
// IMPORTANT: must be LAST route, after /categories
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    // only track view history if user exists
    if (req.user?._id) {
      await ViewHistory.create({ user: req.user._id, product: product._id });
    }

    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
