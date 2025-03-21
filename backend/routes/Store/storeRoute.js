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
 *     summary: Get store metadata, monthly sales, product breakdown, and category breakdown
 *     description: Fetches metadata for a store based on the old store code, including total sales, highest/lowest months, highest/lowest products, and categorized sales data.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: oldStoreCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The old store code to fetch metadata for
 *     responses:
 *       200:
 *         description: Store metadata and sales breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     store_name:
 *                       type: string
 *                     channel_description:
 *                       type: string
 *                     yearly_total:
 *                       type: string
 *                       example: "105000.00"
 *                     total_retailing:
 *                       type: string
 *                     highest_retailing_month:
 *                       type: string
 *                     highest_retailing_amount:
 *                       type: string
 *                     lowest_retailing_month:
 *                       type: string
 *                     lowest_retailing_amount:
 *                       type: string
 *                     highest_retailing_product:
 *                       type: string
 *                     highest_retailing_product_amount:
 *                       type: string
 *                     lowest_retailing_product:
 *                       type: string
 *                     lowest_retailing_product_amount:
 *                       type: string
 *                 monthly_metadata:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       total_retailing:
 *                         type: string
 *                 category_retailing:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         category:
 *                           type: string
 *                         total_retailing:
 *                           type: string
 *                 monthly_product_metadata:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       highest_retailing_product:
 *                         type: string
 *                       highest_retailing_product_amount:
 *                         type: string
 *                       lowest_retailing_product:
 *                         type: string
 *                       lowest_retailing_product_amount:
 *                         type: string
 *                       all_products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             brand:
 *                               type: string
 *                             total_retailing:
 *                               type: string
 *       400:
 *         description: Bad request, missing store code
 *       404:
 *         description: Store not found
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
 * /store/top-stores:
 *   get:
 *     summary: Get top-performing stores based on average retailing
 *     description: Retrieves a list of top stores ranked by average retailing over a specified date range. Supports filtering by branch, zone manager, and sales manager.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: query
 *         name: branchName
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by branch name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for the data range (default last 6 months)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for the data range (default today)
 *       - in: query
 *         name: topStoresCount
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of top stores to retrieve (default 20, max 100 for caching)
 *       - in: query
 *         name: zoneManager
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by zone manager
 *       - in: query
 *         name: salesManager
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by sales manager
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         required: false
 *         description: Pagination offset (default 0)
 *     responses:
 *       200:
 *         description: Successfully retrieved top stores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cached:
 *                   type: boolean
 *                   example: false
 *                 branchName:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                 topStoresCount:
 *                   type: integer
 *                   example: 20
 *                 zoneManager:
 *                   type: string
 *                 salesManager:
 *                   type: string
 *                 offset:
 *                   type: integer
 *                 topStoresDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       store_code:
 *                         type: string
 *                       store_name:
 *                         type: string
 *                       channel:
 *                         type: string
 *                       avg_retailing:
 *                         type: string
 *                         example: "15000.00"
 *       400:
 *         description: Bad request due to invalid parameters
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/store/top-stores", getTopStores);

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
