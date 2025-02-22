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
    console.log(req.body)
    const file = req.files?.file; // ✅ Correct way to access uploaded file
    const { fileType } = req.body;

    console.log("📁 Uploaded file:", file?.name);
    console.log("📂 File type:", fileType);

    if (!["channel_mapping", "psr_data", "store_mapping"].includes(fileType)) {
      throw { message: "Invalid fileType. Allowed: channel_mapping, psr_data, store_mapping", code: 400 };
    }

    if (!file) throw { message: "No file uploaded.", code: 400 };
    if (file.mimetype !== "text/csv") throw { message: "Only CSV files are allowed.", code: 400 };
    if (!TABLE_SCHEMAS[fileType]) throw { message: "Invalid fileType schema.", code: 400 };

    const { code: createTableSQL, rows: columnList } = TABLE_SCHEMAS[fileType];
    const jobId = uuidv4();
    const fileName = `${jobId}_${file.name}`;
    const filePath = path.join(CACHE_DIR, fileName);

    // ✅ Save file to cache
    fs.writeFileSync(filePath, file.data);
    updateTracking(jobId, { fileName, status: "pending", uploadTime: new Date() });

    // ✅ Process file asynchronously
    (async () => {
      try {
        updateTracking(jobId, { status: "processing" });

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

        if (!jsonData.length) throw { message: "CSV has no data.", code: 400 };

        const tempTableName = `temp_${fileType}`;
        const [tableExists] = await mySqlPool.query(`SELECT * FROM ${tempTableName}`);
        console.log("📊 Table exists:", tableExists);
        if (tableExists.length) await mySqlPool.query(`DROP TABLE ${tempTableName}`);
        await mySqlPool.query(createTableSQL);

        const connection = await mySqlPool.getConnection();
        try {
          await connection.query("SET GLOBAL local_infile = 1;");

          await connection.query({
            sql: `
              LOAD DATA LOCAL INFILE ?
              INTO TABLE ${tempTableName}
              FIELDS TERMINATED BY ','
              LINES TERMINATED BY '\n'
              IGNORE 1 ROWS
              (${columnList.join(", ")});
            `,
            values: [filePath],
            infileStreamFactory: () => fs.createReadStream(filePath),
          });

          updateTracking(jobId, {
            status: "completed",
            completedTime: new Date(),
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
