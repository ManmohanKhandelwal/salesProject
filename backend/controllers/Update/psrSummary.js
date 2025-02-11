import mySqlPool from "../../config/db";

export const updatePSRSummary = async (req, res) => {
  try {
    const res = await mySqlPool.query(`
    USE sales_db;
    CREATE TABLE IF NOT EXISTS dashboard_summary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    retailing_sum DECIMAL(18,2),
    highest_retailing_branch VARCHAR(255),
    highest_retailing_branch_value DECIMAL(18,2),
    highest_retailing_brand VARCHAR(255),
    highest_retailing_brand_value DECIMAL(18,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO dashboard_summary (retailing_sum, highest_retailing_branch, highest_retailing_branch_value, highest_retailing_brand, highest_retailing_brand_value)
SELECT 
    (SELECT SUM(retailing) FROM psr_data) AS total_retailing,
    (SELECT sm.New_Branch FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1) AS highest_branch,
    (SELECT SUM(p.retailing) FROM psr_data p JOIN store_mapping sm ON p.customer_code = sm.New_Store_Code GROUP BY sm.New_Branch ORDER BY SUM(p.retailing) DESC LIMIT 1) AS highest_branch_value,
    (SELECT brand FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1) AS highest_brand,
    (SELECT SUM(retailing) FROM psr_data GROUP BY brand ORDER BY SUM(retailing) DESC LIMIT 1) AS highest_brand_value
ON DUPLICATE KEY UPDATE
    retailing_sum = VALUES(retailing_sum),
    highest_retailing_branch = VALUES(highest_retailing_branch),
    highest_retailing_branch_value = VALUES(highest_retailing_branch_value),
    highest_retailing_brand = VALUES(highest_retailing_brand),
    highest_retailing_brand_value = VALUES(highest_retailing_brand_value);    
        `);
    return res.status(200).json(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
