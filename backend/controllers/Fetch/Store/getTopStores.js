import mySqlPool from "#config/db.js";

export const getTopStores = async (req, res) => {
  let { branchName, startDate, endDate, topStoresCount } = req.query;

  try {
    if (!branchName) throw { message: "Branch name is required", status: 400 };

    // Default date range (last 6 months)
    if (!startDate || !endDate) {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    }

    // Default topStoresCount to 20 if not provided
    if (!topStoresCount) topStoresCount = 20;
    topStoresCount = parseInt(topStoresCount, 10);

    // SQL Query to get the top stores by avg retailing
    const query = `
     SELECT 
        psr.customer_code AS store_code,
        AVG(psr.retailing) AS avg_retailing
    FROM psr_data psr
    JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
    WHERE store.New_Branch = ?
    AND psr.document_date BETWEEN ? AND ?
    GROUP BY psr.customer_code
    ORDER BY avg_retailing DESC
    LIMIT ?;
    `;

    const [topStoresDetails] = await mySqlPool.query(query, [
      branchName,
      startDate,
      endDate,
      topStoresCount,
    ]);

    res.json({ startDate, endDate, topStoresCount, topStoresDetails });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
