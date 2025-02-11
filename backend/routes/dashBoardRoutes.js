import express from "express";
import { getDashBoardData } from "../controllers/Fetch/dashBoardData.js";

const router = express.Router();

router.post("/DashboardData", getDashBoardData);
router.get("/DashboardData", getDashBoardData);

export default router;
