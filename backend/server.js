import mySqlPool from "#config/db.js";
import { swaggerDocs } from "#config/swaggerConfig.js";
import dashBoardRouter from "#routes/DashBoard/dashBoardRoutes.js";
import forecastRouter from "#routes/Forecast/forecastRoutes.js";
import productRouter from "#routes/Product/productRoute.js";
import storeRouter from "#routes/Store/storeRoute.js";
import tableRouter from "#routes/Table/tableRoute.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" })); // ✅ Allow all origins (adjust in production)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Test Route
app.get("/test", (req, res) => {
  res.status(200).send("Testing!");
});

// Routes Handling
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/", [
  dashBoardRouter,
  storeRouter,
  tableRouter,
  forecastRouter,
  productRouter,
]);
// PORT Declaration
const PORT = process.env.PORT || 5000;

// Server Listening
app.listen(PORT, () => {
  console.log(`🚀 Server Running : http://localhost:${PORT}/`);
});

// Close MySQL connection on Server Close
process.on("SIGINT", async () => {
  console.log("Closing MySQL connection");
  await mySqlPool.end();
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
});
