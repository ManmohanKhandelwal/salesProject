import express from "express";
import { getStoreInfoByCode } from "#controllers/Fetch/Store/getStoreInfo.js";
import { getStoreById, getStores } from "#controllers/Fetch/Store/storeController.js";

const storeRouter = express.Router();

// GET Store Outputs :- { oldStoreCode:"" }
storeRouter.get("/store/output", getStoreInfoByCode);

// GET Store MetaData:- { oldStoreCode }
storeRouter.get("/store/metaData", getStoreById);

//GET Stores with Offsets & Size :- { offset = 0, size = 10 }
storeRouter.get("/store", getStores);


export default storeRouter;