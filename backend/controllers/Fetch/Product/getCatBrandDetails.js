import mySqlPool from "#config/db.js";

export const getCatBrandDetails = async (req, res) => {
  try {
    const { categoryName, brandName, searchType } = req.body;

    if (!["category", "brand"].includes(searchType)) {
      throw { status: 400, message: "Invalid search type" };
    }

    let response = {};

    if (searchType === "category") {
      const queries = [
        mySqlPool.query(
          `WITH brand_sales AS (
              SELECT brand, SUM(retailing) AS total_retailing
              FROM psr_data
              WHERE category = ?
              GROUP BY brand
           )
           SELECT brand, total_retailing
           FROM brand_sales
           WHERE total_retailing = (SELECT MAX(total_retailing) FROM brand_sales)
              OR total_retailing = (SELECT MIN(total_retailing) FROM brand_sales);`,
          [categoryName]
        ),
        mySqlPool.query(
          `SELECT DATE_FORMAT(document_date, '%Y-%m') AS month_year, SUM(retailing) AS total_retailing 
           FROM psr_data 
           WHERE category = ? 
           GROUP BY month_year 
           ORDER BY month_year;`,
          [categoryName]
        ),
        mySqlPool.query(
          `WITH branch_sales AS (
              SELECT store.New_Branch AS branch, SUM(psr.retailing) AS total_retailing
              FROM psr_data psr
              JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
              WHERE category = ?
              GROUP BY store.New_Branch
           )
           SELECT branch, total_retailing
           FROM branch_sales
           WHERE total_retailing = (SELECT MAX(total_retailing) FROM branch_sales)
              OR total_retailing = (SELECT MIN(total_retailing) FROM branch_sales);`,
          [categoryName]
        ),
      ];

      const results = await Promise.all(queries);

      response = {
        highest_brand: results[0]?.[0]?.[0] || null,
        lowest_brand: results[0]?.[0]?.[1] || null,
        retailing_trend: results[1]?.[0] || [],
        lowest_reatiling_store: results[2]?.[0]?.[0] || null,
        highest_reatiling_store: results[2]?.[0]?.[1] || null,
      };
    } else if (searchType === "brand") {
      const queries = [
        // Highest & Lowest Retailing Brand
        mySqlPool.query(
          `WITH brand_sales AS (
              SELECT brand, SUM(retailing) AS total_retailing
              FROM psr_data
              GROUP BY brand
          )
          SELECT brand, total_retailing
          FROM brand_sales
          WHERE total_retailing = (SELECT MAX(total_retailing) FROM brand_sales)
             OR total_retailing = (SELECT MIN(total_retailing) FROM brand_sales);`
        ),

        // Highest & Lowest Brandform for a Given Brand
        mySqlPool.query(
          `WITH brandform_sales AS (
              SELECT brandform, subbrandform_name, SUM(retailing) AS total_retailing
              FROM psr_data
              WHERE brand = ?
              GROUP BY brandform, subbrandform_name
          )
          SELECT brandform, subbrandform_name, total_retailing
          FROM brandform_sales
          WHERE total_retailing = (SELECT MAX(total_retailing) FROM brandform_sales)
             OR total_retailing = (SELECT MIN(total_retailing) FROM brandform_sales);`,
          [brandName]
        ),

        // Retailing Trend Over Time (Month & Year)
        mySqlPool.query(
          `SELECT DATE_FORMAT(document_date, '%Y-%m') AS month_year, SUM(retailing) AS total_retailing 
           FROM psr_data 
           WHERE brand = ? 
           GROUP BY month_year 
           ORDER BY month_year;`,
          [brandName]
        ),

        // Highest & Lowest Retailing Branch for a Given Brand
        mySqlPool.query(
          `WITH branch_sales AS (
              SELECT store.New_Branch AS branch, SUM(psr.retailing) AS total_retailing
              FROM psr_data psr
              JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
              WHERE brand = ?
              GROUP BY store.New_Branch
          )
          SELECT branch, total_retailing
          FROM branch_sales
          WHERE total_retailing = (SELECT MAX(total_retailing) FROM branch_sales)
             OR total_retailing = (SELECT MIN(total_retailing) FROM branch_sales);`,
          [brandName]
        ),
      ];

      const results = await Promise.all(queries);

      response = {
        highest_brand: results[0]?.[0]?.[0] || null,
        lowest_brand: results[0]?.[0]?.[1] || null,
        highest_brandform: results[1]?.[0]?.[0] || null,
        lowest_brandform: results[1]?.[0]?.[1] || null,
        retailing_trend: results[2]?.[0] || [],
        lowest_reatiling_store: results[3]?.[0]?.[0] || null,
        highest_reatiling_store: results[3]?.[0]?.[1] || null,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching details:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
