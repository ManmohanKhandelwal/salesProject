import mySqlPool from "#config/db.js";

export const getStoreMetaData = async (req, res) => {
  try {
    const { oldStoreCode } = req.query;
    if (!oldStoreCode) {
      return res.status(400).json({ error: "Store code is required" });
    }

    await mySqlPool.query("SET SESSION sql_mode = ''");
    await mySqlPool.query("SET SESSION group_concat_max_len = 100000");

    // 1️⃣ Fetch Store Mapping
    const [storeMapping] = await mySqlPool.query(
      `SELECT New_Store_Code FROM store_mapping WHERE Old_Store_Code = ?`,
      [oldStoreCode]
    );

    if (!storeMapping.length) {
      return res.status(404).json({ error: "Store not found" });
    }
    const newStoreCode = storeMapping[0].New_Store_Code;

    // 2️⃣ Fetch Store Info
    const storeInfoQuery = mySqlPool.query(
      `SELECT 
          COALESCE(p.customer_name, '') AS store_name, 
          COALESCE(p.channel_description, '') AS channel_description
       FROM psr_data p
       JOIN channel_mapping cm ON p.customer_type = cm.customer_type
       WHERE p.customer_code = ?
       LIMIT 1`,
      [newStoreCode]
    );

    // 3️⃣ Fetch Monthly Data
    const monthlyQuery = mySqlPool.query(
      `SELECT 
          DATE_FORMAT(document_date, '%Y-%m') AS yearMonth,
          COALESCE(CAST(SUM(retailing) AS DECIMAL(10,2)), 0.00) AS total_retailing
       FROM psr_data
       WHERE customer_code = ?
       GROUP BY yearMonth`,
      [newStoreCode]
    );

    // 4️⃣ Fetch Product Breakdown (Time-Variant)
    const productQuery = mySqlPool.query(
      `SELECT 
          DATE_FORMAT(document_date, '%Y-%m') AS yearMonth,
          brand,
          COALESCE(CAST(SUM(retailing) AS DECIMAL(10,2)), 0.00) AS total_retailing
       FROM psr_data
       WHERE customer_code = ? AND brand IS NOT NULL
       GROUP BY yearMonth, brand`,
      [newStoreCode]
    );

    // 5️⃣ Fetch Category Breakdown
    const categoryQuery = mySqlPool.query(
      `SELECT 
          DATE_FORMAT(document_date, '%Y-%m') AS yearMonth,
          category,
          COALESCE(CAST(SUM(retailing) AS DECIMAL(10,2)), 0.00) AS total_retailing
       FROM psr_data
       WHERE customer_code = ? AND category IS NOT NULL
       GROUP BY yearMonth, category`,
      [newStoreCode]
    );

    // Execute all queries in parallel
    const [
      [[storeInfo]],
      [monthlyData],
      [productData],
      [categoryData],
    ] = await Promise.all([
      storeInfoQuery,
      monthlyQuery,
      productQuery,
      categoryQuery,
    ]);

    // Ensure all total_retailing values are numbers
    monthlyData.forEach(row => row.total_retailing = parseFloat(row.total_retailing) || 0);
    productData.forEach(row => row.total_retailing = parseFloat(row.total_retailing) || 0);
    categoryData.forEach(row => row.total_retailing = parseFloat(row.total_retailing) || 0);

    // Compute Yearly Total
    const yearlyTotal = monthlyData.reduce((sum, row) => sum + row.total_retailing, 0).toFixed(2);

    // Find Overall Highest & Lowest Month
    const highestRetailingMonth = monthlyData.reduce((max, row) => (row.total_retailing > max.total_retailing ? row : max), { total_retailing: 0 });
    const lowestRetailingMonth = monthlyData.reduce((min, row) => (row.total_retailing < min.total_retailing ? row : min), { total_retailing: Infinity });

    // Structure Monthly Metadata
    const monthlyMetadataMap = {};
    monthlyData.forEach(({ yearMonth, total_retailing }) => {
      monthlyMetadataMap[yearMonth] = { total_retailing };
    });

    // Structure Category Breakdown
    const categoryRetailingMap = {};
    categoryData.forEach(({ yearMonth, category, total_retailing }) => {
      if (!categoryRetailingMap[yearMonth]) categoryRetailingMap[yearMonth] = [];
      categoryRetailingMap[yearMonth].push({ category, total_retailing });
    });
    
      // Find Overall Highest & Lowest Product
      const allTimeHighProduct = productData.reduce((max, row) => (row.total_retailing > max.total_retailing ? row : max), { total_retailing: 0 });
      const allTimeLowProduct = productData.reduce((min, row) => (row.total_retailing < min.total_retailing ? row : min), { total_retailing: Infinity });
    // Structure Time-Variant Product Breakdown
    const monthlyProductMetadata = {};
    productData.forEach(({ yearMonth, brand, total_retailing }) => {
      if (!monthlyProductMetadata[yearMonth]) {
        monthlyProductMetadata[yearMonth] = {
          highest_retailing_product: null,
          highest_retailing_product_amount: "0.00",
          lowest_retailing_product: null,
          lowest_retailing_product_amount: "0.00",
          all_products: [],
        };
      }
      
      
     
      monthlyProductMetadata[yearMonth].all_products.push({ brand, total_retailing });

      // Set highest selling product
      if (!monthlyProductMetadata[yearMonth].highest_retailing_product || total_retailing > parseFloat(monthlyProductMetadata[yearMonth].highest_retailing_product_amount)) {
        monthlyProductMetadata[yearMonth].highest_retailing_product = brand;
        monthlyProductMetadata[yearMonth].highest_retailing_product_amount = total_retailing.toFixed(2);
      }

      // Set lowest selling product
      if (!monthlyProductMetadata[yearMonth].lowest_retailing_product || total_retailing < parseFloat(monthlyProductMetadata[yearMonth].lowest_retailing_product_amount)) {
        monthlyProductMetadata[yearMonth].lowest_retailing_product = brand;
        monthlyProductMetadata[yearMonth].lowest_retailing_product_amount = total_retailing.toFixed(2);
      }
    });

    // Response
    res.status(200).json({
      metadata: {
        store_name: storeInfo?.store_name || "",
        channel_description: storeInfo?.channel_description || "",
        yearly_total: yearlyTotal,
        total_retailing: yearlyTotal,
        highest_retailing_month: highestRetailingMonth?.yearMonth || "",
        highest_retailing_amount: (highestRetailingMonth?.total_retailing || 0).toFixed(2),
        lowest_retailing_month: lowestRetailingMonth?.yearMonth || "",
        lowest_retailing_amount: (lowestRetailingMonth?.total_retailing || 0).toFixed(2),
        highest_retailing_product: allTimeHighProduct?.brand || "",
        highest_retailing_product_amount: (allTimeHighProduct?.total_retailing || 0).toFixed(2),
        lowest_retailing_product: allTimeLowProduct?.brand || "",
        lowest_retailing_product_amount: (allTimeLowProduct?.total_retailing || 0).toFixed(2),
      },
      monthly_metadata: monthlyMetadataMap,
      category_retailing: categoryRetailingMap,
      monthly_product_metadata: monthlyProductMetadata,
    });
  } catch (error) {
    console.error("Error fetching Store data:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
};
