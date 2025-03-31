// routes/tableRouter.js
import mySqlPool from "#config/db.js";
import { deleteTempFile } from "#controllers/Delete/Table/deleteTempFIle.js";
import { downloadFile } from "#controllers/Fetch/Table/downloadFile.js";
import { getFileList } from "#controllers/Fetch/Table/getFileList.js";
import { getTablesMetaData } from "#controllers/Fetch/Table/getTablesMetaData.js";
import { uploadFile } from "#controllers/Update/Table/uploadFile.js";
import { mergeMappings } from "#controllers/Update/Table/mergeMappings.js";
import { mergePsrTable } from "#controllers/Update/Table/mergePsrTable.js";
import express from "express";

const tableRouter = express.Router();

/**
 * @swagger
 * /upload/new-csv-data:
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

tableRouter.post("/upload/new-csv-data", uploadFile);

/**
 * @swagger
 * /update/psr-data-table:
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

tableRouter.post("/update/psr-data-table", mergePsrTable);

/**
 * @swagger
 * /update/mappings-table:
 *   post:
 *     summary: Updates channel or store mappings from temporary tables
 *     description: This endpoint updates either `channel_mapping` or `store_mapping` by truncating the target table and inserting data from a corresponding temporary table. The temporary table is dropped after insertion.
 *     tags:
 *       - Table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filePath
 *               - tableType
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: The file path used to identify the job ID.
 *                 example: "123456_temp_file.csv"
 *               tableType:
 *                 type: string
 *                 enum: ["channel_mapping", "store_mapping"]
 *                 description: The type of mapping table to update.
 *                 example: "channel_mapping"
 *     responses:
 *       200:
 *         description: Mapping table updated successfully and file removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "channel_mapping updated successfully & File Removed !"
 *       400:
 *         description: Invalid input (missing or incorrect parameters).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Table Type is required!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

tableRouter.post("/update/mappings-table", mergeMappings);

/**
 * @swagger
 * /table-meta-data:
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

tableRouter.post("/table-meta-data", getTablesMetaData);

/**
 * @swagger
 * /temp-table-csvfiles:
 *   get:
 *     summary: Get details of temporary files in the cache directory
 *     description: Retrieves metadata for files stored in the cache folder, including job ID, file name, and status.
 *     tags:
 *       - Table
 *     responses:
 *       200:
 *         description: Successfully retrieved temp file details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                     description: Unique job ID extracted from the file name.
 *                   fileName:
 *                     type: string
 *                     description: The actual file name without the job ID prefix.
 *                   status:
 *                     type: string
 *                     description: Current status of the file (default is "pending").
 *                   file:
 *                     type: string
 *                     description: Full file name including job ID.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue.
 */

tableRouter.get("/temp-table-csvfiles", getFileList);

/**
 * @swagger
 * /delete-uploaded-file:
 *   post:
 *     summary: Delete a temporary file by Job ID
 *     description: Removes a temporary file from the system based on the provided Job ID.
 *     tags:
 *       - File Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: "12345"
 *                 description: The unique Job ID associated with the temporary file.
 *     responses:
 *       200:
 *         description: File successfully removed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File Removed!"
 *       400:
 *         description: Bad request. Job ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File Path is required!"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

tableRouter.post("/delete-uploaded-file", deleteTempFile);

/**
 * @swagger
 * /download-uploaded-file:
 *   post:
 *     summary: Download a file
 *     description: Allows users to download a file stored in the `/backend/cache/` directory based on the provided job ID and file name.
 *     tags:
 *       - File Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: Unique identifier of the file
 *               fileName:
 *                 type: string
 *                 description: Name of the file to download
 *             required:
 *               - jobId
 *               - fileName
 *     responses:
 *       200:
 *         description: File successfully downloaded
 *         content:
 *           application/octet-stream: {}
 *       400:
 *         description: Bad request, missing jobId or fileName
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job ID and File Name are required!
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File not found!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

tableRouter.post("/download-uploaded-file", downloadFile);

/**
 * @swagger
 * /run-custom-query:
 *   post:
 *     summary: Execute a custom SQL query
 *     description: Runs a raw SQL query provided in the request body and returns the results.
 *     tags:
 *       - Database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: The raw SQL query to execute
 *             required:
 *               - query
 *     responses:
 *       200:
 *         description: Successfully executed the query and returned results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request, missing query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Query is required!
 *       500:
 *         description: Internal server error or invalid SQL query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

tableRouter.post("/run-custom-query", async (req, res) => {
  const { query } = req.body;
  try {
    const [results] = await mySqlPool.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    res.status(500).json({ message: error.message || error });
  }
});
export default tableRouter;