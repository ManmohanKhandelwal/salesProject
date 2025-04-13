import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData } from "#utils/cacheManager.js";

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
    } = req.body;

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

    if (!shouldNotUseCache) {
      const cachedData = await getCachedData(DB_CACHE_KEYS.TOP_100_STORE);
      if (cachedData) {
        return res.json({ cached: true, cachedData });
      }
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required." });
    }

    // Step 1: Get all months in the range
    const [monthsResult] = await mySqlPool.query(
      `SELECT DISTINCT DATE_FORMAT(document_date, '%Y-%m') AS month FROM psr_data 
       WHERE document_date BETWEEN ? AND ? 
       ORDER BY month ASC`,
      [startDate, endDate]
    );
    const months = monthsResult.map((row) => row.month);
    const monthCount = months.length;

    // Step 2: Dynamic SUM(CASE ...) for each month
    const monthlyColumns = months
      .map((month) => {
        const alias = new Date(`${month}-01`)
          .toLocaleString("default", { month: "long", year: "numeric" })
          .toLowerCase()
          .replace(" ", "_");
        return `SUM(CASE WHEN DATE_FORMAT(psr.document_date, '%Y-%m') = '${month}' THEN psr.retailing ELSE 0 END) AS \`${alias}\``;
      })
      .join(",\n");

    // Step 3: Base Query
    let query = `
      SELECT
        psr.customer_code AS store_code,
        MAX(psr.customer_name) AS store_name,
        store.New_Branch AS branch_name,
        psr.customer_type,
        psr.channel_description AS channel,
        ${monthlyColumns},
        SUM(psr.retailing) AS total_retailing,
        SUM(psr.retailing) / ${monthCount} AS avg_retailing
      FROM
        psr_data psr
        JOIN (
          SELECT DISTINCT Old_Store_Code, New_Branch, ZM, SM, BE
          FROM store_mapping
        ) store ON TRIM(psr.customer_code) = TRIM(store.Old_Store_Code)
        ${
          broadChannelName.length
            ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type"
            : ""
        }
      WHERE
        psr.document_date BETWEEN ? AND ?
    `;

    let queryParams = [startDate, endDate];
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

    queryFilters.forEach(({ field, value, type }) => {
      if (!value) return;
      if (Array.isArray(value) && value.length > 0 && type === "array") {
        queryConditions.push(`${field} IN (?)`);
        queryParams.push(value);
      } else if (type === "string") {
        queryConditions.push(`${field} = ?`);
        queryParams.push(value);
      }
    });

    if (queryConditions.length > 0) {
      query += " AND " + queryConditions.join(" AND ");
    }

    query += `
      GROUP BY
        psr.customer_code,
        store.New_Branch,
        psr.customer_type,
        psr.channel_description
      ORDER BY
        avg_retailing DESC
      LIMIT ? OFFSET ?;`;

    queryParams.push(topStoresCount, offset);

    const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    res.status(200).json({ cached: false, cachedData: topStoresDetails });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
