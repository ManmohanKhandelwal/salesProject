import express from "express";
import { getStoreById, getStores } from "../controllers/storeController.js";

const router = express.Router();

router.get("/getStoreByID",getStoreById);
router.get("/getStores",getStores);

export default router;