import fs from "fs/promises";
import path from "path";
import mySqlPool from "../../config/db.js";
import SQLSelect from "../../utils/sqlSelect.js";
import { TIME_TO_UPDATE_CACHE } from "../../config/constant.js";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "dashboardData.json");
const CACHE_DURATION = TIME_TO_UPDATE_CACHE;

export const getDashBoardData = async (req, res) => {
  try {
    // Ensure the cache directory exists
    await fs
      .mkdir(CACHE_DIR, { recursive: true })
      .catch((err) => console.error("Error creating cache directory:", err));

    // Check if the cached file exists
    try {
      const fileData = await fs.readFile(CACHE_FILE, "utf-8");
      const cachedData = JSON.parse(fileData);

      // If data is fresh, return it
      if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log("Serving data from cache...");
        return res.status(200).json(cachedData.data);
      }
    } catch {
      console.log("Cache not found or expired, fetching new data...");
    }

    // Fetch data from the database
    await mySqlPool.query("SET SESSION sql_mode = ''");

    //Using Promise.all to run all the queries in parallel
    const [
      [[dashboardData]],
      [retailingByChannel],
      [retailingByCategory],
      [retailTrend],
      [retailTopTen],
    ] = await Promise.all([
      mySqlPool.query(
        SQLSelect({
          Queries: [
            "*", // Select all columns
          ],
          TableName: "dashboard_summary",
          Limit: 0,
        })
      ),
      mySqlPool.query(
        SQLSelect({
          Queries: ["channel_description", "SUM(retailing) as totalRetailing"],
          TableName: "psr_data",
          GroupBy: ["channel_description"],
          Limit: 0,
        })
      ),
      mySqlPool.query(
        SQLSelect({
          Queries: ["category", "SUM(retailing) as totalRetailing"],
          TableName: "psr_data",
          GroupBy: ["category"],
          Limit: 0,
        })
      ),
      mySqlPool.query(
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
      mySqlPool.query(`
        SELECT sm.New_Branch, SUM(pd.retailing) AS total_retailing
        FROM psr_data pd
        JOIN store_mapping sm ON pd.customer_code = sm.Old_Store_Code
        GROUP BY sm.New_Branch
        ORDER BY total_retailing DESC
        LIMIT 10;
`),
    ]);

    const formattedRetailingByChannel = retailingByChannel.map((row) => ({
      name: row.channel_description,
      value: parseFloat(row.totalRetailing),
    }));

    const formattedRetailingByCategory = retailingByCategory.map((row) => ({
      name: row.category,
      value: parseFloat(row.totalRetailing),
    }));

    const formattedRetailTrend = retailTrend.map((row) => ({
      year: row.year.toString(),
      month: row.month.toString(),
      value: parseFloat(row.totalRetailing),
    }));

    // Final Response Data
    const responseData = {
      totalRetailingValue: dashboardData.retailing_sum,
      retailChannelData: formattedRetailingByChannel,
      retailCategoryData: formattedRetailingByCategory,
      topRetailingBrand: {
        title: dashboardData.highest_retailing_brand,
        value: dashboardData.highest_retailing_brand_value,
      },
      topRetailingBranch: {
        title: dashboardData.highest_retailing_branch,
        value: dashboardData.highest_retailing_branch_value,
      },
      retailTrendByMonthAndYear: formattedRetailTrend,
      retailTopTen: retailTopTen,
    };

    // Save the new data to cache
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify({ timestamp: Date.now(), data: responseData }),
      "utf-8"
    );

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
