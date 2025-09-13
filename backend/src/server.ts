require("express-async-errors");
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./router/index";

require("dotenv").config();

const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);

// ✅ Get values from .env safely
const MONGO_URL = process.env.MONGO_URL as string;
const PORT = process.env.PORT || 8080;

if (!MONGO_URL) {
  console.error("❌ MONGO_URL is not defined in .env");
  process.exit(1);
}

// ✅ Connect to MongoDB first, then start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error occurred while connecting to MongoDB:", error);
  });

// ✅ API routes
app.use("/api", routes());
