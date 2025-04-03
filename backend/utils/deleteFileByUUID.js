import fs from "fs";
import path from "path";
import { updateTracking } from "./trackingStatus.js";

const CACHE_DIR = path.join(process.cwd(), "cache");

export const deleteFileByUUID = (uuid) => {
  const files = fs.readdirSync(CACHE_DIR);
  const fileToDelete = files.find((file) => file.includes(uuid));

  if (fileToDelete) {
    fs.unlinkSync(path.join(CACHE_DIR, fileToDelete));
    console.info(`✅ File ${fileToDelete} deleted successfully.`);
    updateTracking(uuid, {
      status: "deleted",
      deleteTime: new Date(),
    });
  } else {
    console.warn("🚫 No file found with the provided UUID.");
  }
};
