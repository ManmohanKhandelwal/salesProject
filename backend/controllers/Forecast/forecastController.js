import mySqlPool from "../../config/db.js"; // ✅ Ensure correct path for MySQL connection

// Fetch forecasted sales data
const getForecastData = async (req, res) => {
  try {
    const forecastQuery = `
      SELECT Month, 
             \`Projected Sales (₹ Cr)\`, 
             \`Lower Estimate (₹ Cr)\`, 
             \`Upper Estimate (₹ Cr)\`
      FROM forecast_table
      ORDER BY STR_TO_DATE(Month, '%b %Y');
    `;

    const [forecastData] = await mySqlPool.query(forecastQuery);
    res.json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch actual sales for 2023 & 2024
const getActualSalesData = async (req, res) => {
  try {
    const actualSalesQuery = `
        SELECT 
            DATE_FORMAT(document_date, '%b %Y') AS Month, 
            SUM(CASE WHEN YEAR(document_date) = YEAR(CURDATE()) - 1 THEN retailing ELSE 0 END) / 10000000 AS \`Actual Sales 2024 (₹ Cr)\`,
            SUM(CASE WHEN YEAR(document_date) = YEAR(CURDATE()) - 2 THEN retailing ELSE 0 END) / 10000000 AS \`Actual Sales 2023 (₹ Cr)\`
        FROM psr_data
        WHERE YEAR(document_date) IN (YEAR(CURDATE()) - 1, YEAR(CURDATE()) - 2)
        GROUP BY DATE_FORMAT(document_date, '%b %Y')
        ORDER BY STR_TO_DATE(Month, '%b %Y');
      `;

    const [actualSalesData] = await mySqlPool.query(actualSalesQuery);
    res.json(actualSalesData);
  } catch (error) {
    console.error("Error fetching actual sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getForecastData, getActualSalesData };
