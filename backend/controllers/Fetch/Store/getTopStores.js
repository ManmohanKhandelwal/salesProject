
import mySqlPool from "#config/db.js"; // Ensure correct import
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData } from "#utils/cacheManager.js";


export const getTopStores = async (req, res) => {
  try {
    let {
      branchName,
      topStoresCount,
      zoneManager,
      salesManager,
      branchExecutive,
      categoryName,
      brandName,
      brandFormName,
      broadChannelName,
      offset,
    } = req.query;
    // Default values
    topStoresCount = parseInt(topStoresCount, 10) || 100;
    offset = parseInt(offset, 10) || 0;

    // const shouldUseCache = filters.every(filter => !filter);
    const shouldUseCache = branchName && topStoresCount && zoneManager && salesManager && branchExecutive && categoryName && brandName && brandFormName && broadChannelName;

    // Check cache
    if (!shouldUseCache) {
      const cachedData = await getCachedData(DB_CACHE_KEYS.TOP_100_STORE);
      if (cachedData) {
        return res.json({
          cached: true,
          cachedData: cachedData,
        });
      }
    }
    // **Build SQL Query Dynamically Based on Filters**
    let query = `
    WITH Last_Three_Months AS (
        SELECT DISTINCT
            DATE_FORMAT(document_date, '%Y-%m') AS month
        FROM psr_data
        ORDER BY month DESC
        LIMIT 3
    )
    SELECT
        psr.customer_code AS store_code,
        psr.customer_name AS store_name,
        store.New_Branch AS branch_name,
        psr.customer_type,
        psr.channel_description AS channel,
        SUM(psr.retailing) AS total_retailing,
        SUM(psr.retailing) / COUNT(DISTINCT DATE_FORMAT(psr.document_date, '%Y-%m')) AS avg_retailing
    FROM psr_data psr
    JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
    ${broadChannelName ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type" : ""}
    WHERE DATE_FORMAT(psr.document_date, '%Y-%m') IN (
        SELECT month FROM Last_Three_Months
    )`;

    let queryParams = [];

    // Apply optional filters
    const queryFilters = [
      { field: "store.New_Branch", value: branchName },
      { field: "store.ZM", value: zoneManager },
      { field: "store.SM", value: salesManager },
      { field: "store.BE", value: branchExecutive },
      { field: "psr.category", value: categoryName },
      { field: "psr.brand", value: brandName },
      { field: "psr.brandform", value: brandFormName },
      { field: "cm.broad_channel", value: broadChannelName },
    ];

    queryFilters.forEach(({ field, value }) => {
      if (value) {
        query += ` AND ${field} = ?`;
        queryParams.push(value);
      }
    });



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
