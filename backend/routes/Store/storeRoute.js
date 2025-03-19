import { getStoreMetaData } from "#controllers/Fetch/Store/getStoreMetaData.js";
import { getTopStores } from "#controllers/Fetch/Store/getTopStores.js";
import {
  getBranchSuggestions,
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
 * /store/store-suggestions:
 *   get:
 *     summary: Get store suggestions based on filters
 *     description: Fetches a list of stores based on Old Store Code and optional filters such as branch, managers, and team leaders.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: oldStoreCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Partial or full Old Store Code to search for.
 *       - in: query
 *         name: branchName
 *         schema:
 *           type: string
 *         description: Filter results by New Branch.
 *       - in: query
 *         name: zoneManager
 *         schema:
 *           type: string
 *         description: Filter results by Zone Manager.
 *       - in: query
 *         name: salesManager
 *         schema:
 *           type: string
 *         description: Filter results by Sales Manager.
 *       - in: query
 *         name: businessExecutive
 *         schema:
 *           type: string
 *         description: Filter results by Business Executive.
 *       - in: query
 *         name: systemTeamLeader
 *         schema:
 *           type: string
 *         description: Filter results by System Team Leader.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Maximum number of results to return.
 *     responses:
 *       200:
 *         description: Successfully retrieved store suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid request (missing required parameters or invalid limit value).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
storeRouter.get("/store/store-suggestions", getStoreSuggestions);

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
 *     summary: Get top-performing stores by average retailing
 *     description: Fetches the top stores based on average retailing for a given branch within a specified date range. Supports optional filters for zone manager, sales manager, and pagination.
 *     tags:
 *      - Store
 *     parameters:
 *       - in: query
 *         name: branchName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the branch to filter stores.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (default is 3 months ago).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (default is today).
 *       - in: query
 *         name: topStoresCount
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of top stores to retrieve.
 *       - in: query
 *         name: zoneManager
 *         schema:
 *           type: string
 *         description: Filter stores by a specific zone manager (optional).
 *       - in: query
 *         name: salesManager
 *         schema:
 *           type: string
 *         description: Filter stores by a specific sales manager (optional).
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination (optional).
 *     responses:
 *       200:
 *         description: A list of top stores with average retailing values.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 topStoresCount:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *                 topStoresDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       store_code:
 *                         type: string
 *                         description: Unique store code.
 *                       avg_retailing:
 *                         type: number
 *                         format: float
 *                         description: Average retailing value.
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *       500:
 *         description: Internal server error.
 */
storeRouter.get("/store/get-top-stores", getTopStores);

/**
 * @swagger
 * /store/branch-suggestions:
 *   get:
 *     summary: Get branch suggestions based on filters
 *     description: Fetches a list of branch names based on filters like managers and team leaders.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: branchName
 *         schema:
 *           type: string
 *         required: true
 *         description: Partial or full branch name to search for.
 *       - in: query
 *         name: zoneManager
 *         schema:
 *           type: string
 *         description: Filter results by Zone Manager.
 *       - in: query
 *         name: salesManager
 *         schema:
 *           type: string
 *         description: Filter results by Sales Manager.
 *       - in: query
 *         name: businessExecutive
 *         schema:
 *           type: string
 *         description: Filter results by Business Executive.
 *       - in: query
 *         name: systemTeamLeader
 *         schema:
 *           type: string
 *         description: Filter results by System Team Leader.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results to return.
 *     responses:
 *       200:
 *         description: Successfully retrieved branch suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid request (missing required parameters or invalid limit value).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
storeRouter.get("/store/branch-suggestions", getBranchSuggestions);

export default storeRouter;
