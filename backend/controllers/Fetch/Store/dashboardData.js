import { TIME_TO_UPDATE_CACHE_STORE } from "#config/constant.js";
import mySqlPool from "#config/db.js";
import { readCache, writeCache } from "#utils/cacheManager.js";
import path from "path";
const CACHE_DIR = path.join(process.cwd(), "cache", "store");
const CACHE_FILE = path.join(CACHE_DIR, "dashboardData.json");

export const getStoreDashBoardData = async (req, res) => {
  // Total no. of stores, YoY growth in no. of stores
  try {
    // Check cache first
    const cachedData = await readCache(CACHE_FILE, TIME_TO_UPDATE_CACHE_STORE);
    if (cachedData) return res.status(200).json(cachedData);
    const [[{storeCount}]] = await mySqlPool.query(
      "SELECT COUNT(*) AS storeCount FROM store_mapping"
    );
    //Calculate Highest retailing Store & Lowest retailing Store
    const [[storeRevenueStats]] = await mySqlPool.query(
      `WITH CustomerEarnings AS (
            SELECT 
                p.customer_name,
                SUM(p.retailing) AS total_retailing
            FROM psr_data p
            GROUP BY p.customer_name
        )
        SELECT 
            (SELECT customer_name FROM CustomerEarnings ORDER BY total_retailing DESC LIMIT 1) AS highest_earning_customer,
            (SELECT total_retailing FROM CustomerEarnings ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_amount,
            (SELECT customer_name FROM CustomerEarnings ORDER BY total_retailing ASC LIMIT 1) AS lowest_earning_customer,
            (SELECT total_retailing FROM CustomerEarnings ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_amount;

`
    );

    // Cache the response
    await writeCache(CACHE_DIR, CACHE_FILE, {
      storeCount: storeCount,
      storeRevenueStats,
    });

    res.json({
      storeCount,
      storeRevenueStats,
    });
  } catch (error) {
    console.error("Error fetching store count:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
