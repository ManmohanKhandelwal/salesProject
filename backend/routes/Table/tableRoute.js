import { getTablesMetaData } from "#controllers/Fetch/Table/fetchMetaData.js";
import { insertNewData } from "#controllers/Update/Table/insertNewData.js";
import { updatePSRTable } from "#controllers/Update/Table/updatePsrTable.js";
import express from "express";

const tableRouter = express.Router();
tableRouter.post("/upload/psr_data", insertNewData);
tableRouter.post("/update/psr_data", updatePSRTable);
tableRouter.post("/tableMetaData", getTablesMetaData);

export default tableRouter;
