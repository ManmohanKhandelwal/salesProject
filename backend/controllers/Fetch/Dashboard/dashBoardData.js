import { DB_CACHE_KEYS } from "#config/key.js";
import {
  getCachedData
} from "#utils/cacheManager.js";


/** Optimized function to fetch dashboard data */
export const getDashBoardData = async (req, res) => {
  try {
    // Check if data is cached
    const cachedData = await getCachedData(DB_CACHE_KEYS.SALES_DASHBOARD);
    if (cachedData) return res.status(200).json(cachedData);

  } catch (error) {
    console.error("Error fetching dashboard data:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
