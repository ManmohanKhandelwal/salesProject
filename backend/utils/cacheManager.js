import fs from "fs/promises";
/** Helper function to read and validate cache */
const readCache = async (CACHE_FILE, VALID_TIME_SPAN) => {
  try {
    const fileData = await fs.readFile(CACHE_FILE, "utf-8");
    const cachedData = JSON.parse(fileData);
    if (Date.now() - cachedData.timestamp < VALID_TIME_SPAN) {
      return cachedData.data;
    }
  } catch {
    console.log("Cache not found or expired, fetching new data...");
  }
  return null;
};

/** Helper function to write cache */
const writeCache = async (CACHE_DIR, CACHE_FILE, data) => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), data }),
      "utf-8"
    );
  } catch (err) {
    console.error("Error writing cache:", err);
    throw { message: "Error writing cache", status: 500 };
  }
};
export { readCache, writeCache };
