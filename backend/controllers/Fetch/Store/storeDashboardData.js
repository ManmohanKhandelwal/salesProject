import { TIME_TO_UPDATE_CACHE_STORE } from "#config/constant.js";
import mySqlPool from "#config/db.js";
import { readCache, writeCache } from "#utils/cacheManager.js";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache", "store");
const CACHE_FILE = path.join(CACHE_DIR, "dashboardData.json");

export const getStoreDashBoardData = async (req, res) => {
  try {
    const cachedData = await readCache(CACHE_FILE, TIME_TO_UPDATE_CACHE_STORE);
    if (cachedData) return res.status(200).json(cachedData);

    // Fetch total store count
    const [[{ storeCount }]] = await mySqlPool.query(
      "SELECT COUNT(*) AS storeCount FROM store_mapping"
    );

    // Calculate highest and lowest retailing stores
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
            (SELECT total_retailing FROM CustomerEarnings ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_amount;`
    );

    // Total retailing amount under each Zone Manager (zm)
    const [zoneManagerRetailing] = await mySqlPool.query(
      `SELECT sm.ZM AS zone_manager, SUM(p.retailing) AS total_retailing
       FROM psr_data p
       JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code
       GROUP BY sm.ZM;`
    );

    // Total retailing amount under each Business Executive (be)
    const [businessExecutiveRetailing] = await mySqlPool.query(
      `SELECT sm.BE AS business_executive, SUM(p.retailing) AS total_retailing
       FROM psr_data p
       JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code
       GROUP BY sm.BE;`
    );

    // Count of stores in each branch
    const [storeCountByBranch] = await mySqlPool.query(
      `SELECT New_Branch AS branch, COUNT(*) AS store_count FROM store_mapping GROUP BY New_Branch;`
    );

    // Cache the response
    const responseData = {
      storeCount,
      storeRevenueStats,
      zoneManagerRetailing,
      businessExecutiveRetailing,
      storeCountByBranch,
    };

    await writeCache(CACHE_DIR, CACHE_FILE, responseData);

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching store dashboard data:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
