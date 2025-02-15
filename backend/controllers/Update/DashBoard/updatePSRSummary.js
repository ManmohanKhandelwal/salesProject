import mySqlPool from "#config/db.js";

export const updatePSRSummary = async (req, res) => {
  try {
    // Ensure table exists
    await mySqlPool.query(`
      CREATE TABLE IF NOT EXISTS dashboard_summary (
        id INT PRIMARY KEY AUTO_INCREMENT,
        retailing_sum DECIMAL(18,2),
        highest_retailing_branch VARCHAR(255),
        highest_retailing_branch_value DECIMAL(18,2),
        highest_retailing_brand VARCHAR(255),
        highest_retailing_brand_value DECIMAL(18,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Check if a record exists
    const [existingRows] = await mySqlPool.query("SELECT COUNT(*) as count FROM dashboard_summary");
    
    const query = existingRows[0].count > 0
      ? `UPDATE dashboard_summary 
         SET 
           retailing_sum = (SELECT SUM(retailing) FROM psr_data),
           highest_retailing_branch = (SELECT sm.New_Branch FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1),
           highest_retailing_branch_value = (SELECT SUM(p.retailing) FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1),
           highest_retailing_brand = (SELECT brand FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1),
           highest_retailing_brand_value = (SELECT SUM(retailing) FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1)
         WHERE id = 1;`
      : `INSERT INTO dashboard_summary (retailing_sum, highest_retailing_branch, highest_retailing_branch_value, highest_retailing_brand, highest_retailing_brand_value)
         SELECT 
           (SELECT SUM(retailing) FROM psr_data),
           (SELECT sm.New_Branch FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1),
           (SELECT SUM(p.retailing) FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1),
           (SELECT brand FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1),
           (SELECT SUM(retailing) FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1);`;

    // Execute the update or insert query
    const [result] = await mySqlPool.query(query);

    return res.status(200).json({ message: "Dashboard summary updated", result });
  } catch (error) {
    console.error("Error updating dashboard summary:", error);
    return res.status(500).json({ message: error.message });
  }
};
