import mySqlPool from "#config/db.js";

export const getCatBrandSuggestions = async (req, res) => {
  try {
    let { searchType, category, brand, brandform, limit = 10, offset = 0 } = req.query;

    // Ensure limit & offset are integers
    limit = parseInt(limit, 10) || 10;
    offset = parseInt(offset, 10) || 0;

    // Validate searchType
    const validTypes = ["category", "brand", "brandform", "subbrandform"];
    if (!searchType || !validTypes.includes(searchType.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid searchType! Use category, brand, brandform, or subbrandform.",
      });
    }

    // Define hierarchy mapping
    const hierarchyMap = {
      category: "category",
      brand: "brand",
      brandform: "brandform",
      subbrandform: "subbrandform_name",
    };

    const nextLevel = hierarchyMap[searchType.toLowerCase()];
    if (!nextLevel) {
      return res.status(400).json({ error: "Invalid searchType!" });
    }

    // **Category Fetching**
    if (searchType.toLowerCase() === "category") {
      const query = `SELECT DISTINCT category FROM psr_data LIMIT ? OFFSET ?`;
      const [result] = await mySqlPool.query(query, [limit, offset]);
      const responseArray = result.map((row) => row.category);
      return res.json(responseArray);
    }

    // **Building Conditions for Child Searches**
    let query = `SELECT DISTINCT ${nextLevel} FROM psr_data WHERE 1=1`;
    let queryParams = [];

    if (category) {
      query += " AND category = ?";
      queryParams.push(category);
    }
    if (brand) {
      query += " AND brand = ?";
      queryParams.push(brand);
    }
    if (brandform) {
      query += " AND brandform = ?";
      queryParams.push(brandform);
    }

    query += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    const [result] = await mySqlPool.query(query, queryParams);
    const responseArray = result.map((row) => Object.values(row)[0]);

    res.json(responseArray);
  } catch (error) {
    console.error("Error fetching suggestions:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || "Internal Server Error" });
  }
};
