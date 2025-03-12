import { getCatBrandDetails } from "#controllers/Fetch/Product/getCatBrandDetails.js";
import express from "express";
const productRouter = express.Router();

// Route to get the details of a category or brand
/**
 * @swagger
 * /product/details:
 *   post:
 *     summary: Retrieve category or brand details based on search type.
 *     description: Fetches the highest and lowest retailing brand, brandform, retailing trend, and store details for a given category or brand.
 *     tags:
 *      - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: The category name (required if searchType is "category").
 *               brandName:
 *                 type: string
 *                 description: The brand name (required if searchType is "brand").
 *               searchType:
 *                 type: string
 *                 enum: [category, brand]
 *                 description: Specifies whether to search by category or brand.
 *     responses:
 *       200:
 *         description: Successfully retrieved the data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 highest_brand:
 *                   type: string
 *                   nullable: true
 *                   description: The brand with the highest retailing value.
 *                 lowest_brand:
 *                   type: string
 *                   nullable: true
 *                   description: The brand with the lowest retailing value.
 *                 highest_brandform:
 *                   type: string
 *                   nullable: true
 *                   description: The brandform with the highest retailing value.
 *                 lowest_brandform:
 *                   type: string
 *                   nullable: true
 *                   description: The brandform with the lowest retailing value.
 *                 retailing_trend:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month_year:
 *                         type: string
 *                         description: The month and year in 'YYYY-MM' format.
 *                       total_retailing:
 *                         type: number
 *                         description: The total retailing value for the month.
 *                 lowest_reatiling_store:
 *                   type: string
 *                   nullable: true
 *                   description: The store with the lowest retailing value.
 *                 highest_reatiling_store:
 *                   type: string
 *                   nullable: true
 *                   description: The store with the highest retailing value.
 *       400:
 *         description: Invalid search type or missing parameters.
 *       500:
 *         description: Internal server error.
 */
productRouter.post("/product/details", getCatBrandDetails);

export default productRouter;
