import mySqlPool from "#config/db.js"; // Ensure correct import
import { getCachedData } from "#utils/cacheManager.js";

const cacheKey = "top-stores-100";

export const getTopStores = async (req, res) => {
  try {
    let {
      branchName,
      startDate,
      endDate,
      topStoresCount,
      zoneManager,
      salesManager,
      offset,
    } = req.query;

    // Default values
    topStoresCount = parseInt(topStoresCount, 10) || 100;
    offset = parseInt(offset, 10) || 0;

    // If no filters are applied, check cache
    const shouldUseCache = !branchName && !zoneManager && !salesManager && !startDate && !endDate;

    // Check cache
    if (shouldUseCache) {
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return res.json({
          cached: true,
          cachedData: cachedData,
        });
      }
    }

    // Default date range (last 6 months) if not provided
    if (!startDate || !endDate) {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    }

    // **Build SQL Query Dynamically Based on Filters**
    let query = `
        SELECT
            psr.customer_code AS store_code,
            psr.customer_name AS store_name,
            store.New_Branch AS branch_name,
            psr.customer_type,
            psr.channel_description AS channel,
            SUM(psr.retailing) AS total_retailing,
            AVG(psr.retailing) AS avg_retailing
        FROM
        psr_data psr
        JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
        WHERE psr.document_date BETWEEN ? AND ?
    `;

    let queryParams = [startDate, endDate];

    // Apply optional filters
    if (branchName) {
      query += ` AND store.New_Branch = ?`;
      queryParams.push(branchName);
    }
    if (zoneManager) {
      query += ` AND store.ZM = ?`;
      queryParams.push(zoneManager);
    }
    if (salesManager) {
      query += ` AND store.SM = ?`;
      queryParams.push(salesManager);
    }

    // Grouping, ordering, and limiting results
    query += `
        GROUP BY
            psr.customer_code,
            psr.customer_name,
            store.New_Branch,
            psr.customer_type,
            psr.channel_description
        ORDER BY
            avg_retailing DESC
        LIMIT ? OFFSET ?;
    `;

    queryParams.push(topStoresCount, offset);

    // **Query Database**
    const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    res.json({
      cached: false,
      cachedData: topStoresDetails,
    });

  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
