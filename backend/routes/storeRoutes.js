import express from "express";
import { getStoreById, getStores } from "#controllers/Fetch/Store/storeController.js";

export const router = express.Router();

router.get("/getStoreByID",getStoreById);
router.get("/getStores",getStores);

export default router;