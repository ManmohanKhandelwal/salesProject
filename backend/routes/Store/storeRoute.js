import { getStoreDashBoardData } from "#controllers/Fetch/Store/dashboardData.js";
import { getStoreInfoByCode } from "#controllers/Fetch/Store/getStoreInfo.js";
import {
  getStoreById,
  getStores,
} from "#controllers/Fetch/Store/storeController.js";
import express from "express";

const storeRouter = express.Router();

//GET Store Dashboard Data
storeRouter.get("/store/dashboard", getStoreDashBoardData);

// GET Store Outputs :- { oldStoreCode:"" }
storeRouter.get("/store/output", getStoreInfoByCode);

// GET Store Search Result:- { oldStoreCode }
storeRouter.get("/store/metaData", getStoreById);

//GET Stores with Offsets & Size :- { offset = 0, size = 10 }
storeRouter.get("/store", getStores);

export default storeRouter;
