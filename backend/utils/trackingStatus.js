import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache");
const TRACKING_FILE = path.join(process.cwd(), "tracking.json");

// ✅ Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// ✅ Function to safely read tracking file
const readTrackingFile = () => {
  try {
    if (!fs.existsSync(TRACKING_FILE)) {
      fs.writeFileSync(TRACKING_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    
    const data = fs.readFileSync(TRACKING_FILE, "utf8");
    
    return data.trim() ? JSON.parse(data) : {}; // ✅ Handle empty file
  } catch (error) {
    console.error("⚠️ Error reading tracking file:", error);
    return {}; // ✅ Return empty object if file is corrupted
  }
};

// ✅ Update tracking function with error handling
export const updateTracking = (jobId, data) => {
  try {
    const tracking = readTrackingFile();
    tracking[jobId] = { ...(tracking[jobId] || {}), ...data };

    fs.writeFileSync(TRACKING_FILE, JSON.stringify(tracking, null, 2));
  } catch (error) {
    console.error("❌ Error updating tracking file:", error);
  }
};
