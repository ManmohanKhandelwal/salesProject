import { deleteFileByUUID } from "#utils/deleteFileByUUID.js";

export const deleteTempFile = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) throw { message: "File Path is required!", status: 400 };
    deleteFileByUUID(jobId);
    return res.status(200).json({ message: `File Removed !` });
  } catch (error) {
    console.log("Error in deleteTempFile: ", error?.message || error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || error || "Internal Server Error" });
  }
};
