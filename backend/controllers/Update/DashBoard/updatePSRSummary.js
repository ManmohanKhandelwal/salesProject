import {
  branchDetailsQuery,
  brandDetailsQuery,
  retailingSumQuery,
} from "#commands/psrTable/psrCacheQuery.js";

import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData, updateCache } from "#utils/cacheManager.js";


export const updatePSRSummary = async (req, res) => {
  try {
    // Import queries from commands & run it to update the dashboard summary in cacheTable Table.
    const [[retailingSumResult], [branchDetailsResult], [brandDetaisResult]] =
      await Promise.all([
        mySqlPool.query(retailingSumQuery),
        mySqlPool.query(branchDetailsQuery),
        mySqlPool.query(brandDetailsQuery),
      ]);

    //Restructure the updated summary info.
    const updatedSummaryInfo = {
      retailing_sum: retailingSumResult?.[0]?.retailing_sum,
      highest_retailing_branch: branchDetailsResult?.[0]?.New_Branch,
      highest_retailing_branch_value: branchDetailsResult?.[0]?.total_retailing,
      highest_retailing_brand: brandDetaisResult?.[0]?.brand,
      highest_retailing_brand_value: brandDetaisResult?.[0]?.total_retailing,
    };
    console.log("Updated summary info:", updatedSummaryInfo);

    // Update the cacheTable with the updated summary info.
    await updateCache(DB_CACHE_KEYS.PSR_SUMMARY, updatedSummaryInfo);
    const result = await getCachedData(DB_CACHE_KEYS.PSR_SUMMARY);
    return res
      .status(200)
      .json({ message: "Dashboard summary updated", result });
  } catch (error) {
    console.error("Error updating dashboard summary:", error);
    return res.status(500).json({ message: error.message });
  }
};
