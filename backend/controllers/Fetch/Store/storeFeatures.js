import mySqlPool from "#config/db.js";

export const getStoreSuggestions = async (req, res) => {
  const { oldStoreCode } = req.query;
  console.log("oldStoreCode:", oldStoreCode);
  try {
    if (!oldStoreCode) throw { message: "Store code is required", status: 400 };
    const [rows] = await mySqlPool.query(
      "SELECT * FROM store_mapping WHERE Old_Store_Code LIKE ? LIMIT ?",
      [`%${oldStoreCode}%`, 5]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching stores:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};

export const getStoresList = async (req, res) => {
  try {
    let { offset = 0, size = 10 } = req.query;
    offset = parseInt(offset, 10);
    size = parseInt(size, 10);

    if (isNaN(offset) || isNaN(size) || offset < 0 || size <= 0)
      throw { message: "Invalid query parameters", status: 400 };
    const [rows] = await mySqlPool.query(
      "SELECT * FROM store_mapping LIMIT ?, ?",
      [offset, size]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching stores:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
