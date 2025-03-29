import mySqlPool from "#config/db.js";
import { TABLE_SCHEMAS } from "#config/tableSchema.js";
import { updateTracking } from "#utils/trackingStatus.js";
import fs from "fs";
import xlsx from "xlsx";

export const createTempMapTable = async (fileType, filePath, jobId) => {
    try {
        if (!TABLE_SCHEMAS[fileType]) throw { message: "Invalid fileType schema.", code: 400 };

        updateTracking(jobId, { status: "processing" });

        // Get the table schema

        const { code: createTableSQL, rows: columnList } = TABLE_SCHEMAS[fileType];

        // Read the file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
            defval: "",
        });

        // Check if the file has data
        if (!jsonData.length) throw { message: "CSV has no data.", code: 400 };

        const tempTableName = `temp_${fileType}`;

        //Check if the table exists
        const [tableExists] = await mySqlPool.query(
            `SHOW TABLES LIKE '${tempTableName}'; `
        );

        // Create the table if it doesn't exist
        if (!tableExists.length) await mySqlPool.query(createTableSQL);

        //If the table isn't temp_psr_data, truncate the table
        if (["temp_channel_mapping", "temp_store_mapping"].includes(tempTableName))
            await mySqlPool.query(`TRUNCATE TABLE ${tempTableName};`);

        // Insert the data into the table
        const loadDataQuery = `
          LOAD DATA LOCAL INFILE ?
          INTO TABLE ${tempTableName}
          FIELDS TERMINATED BY ','
          LINES TERMINATED BY '\n'
          IGNORE 1 ROWS
          (${columnList.join(", ")});`;


        // Enable local_infile
        await mySqlPool.query("SET GLOBAL local_infile = 1;");

        // Load the data
        await mySqlPool.query({
            sql: loadDataQuery,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath),
        });

        // Update the tracking
        updateTracking(jobId, {
            status: "completed",
            completedTime: new Date(),
            rowsInserted: jsonData.length,
        });
    } catch (err) {
        console.error("🚫 Processing error:", err);
        updateTracking(jobId, { status: "failed", error: err.message });
    }
};