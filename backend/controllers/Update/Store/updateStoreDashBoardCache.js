import { businessExecutiveRetailingQuery, storeRevenueStatsQuery, zoneManagerRetailingQuery } from "#commands/Store/storeDashboardCacheQuery.js";
import mySqlPool from "#config/db.js";
import { updateCache } from "#utils/cacheManager.js";

const cacheKey = "store-dashboard";

export const updateStoreDashBoardCache = async (req, res) => {
    try {
        // Fetch total store count
        const [[{ storeCount }]] = await mySqlPool.query(
            "SELECT COUNT(*) AS storeCount FROM store_mapping"
        );

        // Calculate highest and lowest retailing stores
        const [[storeRevenueStats]] = await mySqlPool.query(storeRevenueStatsQuery);

        // Total retailing amount under each Zone Manager (zm)
        const [zoneManagerRetailing] = await mySqlPool.query(zoneManagerRetailingQuery);

        // Total retailing amount under each Business Executive (be)
        const [businessExecutiveRetailing] = await mySqlPool.query(businessExecutiveRetailingQuery);

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

        // await writeCache(CACHE_DIR, CACHE_FILE, responseData);
        await updateCache(cacheKey, responseData);

        res.json(responseData);
    }
    catch (error) {
        console.error(
            "Error updating store dashboard cache:",
            error?.message || error
        );
        res.status(error?.status || 500).json({ error: error?.message || error });
    }
}