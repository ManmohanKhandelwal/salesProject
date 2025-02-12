import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import mySqlPool from "./config/db.js";
import dashBoardrouter from "./routes/dashBoardRoutes.js";
import retailRoutes from "./routes/retailRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import updatePSRSummaryRoute from "./routes/updatePSRSummaryTable.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).send("Testing!");
});
app.use("/retail", retailRoutes);
app.use("/store", storeRoutes);
app.use("/Dashboard", dashBoardrouter);
app.use("/DB",updatePSRSummaryRoute);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running : http://localhost:${PORT}/`);
});

//Close MySQL connection on Server Close
process.on("SIGINT", async () => {
  console.log("Closing MySQL connection");
  await mySqlPool.end();
  process.exit(0);
});
