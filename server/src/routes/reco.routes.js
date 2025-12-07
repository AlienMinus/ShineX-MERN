import express from "express";
import axios from "axios";
import { auth } from "../middleware/auth.js";
import { SearchHistory, ViewHistory } from "../models/History.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/personalized", auth, async (req, res) => {
  try {
    const [searchHistory, viewHistory] = await Promise.all([
      SearchHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20),
      ViewHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20)
    ]);

    const searchQueries = searchHistory.map((h) => h.query);
    const viewedProductIds = viewHistory.map((v) => v.product.toString());

    const recoResp = await axios.post(
      `${process.env.RECO_SERVICE_URL}/recommend`,
      {
        user_id: req.user._id.toString(),
        viewed_product_ids: viewedProductIds,
        search_queries: searchQueries
      },
      { timeout: 2000 }
    );

    const ids = recoResp.data.recommended_product_ids || [];
    const products = await Product.find({ _id: { $in: ids } });

    res.json(products);
  } catch (e) {
    console.error(e.message);
    // fallback: send popular/latest
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  }
});

export default router;
