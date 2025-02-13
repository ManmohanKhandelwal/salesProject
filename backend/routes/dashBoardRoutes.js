import express from "express";
import { getDashBoardData } from "../controllers/Fetch/dashBoardData.js";
import { getFilterredDashBoardData } from "../controllers/Fetch/filterredDashBoardData.js";

const dashBoardrouter = express.Router();

dashBoardrouter.get("/DashboardData", getDashBoardData);
//Handle Custom Query
dashBoardrouter.post("/FilterredDashBoardData", getFilterredDashBoardData);

export default dashBoardrouter;
