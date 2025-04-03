import mySqlPool from "#config/db.js";

export const getProductSuggestions = async (req, res) => {
  try {
    let { brandName, brandFormName, searchType, limit = 10 } = req.query;

    if (!brandName && !brandFormName) {
      // console.log(brandName, brandFormName, searchType);
      throw {
        message: "Either Brand-Name or Brand-Form-Name is required!",
        status: 400,
      };
    }

    if (!["brand", "brandform"].includes(searchType.toLowerCase())) {
      throw { message: "Invalid Search Type!", status: 400 };
    }

    let query = "";
    let values = [];

    if (searchType.toLowerCase() === "brand") {
      query = "SELECT DISTINCT brand FROM psr_data WHERE brand LIKE ? LIMIT ?";
      values = [`%${brandName}%`, Number(limit)];
    } else {
      query =
        "SELECT DISTINCT brandform FROM psr_data WHERE brandform LIKE ? LIMIT ?";
      values = [`%${brandFormName}%`, Number(limit)];
    }

    const [result] = await mySqlPool.query(query, values);

    // Extract only the values (array of strings)
    const responseArray = result.map((row) => Object.values(row)[0]);

    res.json(responseArray);
  } catch (error) {
    console.error("Error fetching products:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
