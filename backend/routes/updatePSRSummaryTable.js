import express from "express";
import { updatePSRSummary } from "../controllers/Update/psrSummary.js";
const updatePSRSummaryRoute = express.Router();

updatePSRSummaryRoute.get("/updatePSRSummary", updatePSRSummary);

export default updatePSRSummaryRoute;
