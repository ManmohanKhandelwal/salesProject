import mySqlPool from "../../config/db.js";

const FASTAPI_URL = "http://localhost:8000";

// Fetch forecasted sales data
const getForecastData = async (req, res) => {
  try {
    // Fetch forecast data using built-in fetch
    const response = await fetch(`${FASTAPI_URL}/forecast`);

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast data: ${response.statusText}`);
    }

    const forecastData = await response.json();

    if (forecastData.error) {
      throw new Error(forecastData.error);
    }

    res.json(forecastData);
  } catch (error) {
    console.error("Error fetching forecast data:", error.message);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
};

// Fetch actual sales for 2023 & 2024
const getActualSalesData = async (req, res) => {
  try {
    const actualSalesQuery = `
        SELECT 
            DATE_FORMAT(document_date, '%b') AS Month, 
            SUM(CASE WHEN YEAR(document_date) = YEAR(CURDATE()) - 1 THEN retailing ELSE 0 END) / 10000000 AS \`Actual Sales 2024 (₹ Cr)\`,
            SUM(CASE WHEN YEAR(document_date) = YEAR(CURDATE()) - 2 THEN retailing ELSE 0 END) / 10000000 AS \`Actual Sales 2023 (₹ Cr)\`
        FROM psr_data
        WHERE YEAR(document_date) IN (YEAR(CURDATE()) - 1, YEAR(CURDATE()) - 2)
        GROUP BY DATE_FORMAT(document_date, '%b'), MONTH(document_date)
        ORDER BY MONTH(document_date);
      `;

    const [actualSalesData] = await mySqlPool.query(actualSalesQuery);
    res.json(actualSalesData);
  } catch (error) {
    console.error("Error fetching actual sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getForecastData, getActualSalesData };
