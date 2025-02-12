import express from "express";
import { getDashBoardData } from "../controllers/Fetch/dashBoardData.js";

const dashBoardrouter = express.Router();

dashBoardrouter.post("/DashboardData", getDashBoardData);
dashBoardrouter.get("/DashboardData", getDashBoardData);

export default dashBoardrouter;
