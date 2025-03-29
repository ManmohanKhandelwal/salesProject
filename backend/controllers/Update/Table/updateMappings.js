import mySqlPool from "#config/db.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { deleteFileByUUID } from "#utils/deleteFileByUUID.js";

export const updateMappings = async (req, res) => {
  try {
    const { jobId, tableType } = req.body;

    if (!["channel_mapping", "store_mapping"].includes(tableType))
      throw { message: "Table Type is required!", status: 400 };

    if (!jobId) throw { message: "jobId is required!", status: 400 };

    const truncateQuery = `TRUNCATE TABLE ${tableType};`;
    let insertQuery = "";

    if (tableType === "channel_mapping") {
      insertQuery = `
       INSERT INTO
          channel_mapping (
            customer_type,
            channel,
            broad_channel,
            short_channel
          )
        SELECT
          customer_type,
          channel,
          broad_channel,
          short_channel
        FROM
          temp_channel_mapping;
      `;
    } else if (tableType === "store_mapping") {
      insertQuery = `
        INSERT INTO
          store_mapping (
            Old_Store_Code,
            New_Store_Code,
            New_Branch,
            DSE_Code,
            ZM,
            SM,
            BE,
            STL
          )
        SELECT
          Old_Store_Code,
          New_Store_Code,
          New_Branch,
          DSE_Code,
          ZM,
          SM,
          BE,
          STL
        FROM
          temp_store_mapping;
      `;
    }

    // Execute TRUNCATE first, then INSERT
    await mySqlPool.query(truncateQuery);
    await mySqlPool.query(insertQuery);

    // Drop temporary table
    await mySqlPool.query(`DROP TABLE temp_${tableType}`);

    // Update tracking & delete uploaded file
    updateTracking(jobId, { status: `Data Inserted into ${tableType}!` });
    deleteFileByUUID(jobId);

    return res
      .status(200)
      .json({ message: `${tableType} updated successfully & File Removed!` });

  } catch (error) {
    console.log("Error in UpdateMapping: ", error?.message || error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
