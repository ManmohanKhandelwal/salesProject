import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import retailRoutes from "./routes/retailRoutes.js";
import dashBoardRoutes from "./routes/dashBoardRoutes.js";
import mySqlPool from "./config/db.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// API Routes
app.use("/retail", retailRoutes);
app.use("/Dashboard", dashBoardRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server with Proper Error Handling
app
  .listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("❌ Server startup error:", err);
  });

  //CLose query on Server Closure
  process.on("SIGINT", async () => {
    await mySqlPool.end();
    console.log("Server closed, database connection closed.");
    process.exit(0);
  });
