import db from "#config/db.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { deleteFileByUUID } from "#utils/uuildFileMng.js";
export const updateMappings = async (req, res) => {
  try {
    const { filePath, tableType } = req.body;
    const jobId = filePath.split("_")[0];

    if (!["channel_mapping", "store_mapping"].includes(tableType))
      throw { message: "Table Type is required!", status: 400 };

    if (!filePath) throw { message: "File Path is required!", status: 400 };
    let query = "";
    if (tableType === "channel_mapping") {
      query = `
        TRUNCATE TABLE channel_mapping;
            INSERT INTO channel_mapping (
            customer_type, channel, broad_channel, short_channel
            )
            SELECT
            customer_type, channel, broad_channel, short_channel
            FROM temp_channel_mapping;
        `;
    } else if (tableType === "store_mapping") {
      query = `
        TRUNCATE TABLE store_mapping;
            INSERT INTO store_mapping (
            Old_Store_Code, New_Store_Code, New_Branch, DSE_Code, ZM, SM, BE, STL
            )
            SELECT
            Old_Store_Code, New_Store_Code, New_Branch, DSE_Code, ZM, SM, BE, STL
            FROM temp_store_mapping;
        `;
    }
    await db
      .query(query)
      .then(() => {
        db.query(`DROP TABLE temp_${tableType}`);
      })
      .then(() => {
        updateTracking(jobId, { status: `Data Inserted into ${tableType}!` });
        deleteFileByUUID(jobId);
      });
    return res
      .status(200)
      .json({ message: `${tableType} updated successfully & File Removed !` });
  } catch (error) {
    console.log("Error in UpdateMapping: ", error?.message || error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || error || "Internal Server Error" });
  }
};
