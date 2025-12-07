import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    query: String,
    filters: Object
  },
  { timestamps: true }
);

const viewHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  },
  { timestamps: true }
);

export const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
export const ViewHistory = mongoose.model("ViewHistory", viewHistorySchema);
