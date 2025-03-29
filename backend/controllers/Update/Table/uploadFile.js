import { createTempMapTable } from "#controllers/Create/createTempMapTable.js";
import { createTempPSRTable } from "#controllers/Create/createTempPSRTable.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { promises as fsPromises } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const CACHE_DIR = path.join(process.cwd(), "cache");

export const uploadFile = async (req, res) => {
  try {
    const file = req.files?.file;
    const { fileType } = req.body;

    if (!["channel_mapping", "psr_data", "store_mapping"].includes(fileType))
      throw {
        message:
          "Invalid fileType. Allowed: channel_mapping, psr_data, store_mapping",
        code: 400,
      };

    if (!file) throw { message: "No file uploaded.", code: 400 };
    if (file.mimetype !== "text/csv")
      throw { message: "Only CSV files are allowed.", code: 400 };

    const jobId = uuidv4();
    const fileName = `${jobId}_${file.name}`;
    const filePath = path.join(CACHE_DIR, fileName);

    updateTracking(jobId, {
      fileName,
      status: "pending",
      uploadTime: new Date(),
      fileType,
    });

    // ✅ Ensure cache directory exists (corrected async function)
    await fsPromises.mkdir(CACHE_DIR, { recursive: true });

    // ✅ Respond immediately while writing & processing in the background
    res.status(202).json({
      jobId,
      message: "✅ File uploaded and processing started.",
      filePath: fileName,
    });

    // ✅ Write file and process it asynchronously
    fsPromises.writeFile(filePath, file.data)
      .then(() => {
        if (fileType === "psr_data") {
          createTempPSRTable(filePath, jobId);
        } else {
          createTempMapTable(fileType, filePath, jobId);
        }

      })
      .catch((err) => {
        console.error("❌ Error writing file:", err);
        updateTracking(jobId, { status: "failed", error: err.message });
      });
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    res.status(error.code || 500).json({ message: error.message || error });
  }
};
