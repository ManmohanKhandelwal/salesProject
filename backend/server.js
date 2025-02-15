import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mySqlPool from "#config/db.js";
import dashBoardRouter from "#routes/DashBoard/dashBoardRoutes.js";
import storeRouter from "#routes/Store/storeRoute.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//Test Route
app.get("/test", (req, res) => {
  res.status(200).send("Testing!");
});
//Routes Handling
app.use("/",[dashBoardRouter,storeRouter]);

//PORT Declaration
const PORT = process.env.PORT || 5000;

//Server Listening
app.listen(PORT, () => {
  console.log(`🚀 Server Running : http://localhost:${PORT}/`);
});

//Close MySQL connection on Server Close
process.on("SIGINT", async () => {
  console.log("Closing MySQL connection");
  await mySqlPool.end();
  process.exit(0);
});
