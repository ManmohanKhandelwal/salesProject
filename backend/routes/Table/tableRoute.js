// routes/tableRouter.js
import express from "express";
import { getTablesMetaData } from "#controllers/Fetch/Table/fetchMetaData.js";
import { insertNewData } from "#controllers/Update/Table/insertNewData.js";
import { updatePSRTable } from "#controllers/Update/Table/updatePsrTable.js";

const tableRouter = express.Router();

/**
 * @swagger
 * /upload/psr_data:
 *   post:
 *     summary: Upload PSR data
 *     description: Uploads and processes a CSV file containing PSR data.
 *     tags:
 *       - Table
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The CSV file to upload.
 *       - in: formData
 *         name: fileType
 *         type: string
 *         required: true
 *         description: Type of the file (e.g., psr_data, channel_mapping, store_mapping).
 *     responses:
 *       202:
 *         description: File uploaded and processing started.
 *       400:
 *         description: Invalid request or file type.
 *       500:
 *         description: Internal server error.
 */
tableRouter.post("/upload/psr_data", insertNewData);

/**
 * @swagger
 * /update/psr_data:
 *   post:
 *     summary: Update PSR data table
 *     description: Moves data from the temporary table to the main PSR data table.
 *     tags:
 *       - Table
 *     parameters:
 *       - in: body
 *         name: filePath
 *         type: string
 *         required: true
 *         description: Path of the uploaded file.
 *       - in: body
 *         name: tableType
 *         type: string
 *         required: true
 *         description: Type of the table to update.
 *     responses:
 *       200:
 *         description: Table updated successfully.
 *       500:
 *         description: Internal server error.
 */
tableRouter.post("/update/psr_data", updatePSRTable);

/**
 * @swagger
 * /tableMetaData:
 *   post:
 *     summary: Fetch table metadata
 *     description: Retrieves metadata for a specified table or all tables in the database.\
 *     tags:
 *       - Table
 *     parameters:
 *       - in: body
 *         name: tableName
 *         type: string
 *         required: false
 *         description: The name of the table to retrieve metadata for (optional).
 *     responses:
 *       200:
 *         description: Successfully retrieved table metadata.
 *       500:
 *         description: Internal server error.
 */
tableRouter.post("/tableMetaData", getTablesMetaData);

export default tableRouter;