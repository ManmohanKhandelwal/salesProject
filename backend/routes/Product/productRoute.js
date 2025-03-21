import { getCatBrandDetails } from "#controllers/Fetch/Product/getCatBrandDetails.js";
import { getCatBrandSuggestions } from "#controllers/Fetch/Product/getCatBrandSuggestions.js";
import { getProductSuggestions } from "#controllers/Fetch/Product/getProductFeatures.js";
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

/**
 * @swagger
 * /product/suggestions:
 *   get:
 *     summary: Get product suggestions based on brand or brand form name
 *     description: Fetches a list of unique brand names or brand form names based on the search query.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: brandName
 *         schema:
 *           type: string
 *         description: Partial or full brand name to search for (required if searchType is 'brand').
 *       - in: query
 *         name: brandFormName
 *         schema:
 *           type: string
 *         description: Partial or full brand form name to search for (required if searchType is 'brandform').
 *       - in: query
 *         name: searchType
 *         schema:
 *           type: string
 *           enum: [brand, brandform]
 *         required: true
 *         description: Specify whether to search by brand or brand form.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The maximum number of results to return.
 *     responses:
 *       200:
 *         description: Successfully retrieved product suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid request (missing required parameters or invalid search type).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
productRouter.get("/product/suggestions", getProductSuggestions);

/**
 * @swagger
 * /product/options:
 *   get:
 *     summary: Get category, brand, brandform, or subbrandform suggestions
 *     description: Retrieves a list of unique suggestions for category, brand, brandform, or subbrandform based on the provided parent values.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: searchType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [category, brand, brandform, subbrandform]
 *         description: The type of data to fetch (category, brand, brandform, or subbrandform).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category name (required if searchType is brand, brandform, or subbrandform).
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: The brand name (required if searchType is brandform or subbrandform).
 *       - in: query
 *         name: brandform
 *         schema:
 *           type: string
 *         description: The brandform name (required if searchType is subbrandform).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of results to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of results to skip for pagination.
 *     responses:
 *       200:
 *         description: Successfully retrieved suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid searchType or missing parent values.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error.
 */
productRouter.get("/product/options", getCatBrandSuggestions);

export default productRouter;
