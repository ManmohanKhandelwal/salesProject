export const TABLE_SCHEMAS = {
  channel_mapping: {
    code: `CREATE TABLE temp_channel_mapping (
        channel_id INT PRIMARY KEY AUTO_INCREMENT,
        customer_type VARCHAR(90),
        channel VARCHAR(45),
        broad_channel VARCHAR(45),
        short_channel VARCHAR(45)
    );`,
    rows: [
      "channel_id",
      "customer_type",
      "channel",
      "broad_channel",
      "short_channel",
    ],
  },
  psr_data: {
    code: `
      CREATE TABLE temp_psr_data (
          psr_id INT PRIMARY KEY AUTO_INCREMENT,
          document_no VARCHAR(45),
          document_date DATE,
          subbrandform_name VARCHAR(90),
          customer_name VARCHAR(120),
          customer_code VARCHAR(45),
          channel_description VARCHAR(45),
          customer_type VARCHAR(90),
          category VARCHAR(45),
          brand VARCHAR(45),
          brandform VARCHAR(45),
          retailing DECIMAL(12, 2)
      );
    `,
    rows: [
      "document_no",
      "document_date",
      "subbrandform_name",
      "customer_name",
      "customer_code",
      "channel_description",
      "customer_type",
      "category",
      "brand",
      "brandform",
      "retailing",
    ],
  },
  store_mapping: {
    code: `
      CREATE TABLE temp_store_mapping  (
       Id INT PRIMARY KEY AUTO_INCREMENT,
      Old_Store_Code VARCHAR(45),
      New_Store_Code VARCHAR(45),
      New_Branch VARCHAR(45),
      DSE_Code VARCHAR(45),
      ZM VARCHAR(45),
      SM VARCHAR(45),
      BE VARCHAR(45),
      STL VARCHAR(45)
      )
    `,
    rows: [
      "Old_Store_Code",
      "New_Store_Code",
      "New_Branch",
      "DSE_Code",
      "ZM",
      "SM",
      "BE",
      "STL",
    ],
  },
};
