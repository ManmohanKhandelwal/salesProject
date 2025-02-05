import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mySqlPool from "./config/db.js";

import retailRoutes from "./routes/retailRoutes.js";
import { SQLSelect } from "./utils/queryFormatter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).send("Testing!");
});
app.use("/retail", retailRoutes);

const PORT = process.env.PORT || 5000;

mySqlPool
  .query(SQLSelect(["*"], "channel_mappings"))
  .then((res) => {
    console.dir(res,{depth:null});
    console.log("MySQL DB Connected.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
