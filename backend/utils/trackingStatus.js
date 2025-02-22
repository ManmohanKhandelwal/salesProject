import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache");
const TRACKING_FILE = path.join(process.cwd(), "tracking.json");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

// Initialize tracking.json if it doesn't exist
if (!fs.existsSync(TRACKING_FILE)) {
  fs.writeFileSync(TRACKING_FILE, JSON.stringify({}, null, 2));
}
export const updateTracking = (jobId, data) => {
  const tracking = JSON.parse(fs.readFileSync(TRACKING_FILE));
  tracking[jobId] = { ...(tracking[jobId] || {}), ...data };
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(tracking, null, 2));
};
