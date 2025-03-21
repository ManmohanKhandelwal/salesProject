import mySqlPool from "#config/db.js"; // Ensure correct import
import { getCachedData, updateCache } from "#utils/cacheManager.js";

export const getTopStores = async (req, res) => {
  let {
    branchName,
    startDate,
    endDate,
    topStoresCount,
    zoneManager,
    salesManager,
    offset,
  } = req.query;

  try {
    // Default date range (last 6 months)
    if (!startDate || !endDate) {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    }

    // Default values
    topStoresCount = parseInt(topStoresCount, 10) || 20;
    offset = parseInt(offset, 10) || 0;

    // Cache only when branchName is not provided
    const shouldCache = !branchName;
    const cacheKey = shouldCache ? "topStores_all" : null;

    if (shouldCache) {
      // Enforce top 100 stores for caching
      topStoresCount = 100;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return res.json({
          cached: true,
          branchName,
          startDate,
          endDate,
          topStoresCount,
          zoneManager,
          salesManager,
          offset,
          cachedData,
        });
      }
    }

    // **Build SQL Query**
    let query = `
    SELECT 
      psr.customer_code AS store_code,
      psr.customer_name AS store_name,
      psr.channel_description AS channel,
      AVG(psr.retailing) AS avg_retailing
    FROM psr_data psr
    JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
    WHERE psr.document_date BETWEEN ? AND ?
  `;

    let queryParams = [startDate, endDate];

    if (branchName) {
      query += " AND store.New_Branch = ?";
      queryParams.push(branchName);
    }
    if (zoneManager) {
      query += " AND store.ZM = ?";
      queryParams.push(zoneManager);
    }
    if (salesManager) {
      query += " AND store.SM = ?";
      queryParams.push(salesManager);
    }

    query += `
    GROUP BY psr.customer_code, psr.customer_name, psr.channel_description
    ORDER BY avg_retailing DESC
    LIMIT ? OFFSET ?;
  `;

    queryParams.push(topStoresCount, offset);

    // **Query Database**
    const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    // **Store in Cache if no branchName**
    if (shouldCache) {
      await updateCache(cacheKey, topStoresDetails);
    }

    res.json({
      cached: false,
      branchName,
      startDate,
      endDate,
      topStoresCount,
      zoneManager,
      salesManager,
      offset,
      topStoresDetails,
    });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
