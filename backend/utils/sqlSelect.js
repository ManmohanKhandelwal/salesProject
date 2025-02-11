/**
 * Generates a SQL SELECT query string based on the provided parameters.
 *
 * @param {Object} params - The parameters for the SQL SELECT query.
 * @param {Array<string>} [params.Queries=["*"]] - The columns to select in the query.
 * @param {string} [params.TableName=""] - The name of the table to query.
 * @param {Object} [params.Where={}] - The conditions for the WHERE clause.
 * @param {Array<string>} [params.GroupBy=[]] - The columns to group by in the query.
 * @param {number} [params.Limit=10] - The limit for the number of rows to return.
 * @param {boolean} [params.IsDeleted=false] - Whether to include a condition for deleted rows.
 * @returns {string} The generated SQL SELECT query string.
 * @throws {Error} If Queries is not a non-empty array or TableName is not a non-empty string.
 */
export const SQLSelect = ({
  Queries = ["*"],
  TableName = "",
  Where = {},
  GroupBy = [],
  Limit = 10,
  IsDeleted = false,
}) => {
  if (!Array.isArray(Queries) || Queries.length === 0) {
    throw new Error("Queries must be a non-empty array");
  }
  if (typeof TableName !== "string" || TableName.trim() === "") {
    throw new Error("TableName must be a non-empty string");
  }

  let query = `SELECT ${Queries.join(", ")} FROM ${TableName}`;

  // Handle WHERE clause dynamically
  if (Object.keys(Where).length > 0) {
    const conditions = Object.entries(Where)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(" AND ");
    if (IsDeleted) {
      conditions += ` AND isDeleted = 1`;
    }
    query += ` WHERE ${conditions}`;
  }

  // Handle GROUP BY clause
  if (Array.isArray(GroupBy) && GroupBy.length > 0) {
    query += ` GROUP BY ${GroupBy.join(", ")}`;
  }
  //Add limit clause
  if(Limit!=0)
  query += ` LIMIT ${Limit}`;

  return query;
};

export default SQLSelect;