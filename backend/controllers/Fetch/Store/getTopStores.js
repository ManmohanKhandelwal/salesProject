import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData } from "#utils/cacheManager.js";
/**
 * 
 * @param {String} branchName
 * @param {Number} topStoresCount
 * @param {String} zoneManager
 * @param {String} salesManager
 * @param {String} branchExecutive
 * @param {Array} categoryName 
 * @param {Array} brandName
 * @param {Array} brandFormName
 * @param {Array} broadChannelName
 * @param {Number} offset
 * @returns 
 */
export const getTopStores = async (req, res) => {
  try {
    let {
      branchName = "",
      topStoresCount = 100,
      zoneManager = "",
      salesManager = "",
      branchExecutive = "",
      categoryName = [],
      brandName = [],
      brandFormName = [],
      broadChannelName = [],
      offset = 0,
    } = req.body; // ✅ Use req.query instead of req.params

    // ✅ Only check meaningful filters (excluding topStoresCount & offset)
    const filters = [
      branchName,
      zoneManager,
      salesManager,
      branchExecutive,
      categoryName,
      brandName,
      brandFormName,
      broadChannelName
    ];

    const shouldNotUseCache = filters.some(filter => filter);

    console.log("query", req.query);
    console.log("shouldNotUseCache", shouldNotUseCache);

    // ✅ Use cache only when no filters are applied
    if (!shouldNotUseCache) {
      console.log("Getting cached data for:", DB_CACHE_KEYS.TOP_100_STORE);
      const cachedData = await getCachedData(DB_CACHE_KEYS.TOP_100_STORE);
      if (cachedData) {
        return res.json({ cached: true, cachedData });
      }
    }

    // ✅ **SQL Query with Dynamic Filters**
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
    ${broadChannelName.length ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type" : ""}
    WHERE DATE_FORMAT(psr.document_date, '%Y-%m') IN (SELECT month FROM Last_Three_Months)`;

    let queryParams = [];
    let queryConditions = [];

    const queryFilters = [
      { field: "store.New_Branch", value: branchName, type: "string" },
      { field: "store.ZM", value: zoneManager, type: "string" },
      { field: "store.SM", value: salesManager, type: "string" },
      { field: "store.BE", value: branchExecutive, type: "string" },
      { field: "psr.category", value: categoryName, type: "array" },
      { field: "psr.brand", value: brandName, type: "array" },
      { field: "psr.brandform", value: brandFormName, type: "array" },
      { field: "cm.broad_channel", value: broadChannelName, type: "array" },
    ];

    // Build Query Conditions
    queryFilters.forEach(({ field, value, type }) => {
      if (!value) return; // Skip if value is empty
      if (Array.isArray(value) && value.length > 0 && type === "array") {
        // Handle array values
        queryConditions.push(`${field} IN (?)`);
        queryParams.push(value);
      }
      else if (type === "string") {
        // Handle string values
        queryConditions.push(`${field} = ?`);
        queryParams.push(value);
      }
    }
    );

    // **Final Query Construction**
    if (queryConditions.length > 0) {
      query += " AND " + queryConditions.join(" AND ");
    }

    // ✅ **Final Query Structure**
    query += `
    GROUP BY
        psr.customer_code,
        psr.customer_name,
        store.New_Branch,
        psr.customer_type,
        psr.channel_description
    ORDER BY
        avg_retailing DESC
    LIMIT ? OFFSET ?;`;

    queryParams.push(topStoresCount, offset);

    console.log("Query Params", queryParams);
    console.log("Query", query);

    // ✅ **Execute Database Query**
    const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    res.json({ cached: false, cachedData: topStoresDetails });

  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || "Internal Server Error" });
  }
};
