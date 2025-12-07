// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";

import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import historyRoutes from "./src/routes/history.routes.js";
import recoRoutes from "./src/routes/reco.routes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: ["https://shopx-online.vercel.app/", "http://localhost:5173/"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reco", recoRoutes);

const PORT = process.env.PORT || 5000;

// 🔹 Ensure at least one admin user exists
async function ensureAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@shinex.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log(`Existing user promoted to admin: ${adminEmail}`);
      } else {
        console.log(`Admin already exists: ${adminEmail}`);
      }
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    admin = await User.create({
      name: "Main Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });

    console.log("Admin user created:");
    console.log("  Email:", adminEmail);
    console.log("  Password:", adminPassword);
  } catch (err) {
    console.error("Error ensuring admin user:", err.message);
  }
}

// 🔹 Bootstrapping the app: connect DB → ensure admin → start server
async function startServer() {
  try {
    await connectDB();
    await ensureAdminUser();

    app.listen(PORT, () =>
      console.log(`Server running on ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
