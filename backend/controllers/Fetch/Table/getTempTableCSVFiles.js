import fs from "fs";
import path from "path";

// ✅ Define IST Offset (+5:30 from GMT)
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
const CACHE_DIR = path.join(process.cwd(), "cache");

// ✅ Function to Convert GMT to IST
const convertToIST = (date) => {
  const gmtDate = new Date(date);
  const istDate = new Date(gmtDate.getTime());
  return istDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Format for India
};

export const getTempTableCSVFiles = async (req, res) => {
  try {
    // Check if cache directory exists, if not, return empty response
    if (!fs.existsSync(CACHE_DIR)) {
      return res.status(200).json({ message: "No temporary files found." });
    }

    // Read file names in CACHE_DIR and get full metadata
    const tempTableDetails = fs.readdirSync(CACHE_DIR).map((file) => {
      const filePath = path.join(CACHE_DIR, file); // Get full file path
      const stats = fs.statSync(filePath); // Get file metadata

      // Convert file size dynamically to KB or MB
      let fileSizeFormatted;
      if (stats.size < 1024 * 1024) {
        fileSizeFormatted = (stats.size / 1024).toFixed(2) + " KB"; // Convert to KB if less than 1MB
      } else {
        fileSizeFormatted = (stats.size / (1024 * 1024)).toFixed(2) + " MB"; // Convert to MB if 1MB+
      }

      const [jobId, ...fileParts] = file.split("_"); // Extract Job ID & Filename
      return {
        jobId,
        fileName: fileParts.join("_"), // Preserve full filename
        fileSize: fileSizeFormatted, // Dynamically formatted size
        uploadedAt: convertToIST(stats.birthtime), // Convert to IST
        lastModified: convertToIST(stats.mtime), // Convert to IST
      };
    });

    return res.status(200).json(tempTableDetails);
  } catch (error) {
    console.error("❌ Error in getTempTableCSVFiles:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve temp table details." });
  }
};
