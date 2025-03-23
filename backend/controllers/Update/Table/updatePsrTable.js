import db from "#config/db.js";
import { updateTracking } from "#utils/trackingStatus.js";
import { deleteFileByUUID } from "#utils/uuildFileMng.js";
export const updatePSRTable = async (req, res) => {
  try {
    const { jobId, tableType } = req.body;
    if (!tableType==="psr_data") throw { message: "Table Type is required! (psr_data)", status: 400 };
    if (!jobId) throw { message: "File Path is required!", status: 400 };
    // Insert data from temp_psr_data into psr_data excluding the auto-increment primary
    // key (psr_id)
    await db
      .query(
        `
            -- Insert data from temp_psr_data into psr_data excluding the auto-increment primary key (psr_id)
                INSERT INTO psr_data (
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
                FROM temp_psr_data;
            `
      )
      .then(() => {
        // Drop the temp_psr_data table
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
    console.log("Error in updatePSRTable: ", error?.message || error);
    // Return error response
    return res
      .status(error.status || 500)
      .json({ message: error.message || error || "Internal Server Error" });
  }
};
