import mySqlPool from "#config/db.js";
import { deleteFileByUUID } from "#utils/deleteFileByUUID.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { updateDashBoardCache } from "../DashBoard/updateDashboardCache.js";
import { updatePSRSummary } from "../DashBoard/updatePSRSummary.js";
import { updateStoreDashBoardCache } from "../Store/updateStoreDashBoardCache.js";
import { updateTop100StoreCache } from "../Store/updateTop100StoreCache.js";

export const mergePsrTable = async (req, res) => {
  try {
    const { jobId, tableType } = req.body;
    if (!tableType === "psr_data") throw { message: "Table Type is required! (psr_data)", status: 400 };
    if (!jobId) throw { message: "File Path is required!", status: 400 };
    // Insert data from temp_psr_data into psr_data excluding the auto-increment primary
    // key (psr_id)
    await mySqlPool
      .query(
        `INSERT INTO
            psr_data (
              document_no,
              document_date,
              subbrandform_name,
              customer_name,
              customer_code,
              channel_description,
              customer_type,
              category,
              brand,
              brandform,
              retailing
            )
          SELECT
            document_no,
            document_date,
            subbrandform_name,
            customer_name,
            customer_code,
            channel_description,
            customer_type,
            category,
            brand,
            brandform,
            retailing
          FROM
            temp_psr_data;
            `
      )

    // Drop Temporary Table
    mySqlPool.query(`DROP TABLE temp_${tableType}`);
    // Update the tracking status & delete the file
    updateTracking(jobId, { status: `Data Inserted into ${tableType}!` });
    deleteFileByUUID(jobId);

    //Update PSR Summary & then DashBoard Cache in CacheTable
    updatePSRSummary().then(updateDashBoardCache());

    //Update Store Dahboard Cache & Top-100 Store Cache
    updateStoreDashBoardCache();
    updateTop100StoreCache();

    return res
      .status(200)
      .json({ message: `${tableType} updated successfully & File Removed !` });
  } catch (error) {
    console.log("Error in updatePSRTable: ", error?.message || error);
    // Return error response
    return res
      .status(error.status || 500)
      .json({ message: error.message || error || "Internal Server Error" });
  }
};
