import { top100StoresQuery } from "#commands/Store/top100StoreCache.js";
import mySqlPool from "#config/db.js";
import { updateCache } from "#utils/cacheManager.js";

const CACHE_KEY_TOP_100_STORE = 'top-stores-100';
export const updateTop100StoreCache = async (startDate, endDate) => {
    try {
        // Default date range (last 6 months) if not provided
        if (!startDate) {
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
                .toISOString()
                .split("T")[0];
            endDate = new Date().toISOString().split("T")[0];
        }
        if (!endDate) endDate = new Date().toISOString().split("T")[0];

        const [result] = await mySqlPool.query(top100StoresQuery, [startDate, endDate])
        await updateCache(CACHE_KEY_TOP_100_STORE, result);
        return result;

    } catch (error) {
        console.error("Error updating top 100 store cache:", error?.message || error);
        res.status(error?.status || 500).json({ error: error?.message || error });
    }
}