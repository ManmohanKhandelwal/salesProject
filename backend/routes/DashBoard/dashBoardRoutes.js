import express from "express";
import { updatePSRSummary } from "#controllers/Update/DashBoard/updatePSRSummary.js";
import { getDashBoardData } from "#controllers/Fetch/Dashboard/dashBoardData.js";
import { getFilteredDashBoardData } from "#controllers/Fetch/Dashboard/filterredDashBoardData.js";

const dashBoardRouter = express.Router();

/**
 * @swagger
 * /dashboard/update-psr-summary:
 *   get:
 *     summary: Update the PSR summary table
 *     description: Updates or inserts data into the `dashboard_summary` table based on the latest `psr_data`.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully updated dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
dashBoardRouter.get("/dashboard/update-psr-summary", updatePSRSummary);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Fetch dashboard data
 *     description: Retrieves precomputed and cached dashboard summary data including retail trends, top-performing branches, and brands.
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRetailingValue:
 *                   type: number
 *                 latestMonthTotalRetailing:
 *                   type: object
 *                 previousYearSameMonthTotalRetailing:
 *                   type: object
 *                 percentageChangeinRetailing:
 *                   type: number
 *                 retailChannelData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 retailCategoryData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 topRetailingBrand:
 *                   type: object
 *                 topRetailingBranch:
 *                   type: object
 *                 retailTrendByMonthAndYear:
 *                   type: array
 *                   items:
 *                     type: object
 *                 topTenBrandForm:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
dashBoardRouter.get("/dashboard", getDashBoardData);

/**
 * @swagger
 * /dashboard/filterred-dashboard-data:
 *   post:
 *     summary: Fetch filtered dashboard data
 *     description: Fetch dashboard data based on provided filters such as year, month, category, brand, branches, and more.
 *     tags:
 *       - Dashboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               years:
 *                 type: array
 *                 items:
 *                   type: integer
 *               months:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               brand:
 *                 type: array
 *                 items:
 *                   type: string
 *               brandform:
 *                 type: array
 *                 items:
 *                   type: string
 *               customer_type:
 *                 type: array
 *                 items:
 *                   type: string
 *               branches:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRetailingValue:
 *                   type: number
 *                 latestMonthTotalRetailing:
 *                   type: object
 *                 previousYearSameMonthTotalRetailing:
 *                   type: object
 *                 percentageChangeinRetailing:
 *                   type: number
 *                 retailChannelData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 retailCategoryData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 retailTrendByMonthAndYear:
 *                   type: array
 *                   items:
 *                     type: object
 *                 topTenBrandForm:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
dashBoardRouter.post("/dashboard/filterred-dashboard-data", getFilteredDashBoardData);

export default dashBoardRouter;