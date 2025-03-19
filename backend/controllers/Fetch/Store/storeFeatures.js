import mySqlPool from "#config/db.js";

export const getStoreSuggestions = async (req, res) => {
  try {
    let {
      oldStoreCode,
      branchName,
      zoneManager,
      salesManager,
      businessExecutive,
      systemTeamLeader,
      limit = 5,
    } = req.query;

    if (!oldStoreCode) {
      return res.status(400).json({ error: "Old Store Code KeyWord is Required !" });
    }

    const safeLimit = parseInt(limit, 10);
    if (isNaN(safeLimit) || safeLimit <= 0) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

    // Start building the query dynamically
    let query = "SELECT * FROM store_mapping WHERE Old_Store_Code LIKE ?";
    let params = [`%${oldStoreCode}%`];
    if (branchName) {
      query += " AND New_Branch LIKE ?";
      params.push(`%${branchName}%`);
    }
    if (zoneManager) {
      query += " AND ZM LIKE ?";
      params.push(`%${zoneManager}%`);
    }
    if (salesManager) {
      query += " AND SM LIKE ?";
      params.push(`%${salesManager}%`);
    }
    if (businessExecutive) {
      query += " AND BE LIKE ?";
      params.push(`%${businessExecutive}%`);
    }
    if (systemTeamLeader) {
      query += " AND STL LIKE ?";
      params.push(`%${systemTeamLeader}%`);
    }

    query += " LIMIT ?";
    params.push(safeLimit);

    const [rows] = await mySqlPool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
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

export const getBranchSuggestions = async (req, res) => {
  try {
    let {
      branchName,
      zoneManager,
      salesManager,
      businessExecutive,
      systemTeamLeader,
      limit = 10,
    } = req.query;
    if (!branchName) throw { message: "Branch Name KeyWord is required !", status: 400 };
    console.log("zoneManager:",zoneManager);
    // Start building the query dynamically
    let query = "SELECT DISTINCT New_Branch FROM store_mapping";
    let params = [];
    if (branchName) {
      query += " WHERE New_Branch LIKE ?";
      params.push(`%${branchName}%`);
    }
    if (zoneManager) {
      query += " AND ZM LIKE ?";
      params.push(`%${zoneManager}%`);
    }
    if (salesManager) {
      query += " AND SM LIKE ?";
      params.push(`%${salesManager}%`);
    }
    if (businessExecutive) {
      query += " AND BE LIKE ?";
      params.push(`%${businessExecutive}%`);
    }
    if (systemTeamLeader) {
      query += " AND STL LIKE ?";
      params.push(`%${systemTeamLeader}%`);
    }

    const safeLimit = parseInt(limit, 10);
    if (isNaN(safeLimit) || safeLimit <= 0) {
      return res.status(400).json({ error: "Invalid limit value" });
    }

    query += " LIMIT ?";
    params.push(safeLimit);

    const [result] = await mySqlPool.query(query, params);
    console.log(result)
    // Convert result from array of objects to array of strings
    const branches = result.map((row) => row.New_Branch);

    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
