import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData } from "#utils/cacheManager.js";

// ✅ Only check meaningful filters (excluding topStoresCount & offset)
const isTruthyFilter = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

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
      startDate = "",
      endDate = "",
      offset = 0,
    } = req.body; // ✅ Use req.query instead of req.params

    const filters = [
      branchName,
      zoneManager,
      salesManager,
      branchExecutive,
      categoryName,
      brandName,
      brandFormName,
      broadChannelName,
      startDate,
      endDate,
    ];

    const shouldNotUseCache = filters.some(isTruthyFilter);

    console.log("Request Body : ", req.body);
    console.log("Should Use Cache ? :--- ", !shouldNotUseCache);

    // ✅ Use cache only when no filters are applied
    if (!shouldNotUseCache) {
      const cachedData = await getCachedData(DB_CACHE_KEYS.TOP_100_STORE);
      if (cachedData) {
        return res.json({ cached: true, cachedData });
      }
    }
    let query = "";
    if (startDate && endDate) {
      query = `
        WITH
            Filtered_Months AS (
              SELECT DISTINCT
                DATE_FORMAT (document_date, '%Y-%m') AS month
              FROM
                psr_data
              WHERE
                document_date BETWEEN '${startDate}' AND '${endDate}'
            ),
            Month_Count AS (
              SELECT
                COUNT(*) AS month_count
              FROM
                Filtered_Months
            )
          SELECT
            psr.customer_code AS store_code,
            psr.customer_name AS store_name,
            store.New_Branch AS branch_name,
            psr.customer_type,
            psr.channel_description AS channel,
            SUM(psr.retailing) AS total_retailing,
            SUM(psr.retailing) / COUNT(DISTINCT DATE_FORMAT(psr.document_date, '%Y-%m')) AS avg_retailing
          FROM
            psr_data psr
            JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
            ${
              broadChannelName.length
                ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type"
                : ""
            }
          WHERE
            DATE_FORMAT (psr.document_date, '%Y-%m') IN (
              SELECT
                month
              FROM
                Filtered_Months
            )
      `;
    } else {
      query = `
    WITH
      Last_Three_Months AS (
          SELECT DISTINCT
              DATE_FORMAT (document_date, '%Y-%m') AS month
          FROM
              psr_data
          ORDER BY
              month DESC
          LIMIT
              3
      )
  SELECT
      psr.customer_code AS store_code,
      psr.customer_name AS store_name,
      store.New_Branch AS branch_name,
      psr.customer_type,
      psr.channel_description AS channel,
      SUM(psr.retailing) AS total_retailing,
      SUM(psr.retailing) / COUNT(DISTINCT DATE_FORMAT (psr.document_date, '%Y-%m')) AS avg_retailing
  FROM
      psr_data psr
      JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
      ${
        broadChannelName.length
          ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type"
          : ""
      }
  WHERE
      DATE_FORMAT (psr.document_date, '%Y-%m') IN (
          SELECT
              month
          FROM
              Last_Three_Months
      )`;
    }
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
      } else if (type === "string") {
        // Handle string values
        queryConditions.push(`${field} = ?`);
        queryParams.push(value);
      }
    });

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

    res.status(200).json({ cached: false, cachedData: topStoresDetails });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
