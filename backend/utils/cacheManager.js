import mySqlPool from "#config/db.js";
import fs from "fs/promises";
/** Helper function to read and validate cache */
const readCache = async (CACHE_FILE, VALID_TIME_SPAN) => {
  try {
    const fileData = await fs.readFile(CACHE_FILE, "utf-8");
    const cachedData = JSON.parse(fileData);
    // console.log(fileData);
    if (Date.now() - cachedData.timestamp < VALID_TIME_SPAN) {
      return cachedData.data;
    }
  } catch(error) {
    console.log("Error reading cache:", error);
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

/** Helper function to get cached data from MySQL */
const getCachedData = async (cacheKey) => {
  console.log("Getting cached data for:", cacheKey);
  const [[rows]] = await mySqlPool.query(
    "SELECT data FROM cachetable WHERE cache_key = ?",
    [cacheKey]
  );
  // console.log("Rows:", rows);
  return rows.data ? rows.data : null;
};

/** Helper function to update cache in MySQL */
const updateCache = async (cacheKey, jsonData) => {
  await mySqlPool.query(
    `INSERT INTO cachetable (cache_key, data) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE data = VALUES(data), last_updated = CURRENT_TIMESTAMP;`,
    [cacheKey, JSON.stringify(jsonData)]
  );
};

export { getCachedData, readCache, updateCache, writeCache };
