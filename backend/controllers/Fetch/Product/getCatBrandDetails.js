import mySqlPool from "#config/db.js";
import {
  brandDataForCategoryQuery,
  trendDataForCategoryQuery,
  storeDataForCategoryQuery,
  brandDataForBrandQuery,
  brandFormDataForBrandQuery,
  trendDataForBrandQuery,
  storeDataForBrandQuery
} from "#commands/Product/Category_Brand_Query.js";


export const getCatBrandDetails = async (req, res) => {
  try {
    const { categoryName, brandName, searchType } = req.body;

    if (!["category", "brand"].includes(searchType)) {
      throw { status: 400, message: "Invalid search type" };
    }

    let response = {};

    if (searchType === "category") {
      const queries = [
        // Highest & Lowest Retailing Brand
        mySqlPool.query(brandDataForCategoryQuery, [categoryName]
        ),

        // Retailing Trend Over Time
        mySqlPool.query(
          trendDataForCategoryQuery, [categoryName]
        ),

        // Highest & Lowest Retailing Store for Given Category
        mySqlPool.query(storeDataForCategoryQuery, [categoryName]
        ),
      ];

      const results = await Promise.all(queries);
      const [brandData, trendData, storeData] = results.map(r => r[0] || []);

      response = {
        highest_brand: brandData[0] || null,
        lowest_brand: brandData[1] || null,
        retailing_trend: trendData || [],
        highest_retailing_store: storeData[0] || null,
        lowest_retailing_store: storeData[1] || null,
      };
    } else if (searchType === "brand") {
      const queries = [
        // Highest & Lowest Retailing Brand
        mySqlPool.query(brandDataForBrandQuery,
        ),

        // Highest & Lowest Brandform for a Given Brand
        mySqlPool.query(brandFormDataForBrandQuery, [brandName]
        ),

        // Retailing Trend Over Time
        mySqlPool.query(trendDataForBrandQuery, [brandName]
        ),

        // Highest & Lowest Retailing Store for a Given Brand
        mySqlPool.query(storeDataForBrandQuery, [brandName]
        ),
      ];

      const results = await Promise.all(queries);
      const [brandData, brandformData, trendData, storeData] = results.map(r => r[0] || []);

      response = {
        highest_brand: brandData[0] || null,
        lowest_brand: brandData[1] || null,
        highest_brandform: brandformData[0] || null,
        lowest_brandform: brandformData[1] || null,
        retailing_trend: trendData || [],
        highest_retailing_store: storeData[0] || null,
        lowest_retailing_store: storeData[1] || null,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("Error fetching details:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
