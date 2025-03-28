import {
  getCachedData
} from "#utils/cacheManager.js";

const CACHE_KEY_DASHBOARD = "sales-dashboard";

/** Optimized function to fetch dashboard data */
export const getDashBoardData = async (req, res) => {
  try {
    // Check if data is cached
    const cachedData = await getCachedData(CACHE_KEY_DASHBOARD);
    if (cachedData) return res.status(200).json(cachedData);

  } catch (error) {
    console.error("Error fetching dashboard data:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
