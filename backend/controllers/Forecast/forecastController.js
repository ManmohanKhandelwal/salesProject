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
    // Fetch from FastAPI cached endpoint
    const response = await fetch(`${FASTAPI_URL}/actual-sales`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch actual sales data: ${response.statusText}`
      );
    }

    const actualSalesData = await response.json();

    if (actualSalesData.error) {
      throw new Error(actualSalesData.error);
    }

    res.json(actualSalesData);
  } catch (error) {
    console.error("Error fetching actual sales data:", error.message);
    res.status(500).json({ error: "Failed to fetch actual sales data" });
  }
};

export { getForecastData, getActualSalesData };
