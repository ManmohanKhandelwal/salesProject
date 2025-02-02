import mySqlPool from "../config/db.js";

export const getRetailData = async (req, res) => {
  try {
    const data = await mySqlPool.query("SELECT * FROM psr_data LIMIT 1000");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Data not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error | getRetailData",
      error,
    });
  }
};
