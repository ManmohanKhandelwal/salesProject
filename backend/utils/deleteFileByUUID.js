import fs from "fs";
import path from "path";
import { updateTracking } from "./trackingStatus.js";

const CACHE_DIR = path.join(process.cwd(), "cache");

export const deleteFileByUUID = (uuid) => {
  const files = fs.readdirSync(CACHE_DIR);
  const fileToDelete = files.find((file) => file.includes(uuid));

  if (fileToDelete) {
    fs.unlinkSync(path.join(CACHE_DIR, fileToDelete));
    console.log(`✅ File ${fileToDelete} deleted successfully.`);
    updateTracking(uuid, {
      status: "deleted",
      deleteTime: new Date(),
    });
  } else {
    console.log("🚫 No file found with the provided UUID.");
  }
};
