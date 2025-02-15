import mySqlPool from "#config/db.js";

export const getStoreInfoByCode = async (req, res) => {
  try {
    const { oldStoreCode } = req.query;
    if (!oldStoreCode) throw { message: "Store code is required", status: 400 };
    const connection = await mySqlPool.getConnection();
    await connection.query("SET SESSION sql_mode = ''");

    const [[storeMetaData]] = await connection.query(`
            WITH MonthlyRetailing AS (
            SELECT 
                DATE_FORMAT(p.document_date, '%Y-%m') AS month,
                SUM(p.retailing) AS total_retailing
            FROM psr_data p
            JOIN store_mapping s ON p.customer_code = s.Old_Store_Code
            WHERE s.Old_Store_Code = '${oldStoreCode}'
            GROUP BY DATE_FORMAT(p.document_date, '%Y-%m')
            ),
            ProductRetailing AS (
                SELECT 
                    p.brand,
                    SUM(p.retailing) AS total_retailing
                FROM psr_data p
                JOIN store_mapping s ON p.customer_code = s.Old_Store_Code
                WHERE s.Old_Store_Code = '${oldStoreCode}'
                GROUP BY p.brand
            )
            SELECT 
                -- Total retailing for the store
                (SELECT SUM(p.retailing) 
                FROM psr_data p
                JOIN store_mapping s ON p.customer_code = s.Old_Store_Code
                WHERE s.Old_Store_Code = '${oldStoreCode}') AS total_retailing,

                -- Highest retailing month and amount
                (SELECT month FROM MonthlyRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_month,
                (SELECT total_retailing FROM MonthlyRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_amount,

                -- Lowest retailing month and amount
                (SELECT month FROM MonthlyRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_month,
                (SELECT total_retailing FROM MonthlyRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_amount,

                -- Highest retailing product and amount
                (SELECT brand FROM ProductRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_product,
                (SELECT total_retailing FROM ProductRetailing ORDER BY total_retailing DESC LIMIT 1) AS highest_retailing_product_amount,

                -- Lowest retailing product and amount
                (SELECT brand FROM ProductRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_product,
                (SELECT total_retailing FROM ProductRetailing ORDER BY total_retailing ASC LIMIT 1) AS lowest_retailing_product_amount;
            `);
    res.status(200).json(storeMetaData);
  } catch (error) {
    console.error("Error fetching Store data:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
