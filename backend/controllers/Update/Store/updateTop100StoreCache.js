import { top100StoresQuery } from "#commands/Store/top100StoreCacheQuery.js";
import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { updateCache } from "#utils/cacheManager.js";

export const updateTop100StoreCache = async () => {
    try {
        const [result] = await mySqlPool.query(top100StoresQuery);
        await updateCache(DB_CACHE_KEYS.TOP_100_STORE, result);
        return result;

    } catch (error) {
        console.error("Error updating top 100 store cache:", error?.message || error);
        res.status(error?.status || 500).json({ error: error?.message || error });
    }
}