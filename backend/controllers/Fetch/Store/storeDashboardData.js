import { getCachedData } from "#utils/cacheManager.js";

const cacheKey = "store-dashboard";

export const getStoreDashBoardData = async (req, res) => {
  try {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) return res.status(200).json(cachedData);
  } catch (error) {
    console.error(
      "Error fetching store dashboard data:",
      error?.message || error
    );
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
