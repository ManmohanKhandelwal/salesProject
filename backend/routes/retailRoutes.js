import express from "express";
import { getRetailData } from "#controllers/Fetch/Store/retailController.js";

const router = express.Router();

router.get("/data", getRetailData);

export default router;
