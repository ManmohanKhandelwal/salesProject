import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import mySqlPool from "#config/db.js";
import { updateTracking } from "#utils/trackingStatus.js";
export const insertNewData = async (req, res) => {
  const file = req.files?.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  if (file.mimetype !== "text/csv") {
    return res.status(400).json({ message: "Only CSV files are allowed." });
  }

  const jobId = uuidv4();
  const fileName = `${jobId}_${file.name}`;
  const filePath = path.join(CACHE_DIR, fileName);

  try {
    // Save the CSV file to the cache directory
    fs.writeFileSync(filePath, file.data);

    // Initialize tracking
    updateTracking(jobId, {
      fileName,
      status: "pending",
      uploadTime: new Date().toISOString(),
    });

    // Asynchronous processing
    (async () => {
      try {
        updateTracking(jobId, { status: "processing" });

        // Read and parse CSV file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
          defval: "",
        });

        if (!jsonData.length) {
          throw new Error("CSV file is empty or improperly formatted.");
        }

        // Check if temp table exists and drop it if present
        const [tableExists] = await mySqlPool.query("SHOW TABLES LIKE 'temp_psr_data'");

        if (tableExists.length) {
          await mySqlPool.query("DROP TABLE temp_psr_data");
        }

        // Create temp_psr_data table
        await mySqlPool.query(`
          CREATE TABLE temp_psr_data (
            psr_id INT PRIMARY KEY AUTO_INCREMENT,
            document_no VARCHAR(45),
            document_date DATE,
            subbrandform_name VARCHAR(90),
            customer_name VARCHAR(120),
            customer_code VARCHAR(45),
            channel_description VARCHAR(45),
            customer_type VARCHAR(90),
            category VARCHAR(45),
            brand VARCHAR(45),
            brandform VARCHAR(45),
            retailing DECIMAL(12, 2)
          )
        `);

        // Prepare CSV file with correct line endings
        const cleanedData = file.data.toString().replace(/\r\n/g, "\n");
        fs.writeFileSync(filePath, cleanedData);

        // Load data into temp_psr_data using streamFactory (required by mysql2 v2.0+)
        const connection = await mySqlPool.getConnection();
        try {
          await connection.query("SET GLOBAL local_infile = 1;");

          await connection.query({
            sql: `
              LOAD DATA LOCAL INFILE ?
              INTO TABLE temp_psr_data
              FIELDS TERMINATED BY ','
              LINES TERMINATED BY '\n'
              IGNORE 1 ROWS
              (document_no, document_date, subbrandform_name, customer_name, customer_code, channel_description, customer_type, category, brand, brandform, retailing);
            `,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath),
          });

          updateTracking(jobId, {
            status: "completed",
            completedTime: new Date().toISOString(),
            rowsInserted: jsonData.length,
          });
        } finally {
          connection.release();
        }
      } catch (err) {
        console.error("🚫 Processing error:", err);
        updateTracking(jobId, { status: "failed", error: err.message });
      }
    })();

    // Respond with job ID for tracking
    res.status(202).json({
      jobId,
      message: "File upload successful. Processing started.",
      filePath : fileName
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Internal server error." });
    updateTracking(jobId, { status: "failed", error: error.message });
  }
};

