import mySqlPool from "#config/db.js";

export const getStoreMetaData = async (req, res) => {
  try {
    const { oldStoreCode } = req.query;
    if (!oldStoreCode) throw { message: "Store code is required", status: 400 };

    await mySqlPool.query("SET SESSION sql_mode = ''");
    await mySqlPool.query("SET SESSION group_concat_max_len = 100000");

    const sqlQuery = `
      WITH StoreMapped AS (
          SELECT New_Store_Code FROM store_mapping WHERE Old_Store_Code = ?
      ),
      MonthlyRetailing AS (
          SELECT 
              DATE_FORMAT(p.document_date, '%Y-%m') AS yearMonth,
              SUM(p.retailing) AS total_retailing
          FROM psr_data p
          JOIN StoreMapped s ON p.customer_code = s.New_Store_Code
          GROUP BY yearMonth
      ),
      YearlyTotal AS (
          SELECT SUM(total_retailing) AS yearly_total FROM MonthlyRetailing
      ),
      ProductRetailing AS (
          SELECT 
              DATE_FORMAT(p.document_date, '%Y-%m') AS yearMonth,
              p.brand,
              SUM(p.retailing) AS total_retailing
          FROM psr_data p
          JOIN StoreMapped s ON p.customer_code = s.New_Store_Code
          GROUP BY yearMonth, p.brand
      ),
      StoreTotal AS (
          SELECT SUM(p.retailing) AS total_retailing
          FROM psr_data p
          JOIN StoreMapped s ON p.customer_code = s.New_Store_Code
      )
      SELECT 
          (SELECT yearly_total FROM YearlyTotal) AS yearly_total,
          (SELECT total_retailing FROM StoreTotal) AS total_retailing,
          
          (SELECT yearMonth FROM MonthlyRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_month,
          (SELECT total_retailing FROM MonthlyRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_amount,
          (SELECT yearMonth FROM MonthlyRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_month,
          (SELECT total_retailing FROM MonthlyRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_amount,
          
          (SELECT brand FROM ProductRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_product,
          (SELECT total_retailing FROM ProductRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_product_amount,
          (SELECT brand FROM ProductRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_product,
          (SELECT total_retailing FROM ProductRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_product_amount
      FROM MonthlyRetailing;
    `;

    const [[storeMetaData]] = await mySqlPool.query(sqlQuery, [oldStoreCode]);
    if (!storeMetaData) res.status(200).json({
      metadata: {
        yearly_total: 0,
        total_retailing: 0,
        highest_retailing_month: "-",
        highest_retailing_amount: 0,
        lowest_retailing_month: "-",
        lowest_retailing_amount: 0,
        highest_retailing_product: "-",
        highest_retailing_product_amount: 0,
        lowest_retailing_product: "-",
        lowest_retailing_product_amount: 0,
      },
      monthly_sales: [],
      monthly_metadata: {}, // Keeps original structure
      category_retailing: [], // ✅ New feature added here
    });

    // Fetch monthly sales trend separately
    const [monthlySales] = await mySqlPool.query(
      `SELECT DATE_FORMAT(p.document_date, '%Y-%m') AS monthYear, SUM(p.retailing) AS totalRetailing
       FROM psr_data p
       JOIN store_mapping s ON p.customer_code = s.New_Store_Code
       WHERE s.Old_Store_Code = ?
       GROUP BY monthYear
       ORDER BY monthYear ASC;`,
      [oldStoreCode]
    );

    // Fetch metadata per month
    const [monthlyMetadata] = await mySqlPool.query(
      `WITH MonthlyProductData AS (
          SELECT 
              DATE_FORMAT(p.document_date, '%Y-%m') AS monthYear,
              p.brand,
              SUM(p.retailing) AS totalRetailing
          FROM psr_data p
          JOIN store_mapping s ON p.customer_code = s.New_Store_Code
          WHERE s.Old_Store_Code = ?
          GROUP BY monthYear, p.brand
      )
      SELECT 
          monthYear,
          (SELECT brand FROM MonthlyProductData m WHERE m.monthYear = mpd.monthYear ORDER BY totalRetailing DESC LIMIT 1) AS highest_retailing_product,
          (SELECT totalRetailing FROM MonthlyProductData m WHERE m.monthYear = mpd.monthYear ORDER BY totalRetailing DESC LIMIT 1) AS highest_retailing_product_amount,
          (SELECT brand FROM MonthlyProductData m WHERE m.monthYear = mpd.monthYear ORDER BY totalRetailing ASC LIMIT 1) AS lowest_retailing_product,
          (SELECT totalRetailing FROM MonthlyProductData m WHERE m.monthYear = mpd.monthYear ORDER BY totalRetailing ASC LIMIT 1) AS lowest_retailing_product_amount
      FROM MonthlyProductData mpd
      GROUP BY monthYear;`,
      [oldStoreCode]
    );

    // Transform `monthlyMetadata` into an object for quick lookup
    const monthlyMetadataMap = {};
    monthlyMetadata.forEach((row) => {
      monthlyMetadataMap[row.monthYear] = {
        highest_retailing_product: row.highest_retailing_product,
        highest_retailing_product_amount: row.highest_retailing_product_amount,
        lowest_retailing_product: row.lowest_retailing_product,
        lowest_retailing_product_amount: row.lowest_retailing_product_amount,
      };
    });

    // **New Feature: Retailing Grouped by Category**
    const [categoryRetailing] = await mySqlPool.query(
      `SELECT category, SUM(retailing) AS total_retailing
       FROM psr_data p
       JOIN store_mapping s ON p.customer_code = s.New_Store_Code
       WHERE s.Old_Store_Code = ?
       GROUP BY category
       ORDER BY total_retailing DESC;`,
      [oldStoreCode]
    );

    res.status(200).json({
      metadata: storeMetaData,
      monthly_sales: monthlySales,
      monthly_metadata: monthlyMetadataMap, // Keeps original structure
      category_retailing: categoryRetailing, // ✅ New feature added here
    });
  } catch (error) {
    console.error("Error fetching Store data:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
