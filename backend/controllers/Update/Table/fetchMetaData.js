import mySqlPool from "#config/db.js";

export const getTablesMetaData = async (req, res) => {
  try {
    const { tableName } = req.query;
    console.log(tableName);
    if (tableName) {
      const [tableMetaData] = await mySqlPool.query(`DESCRIBE ${tableName}`);
      res.status(200).json(tableMetaData);
    } else {
      const [tablesMetaData] = await mySqlPool.query(`
                SELECT 
                    TABLE_SCHEMA AS database_name,
                    TABLE_NAME AS table_name,
                    COLUMN_NAME AS column_name,
                    ORDINAL_POSITION AS column_position,
                    COLUMN_DEFAULT AS default_value,
                    IS_NULLABLE AS is_nullable,
                    DATA_TYPE AS data_type,
                    CHARACTER_MAXIMUM_LENGTH AS max_length,
                    NUMERIC_PRECISION,
                    NUMERIC_SCALE,
                    COLUMN_TYPE,
                    COLUMN_KEY AS column_key,
                    EXTRA
                FROM information_schema.columns
                WHERE TABLE_SCHEMA = 'sales_db'
                ORDER BY TABLE_NAME, ORDINAL_POSITION;
`);
      res.status(200).json(tablesMetaData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
