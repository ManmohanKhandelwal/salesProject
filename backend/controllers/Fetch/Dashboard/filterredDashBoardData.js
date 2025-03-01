import { TIME_TO_UPDATE_CACHE_DASHBOARD } from "#config/constant.js";
import mySqlPool from "#config/db.js";
import { readCache } from "#utils/cacheManager.js";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache", "dashboard");
const CACHE_FILE = path.join(CACHE_DIR, "dashboardData.json");

export const getFilteredDashBoardData = async (req, res) => {
  try {
    const queries = req.body;
    console.clear();

    // Month Name -> Month Number Mapping
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Mapping frontend filter keys to corresponding DB columns
    const formattedQueryKeys = {
      years: "YEAR(pd.document_date)",
      months: "MONTH(pd.document_date)",
      category: "pd.category",
      brand: "pd.brand",
      brandform: "pd.brandform",
      subBrandform: "pd.subbrandform_name",
      customer_type: "pd.customer_type",
      branches: "store_mapping.New_Branch",
      zm: "store_mapping.ZM",
      sm: "store_mapping.SM",
      be: "store_mapping.BE",
      channel: "channel_mapping.channel",
      broadChannel: "channel_mapping.broad_channel",
      shortChannel: "channel_mapping.short_channel",
    };

    // Remove filters where value is "all"
    const filteredQueries = Object.entries(queries).reduce(
      (acc, [key, value]) => {
        if (value.length > 0 && !value.includes("all")) {
          acc[key] =
            key === "months"
              ? value.map((month) => monthMapping[month] || month)
              : value;
        }
        return acc;
      },
      {}
    );

    console.log("Filtered Queries:", filteredQueries);

    // Identify tables required based on filters
    const requiresStoreMapping = Object.keys(filteredQueries).some((key) =>
      ["branches", "zm", "sm", "be"].includes(key)
    );
    const requiresChannelMapping = Object.keys(filteredQueries).some((key) =>
      ["channel", "broadChannel", "shortChannel"].includes(key)
    );

    // Build WHERE conditions dynamically
    let whereClause = "";
    let queryParams = [];

    if (Object.keys(filteredQueries).length > 0) {
      whereClause =
        "WHERE " +
        Object.entries(filteredQueries)
          .map(([key, values]) => {
            const column = formattedQueryKeys[key];
            if (Array.isArray(values)) {
              const placeholders = values.map(() => "?").join(", "); // Create placeholders for each value
              queryParams.push(...values); // Push all values into queryParams
              return `${column} IN (${placeholders})`; // Create the IN clause
            } else {
              queryParams.push(values); // If it's a single value, just push it to queryParams
              return `${column} = ?`; // Use = for single value
            }
          })
          .join(" AND ");
    }

    // Construct FROM and JOINs based on required tables
    let fromClause = "FROM psr_data AS pd"; // Alias pd for pd
    if (requiresStoreMapping) {
      fromClause +=
        " JOIN store_mapping ON pd.customer_code = store_mapping.Old_Store_Code";
    }
    if (requiresChannelMapping) {
      fromClause +=
        " JOIN channel_mapping ON pd.customer_type = channel_mapping.customer_type";
    }

    // Get database connection
    const connection = await mySqlPool.getConnection();
    await connection.query("SET SESSION sql_mode = ''");

    const sqlQueryTotalRetailing = `
    SELECT SUM(pd.retailing) AS totalRetailingValue
    ${requiresChannelMapping ? ", channel_mapping.broad_channel" : ""}
    ${fromClause}
    ${whereClause}
  `;

    const sqlQueryRetailChannelData = `
    SELECT cm.broad_channel as name, SUM(pd.retailing) AS value
    ${fromClause}
    JOIN channel_mapping cm ON pd.customer_type = cm.customer_type
    ${whereClause}
    GROUP BY cm.broad_channel
  `;

    const sqlQueryRetailCategoryChannelData = `
    SELECT pd.category, SUM(pd.retailing) AS totalRetailing
    ${fromClause}
    ${whereClause}
    GROUP BY pd.category
  `;
    const sqlQueryRetailCategoryData = `SELECT category as name, SUM(retailing) as value
    ${fromClause}
    ${whereClause} GROUP BY category`;
    const sqlQueryRetailTrendByMonthAndYear = `
    SELECT YEAR(pd.document_date) AS year, MONTH(pd.document_date) AS month, SUM(pd.retailing) AS value
    ${fromClause}
    ${whereClause}
    GROUP BY YEAR(pd.document_date), MONTH(pd.document_date)
  `;

    const sqlQueryTopBrandForm = `
    SELECT pd.brandform, SUM(pd.retailing) AS totalRetailing
    ${fromClause}
    ${whereClause}
    GROUP BY pd.brandform
    ORDER BY totalRetailing DESC
    LIMIT 10
  `;
    console.log(sqlQueryRetailCategoryData, queryParams);

    // Execute all queries in parallel
    const [
      [[retailingStats]],
      [retailChannelData],
      [retailCategoryData],
      [retailCategoryChannelData],
      [retailTrendByMonthAndYear],
      [topTenBrandForm],
    ] = await Promise.all([
      connection.query(sqlQueryTotalRetailing, queryParams),
      connection.query(sqlQueryRetailChannelData, queryParams),
      connection.query(sqlQueryRetailCategoryData, queryParams),
      connection.query(sqlQueryRetailCategoryChannelData, queryParams),
      connection.query(sqlQueryRetailTrendByMonthAndYear, queryParams),
      connection.query(sqlQueryTopBrandForm, queryParams),
    ]);

    // Release connection
    connection.release();
    const cachedData = await readCache(
      CACHE_FILE,
      TIME_TO_UPDATE_CACHE_DASHBOARD
    );
    console.log(retailingStats);

    // Return the response with all the filtered data
    return res.status(200).json({
      totalRetailingValue: retailingStats?.totalRetailingValue || 0,
      latestMonthTotalRetailing: cachedData.latestMonthTotalRetailing || {
        year: 0,
        month: 0,
        total_retailing: 0,
      },
      percentageChangeinRetailing: cachedData.percentageChangeinRetailing || 0,
      retailCategoryData: retailCategoryData || [],
      previousYearSameMonthTotalRetailing:
        cachedData.previousYearSameMonthTotalRetailing || {
          year: 0,
          month: 0,
          total_retailing: 0,
        },
      topRetailingBrand: cachedData.topRetailingBrand || {
        title: "",
        value: 0,
      },
      topRetailingBranch: cachedData.topRetailingBranch || {
        title: "",
        value: 0,
      },
      retailingStats,
      retailChannelData,
      retailCategoryChannelData,
      retailTrendByMonthAndYear,
      topTenBrandForm,
    });
  } catch (error) {
    console.error("Error fetching filtered dashboard data:", error);
    return res.status(500).json(error?.message);
  }
};
