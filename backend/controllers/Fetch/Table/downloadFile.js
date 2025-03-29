import path from "path";
import fs from "fs";

export const downloadFile = async (req, res) => {
  try {
    const { jobId, fileName } = req.body;

    if (!jobId || !fileName) throw { message: "Job ID and File Name are required!", status: 400 };

    // Construct the path to the file inside the `/backend/cache/` directory
    const filePath = path.join(process.cwd(), "cache", jobId+'_'+fileName);
    // console.log("filePath", filePath);
    // Check if file exists
    if (!fs.existsSync(filePath)) throw{ message: "File not found!" , status: 404};

    // Send file for download
    res.download(filePath);
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};
