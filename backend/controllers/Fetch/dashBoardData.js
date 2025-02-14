import fs from "fs/promises";
import path from "path";
import mySqlPool from "../../config/db.js";
import SQLSelect from "../../utils/sqlSelect.js";
import { TIME_TO_UPDATE_CACHE } from "../../config/constant.js";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "dashboardData.json");
const CACHE_DURATION = TIME_TO_UPDATE_CACHE;

/** Helper function to read and validate cache */
const readCache = async () => {
  try {
    const fileData = await fs.readFile(CACHE_FILE, "utf-8");
    const cachedData = JSON.parse(fileData);
    if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Serving data from cache...");
      return cachedData.data;
    }
  } catch {
    console.log("Cache not found or expired, fetching new data...");
  }
  return null;
};

/** Helper function to write cache */
const writeCache = async (data) => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), data }),
      "utf-8"
    );
  } catch (err) {
    console.error("Error writing cache:", err);
  }
};

/** Optimized function to fetch dashboard data */
export const getDashBoardData = async (req, res) => {
  try {
    // Check cache first
    const cachedData = await readCache();
    if (cachedData) return res.status(200).json(cachedData);

    // Get database connection
    const connection = await mySqlPool.getConnection();
    await connection.query("SET SESSION sql_mode = ''");

    // Define queries
    const query = `
      WITH latest_month AS (
          SELECT YEAR(MAX(document_date)) AS latest_year, 
                 MONTH(MAX(document_date)) AS latest_month
          FROM psr_data
      )
      SELECT 
          lm.latest_year AS year, 
          lm.latest_month AS month, 
          SUM(CASE WHEN YEAR(pd.document_date) = lm.latest_year THEN pd.retailing ELSE 0 END) AS latest_total,
          SUM(CASE WHEN YEAR(pd.document_date) = lm.latest_year - 1 THEN pd.retailing ELSE 0 END) AS prev_total
      FROM psr_data pd
      JOIN latest_month lm 
      ON MONTH(pd.document_date) = lm.latest_month
      GROUP BY lm.latest_year, lm.latest_month;
    `;

    const [
      [[dashboardData]],
      [[retailingStats]],
      [retailingByChannel],
      [retailingByCategory],
      [retailTrend],
      [topTenBrandForm],
    ] = await Promise.all([
      connection.query(
        SQLSelect({ Queries: ["*"], TableName: "dashboard_summary", Limit: 0 })
      ),
      connection.query(query),
      connection.query(
        SQLSelect({
          Queries: ["cm.broad_channel", "SUM(pd.retailing) as totalRetailing"],
          TableName: "psr_data pd",
          JoinBy: {
            "channel_mapping cm": "pd.customer_type = cm.customer_type",
          },
          GroupBy: ["cm.broad_channel"],
          Limit: 0,
        })
      ),
      connection.query(
        SQLSelect({
          Queries: ["category", "SUM(retailing) as totalRetailing"],
          TableName: "psr_data",
          GroupBy: ["category"],
          Limit: 0,
        })
      ),
      connection.query(
        SQLSelect({
          Queries: [
            "YEAR(document_date) AS year",
            "MONTH(document_date) AS month",
            "SUM(retailing) AS totalRetailing",
          ],
          TableName: "psr_data",
          GroupBy: ["YEAR(document_date)", "MONTH(document_date)"],
          Limit: 0,
        })
      ),
      connection.query(
        SQLSelect({
          Queries: ["brandform", "SUM(retailing) as totalRetailing"],
          TableName: "psr_data",
          GroupBy: ["brandform"],
          OrderBy: ["totalRetailing DESC"],
          Limit: 10,
        })
      ),
    ]);

    connection.release(); // Release database connection

    // Format data functions
    const formatData = (arr, nameKey) =>
      arr.map((row) => ({
        name: row[nameKey],
        value: parseFloat(row.totalRetailing),
      }));

    const formattedRetailTrend = retailTrend.map((row) => ({
      year: row.year.toString(),
      month: row.month.toString(),
      value: parseFloat(row.totalRetailing),
    }));

    const percentageChangeinRetailing =
      retailingStats.prev_total > 0
        ? ((retailingStats.latest_total - retailingStats.prev_total) /
            retailingStats.prev_total) *
          100
        : null;

    // Final Response Data
    const responseData = {
      totalRetailingValue: dashboardData.retailing_sum,
      latestMonthTotalRetailing: {
        year: retailingStats.year,
        month: retailingStats.month,
        total_retailing: retailingStats.latest_total,
      },
      previousYearSameMonthTotalRetailing: {
        year: retailingStats.year - 1,
        month: retailingStats.month,
        total_retailing: retailingStats.prev_total,
      },
      percentageChangeinRetailing: percentageChangeinRetailing,
      retailChannelData: formatData(retailingByChannel, "broad_channel"),
      retailCategoryData: formatData(retailingByCategory, "category"),
      topRetailingBrand: {
        title: dashboardData.highest_retailing_brand,
        value: dashboardData.highest_retailing_brand_value,
      },
      topRetailingBranch: {
        title: dashboardData.highest_retailing_branch,
        value: dashboardData.highest_retailing_branch_value,
      },
      retailTrendByMonthAndYear: formattedRetailTrend,
      topTenBrandForm: topTenBrandForm,
    };

    // Cache the response
    await writeCache(responseData);

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
