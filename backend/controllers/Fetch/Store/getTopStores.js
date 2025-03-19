import mySqlPool from "#config/db.js";

export const getTopStores = async (req, res) => {
  let {
    branchName,
    startDate,
    endDate,
    topStoresCount,
    zoneManager,
    salesManager,
    offset,
  } = req.query;

  try {
    if (!branchName) throw { message: "Branch name is required", status: 400 };

    // Default date range (last 6 months)
    if (!startDate || !endDate) {
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 3))
        .toISOString()
        .split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    }

    // Default topStoresCount to 20 if not provided
    topStoresCount = parseInt(topStoresCount, 10) || 20;

    // Default offset to 0 if not provided
    offset = parseInt(offset, 10) || 0;

    // Build SQL query dynamically based on available filters
    let query = `
      SELECT 
        psr.customer_code AS store_code,
        AVG(psr.retailing) AS avg_retailing
      FROM psr_data psr
      JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
      WHERE store.New_Branch = ?
      AND psr.document_date BETWEEN ? AND ?
    `;

    let queryParams = [branchName, startDate, endDate];

    if (zoneManager) {
      query += " AND store.ZM = ?";
      queryParams.push(zoneManager);
    }

    if (salesManager) {
      query += " AND store.SM = ?";
      queryParams.push(salesManager);
    }

    query += `
      GROUP BY psr.customer_code
      ORDER BY avg_retailing DESC
      LIMIT ? OFFSET ?;
    `;

    queryParams.push(topStoresCount, offset);

    const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    res.json({ startDate, endDate, topStoresCount, offset, topStoresDetails });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
