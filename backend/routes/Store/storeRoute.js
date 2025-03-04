import { getStoreDashBoardData } from "#controllers/Fetch/Store/dashboardData.js";
import { getStoreInfoByCode } from "#controllers/Fetch/Store/getStoreInfo.js";
import { getStoreById, getStores } from "#controllers/Fetch/Store/storeController.js";
import express from "express";

const storeRouter = express.Router();

/**
 * @swagger
 * /store/dashboard:
 *   get:
 *     summary: Fetch store dashboard data
 *     description: Retrieves store metrics including store count, revenue stats, and zone-wise sales.
 *     tags:
 *       - Store
 *     responses:
 *       200:
 *         description: Successfully fetched store dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storeCount:
 *                   type: integer
 *                   example: 250
 *                 storeRevenueStats:
 *                   type: object
 *                   properties:
 *                     highest_earning_customer:
 *                       type: string
 *                       example: "Store A"
 *                     highest_retailing_amount:
 *                       type: number
 *                       example: 50000.75
 *                 zoneManagerRetailing:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       zone_manager:
 *                         type: string
 *                         example: "ZM-1"
 *                       total_retailing:
 *                         type: number
 *                         example: 125000.50
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/store/dashboard", getStoreDashBoardData);

/**
 * @swagger
 * /store/output:
 *   get:
 *     summary: Fetch store output data
 *     description: Fetches store-related information based on the old store code.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: oldStoreCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The old store code to fetch data for.
 *     responses:
 *       200:
 *         description: Successfully fetched store output data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 yearly_total:
 *                   type: number
 *                   example: 1200000.50
 *                 highest_retailing_month:
 *                   type: string
 *                   format: date
 *                   example: "2024-01"
 *       400:
 *         description: Store code is required
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/store/output", getStoreInfoByCode);

/**
 * @swagger
 * /store/metaData:
 *   get:
 *     summary: Get store metadata by store code
 *     description: Fetches metadata for a store using an old store code.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: oldStoreCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Old store code to search for.
 *     responses:
 *       200:
 *         description: Successfully retrieved store metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Old_Store_Code:
 *                     type: string
 *                     example: "S123"
 *                   New_Store_Code:
 *                     type: string
 *                     example: "N789"
 *       400:
 *         description: Store code is required
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/store/metaData", getStoreById);

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Get stores with pagination
 *     description: Retrieves a list of stores with pagination options.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The starting point for fetching records.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to fetch.
 *     responses:
 *       200:
 *         description: Successfully retrieved stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Old_Store_Code:
 *                     type: string
 *                     example: "S123"
 *                   New_Store_Code:
 *                     type: string
 *                     example: "N789"
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/store", getStores);

export default storeRouter;