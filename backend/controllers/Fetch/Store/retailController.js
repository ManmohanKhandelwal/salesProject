import mySqlPool from "#config/db.js";

export const getRetailData = async (req, res) => {
  try {
    const data = await mySqlPool.query("SELECT * FROM psr_data LIMIT 1000");
    if (!data) throw { message: "Error fetching data", status: 500 };
    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.error(error?.message || error);
    res.status(error?.status || 500).json({ error: error?.message || error });
  }
};
