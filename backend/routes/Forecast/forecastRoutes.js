import {
  getActualSalesData,
  getForecastData,
} from "#controllers/Forecast/forecastController.js";
import express from "express";

const forecastRouter = express.Router();
/**
 * @swagger
 * /api/forecast:
 *   get:
 *     summary: Fetch forecasted sales data
 *     description: Fetches the predicted sales data from the FastAPI backend.
 *     tags:
 *       - Forecast
 *     responses:
 *       200:
 *         description: Successfully retrieved forecast data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forecast:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-03-04"
 *                       sales:
 *                         type: number
 *                         example: 1500.75
 *       500:
 *         description: Internal server error
 */
forecastRouter.get("/forecast", getForecastData);

/**
 * @swagger
 * /api/forecast/actual-sales:
 *   get:
 *     summary: Fetch actual sales data for 2023 & 2024
 *     description: Retrieves real sales data from FastAPI.
 *     tags:
 *       - Forecast
 *     responses:
 *       200:
 *         description: Successfully retrieved actual sales data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2023-05-10"
 *                       revenue:
 *                         type: number
 *                         example: 2450.90
 *       500:
 *         description: Internal server error
 */
forecastRouter.get("/forecast/actual-sales", getActualSalesData);

export default forecastRouter;
