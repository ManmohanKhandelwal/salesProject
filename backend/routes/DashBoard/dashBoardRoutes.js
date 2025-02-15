import express from "express";
import { updatePSRSummary } from "#controllers/Update/DashBoard/updatePSRSummary.js";
import { getDashBoardData } from "#controllers/Fetch/Dashboard/dashBoardData.js";
import { getFilteredDashBoardData } from "#controllers/Fetch/Dashboard/filterredDashBoardData.js";

const dashBoardRouter = express.Router();

//Update PSR Summary Table
dashBoardRouter.get("/dashboard/update-psr-summary", updatePSRSummary);
// Get DashBoard Initial Data
dashBoardRouter.get("/dashboard", getDashBoardData);
//Handle Custom Query
dashBoardRouter.post("/dashboard/filterred-dashBoarddata", getFilteredDashBoardData);

export default dashBoardRouter;
