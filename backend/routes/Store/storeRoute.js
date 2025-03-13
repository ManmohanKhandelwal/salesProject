import { getStoreMetaData } from "#controllers/Fetch/Store/getStoreMetaData.js";
import { getTopStores } from "#controllers/Fetch/Store/getTopStores.js";
import {
  getStoreSuggestions,
  getStoresList,
} from "#controllers/Fetch/Store/storeFeatures.js";
import { getStoreDashBoardData } from "#controllers/Fetch/Store/storeDashboardData.js";
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
 * /store/meta-data:
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
storeRouter.get("/store/meta-data", getStoreMetaData);

/**
 * @swagger
 * /store/suggestions:
 *   get:
 *     summary: Get store suggestions by store code
 *     description: Fetches suggestions for a store using an old store code.
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
storeRouter.get("/store/suggestions", getStoreSuggestions);

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
storeRouter.get("/store", getStoresList);

/**
 * @swagger
 * /store/get-top-stores:
 *   get:
 *     summary: Get top stores based on average retailing
 *     description: Fetches the top stores by average retailing for a given branch within a date range.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: branchName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the branch to filter stores.
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering records (YYYY-MM-DD). Defaults to 6 months ago.
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering records (YYYY-MM-DD). Defaults to today.
 *       - in: query
 *         name: topStoresCount
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of top stores to return (default is 20).
 *     responses:
 *       200:
 *         description: Successfully fetched top stores.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 branchName:
 *                   type: string
 *                   example: "Branch A"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-01"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-06-30"
 *                 topStoresCount:
 *                   type: integer
 *                   example: 10
 *                 topStoresDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       store_code:
 *                         type: string
 *                       avg_retailing:
 *                         type: number
 *                         format: float
 *       400:
 *         description: Missing required branch name.
 *       500:
 *         description: Server error.
 */
storeRouter.get("/store/get-top-stores", getTopStores);

export default storeRouter;
