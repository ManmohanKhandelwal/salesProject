// ✅ Dependencies
import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import mySqlPool from "#config/db.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { TABLE_SCHEMAS } from "#config/tableSchema.js";

const CACHE_DIR = path.join(process.cwd(), "cache");

export const insertNewData = async (req, res) => {
  try {
    const file = req.files?.file; // ✅ Correct way to access uploaded file
    const { fileType } = req.body;

    if (!["channel_mapping", "psr_data", "store_mapping"].includes(fileType)) {
      throw {
        message:
          "Invalid fileType. Allowed: channel_mapping, psr_data, store_mapping",
        code: 400,
      };
    }

    if (!file) throw { message: "No file uploaded.", code: 400 };
    if (file.mimetype !== "text/csv")
      throw { message: "Only CSV files are allowed.", code: 400 };
    if (!TABLE_SCHEMAS[fileType])
      throw { message: "Invalid fileType schema.", code: 400 };

    // Get File Metadata
    const jobId = uuidv4();
    const fileName = `${jobId}_${file.name}`;
    const filePath = path.join(CACHE_DIR, fileName);

    // ✅ Save file to cache
    fs.writeFileSync(filePath, file.data);
    updateTracking(jobId, {
      fileName,
      status: "pending",
      uploadTime: new Date(),
    });

    // ✅ Process file asynchronously
    (async () => {
      insertInBackground(fileType, filePath, jobId);
    })();

    res.status(202).json({
      jobId,
      message: "✅ File uploaded and processing started.",
      filePath: fileName,
    });
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    res.status(error.code || 500).json({ message: error.message || error });
  }
};

// ✅ Dependencies InsertIn Background
const insertInBackground = async (fileType, filePath, jobId) => {
  try {
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
      `SHOW TABLES LIKE '%${tempTableName}%'; `
    );

    // Create the table if it doesn't exist
    if (!tableExists.length) await mySqlPool.query(createTableSQL);

    //If the table isn't temp_psr_data, truncate the table
    if (["temp_channel_mapping", "temp_store_mapping"].includes(tempTableName))
      await mySqlPool.query(`TRUNCATE TABLE ${tempTableName};`);

    // Insert the data into the table
    let loadDataQuery = "";
    if (tempTableName === "temp_psr_data") {
      loadDataQuery = `
        LOAD DATA LOCAL INFILE ?
        INTO TABLE ${tempTableName}
        FIELDS TERMINATED BY ','
        LINES TERMINATED BY '\n'
        IGNORE 1 ROWS
        (document_no, @raw_date, subbrandform_name, customer_name, customer_code, channel_description, customer_type, category, brand, brandform, retailing)
        SET document_date = STR_TO_DATE(@raw_date, '%d-%m-%Y');
      `;
    } else {
      loadDataQuery = `
        LOAD DATA LOCAL INFILE ?
        INTO TABLE ${tempTableName}
        FIELDS TERMINATED BY ','
        LINES TERMINATED BY '\n'
        IGNORE 1 ROWS
        (${columnList.join(", ")});`;
    }

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
