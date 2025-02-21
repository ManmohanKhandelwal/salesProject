import { getActualSalesData } from "#controllers/Forecast/forecastController.js";
import express from "express";

const forecastRouter = express.Router();

forecastRouter.get("/actual-sales", getActualSalesData);

export default forecastRouter;
