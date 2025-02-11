import express from "express";
import { updatePSRSummary } from "../controllers/Update/psrSummary";
const router = express.Router();

router.get("/updatePSRSummary", updatePSRSummary);

export default router;
