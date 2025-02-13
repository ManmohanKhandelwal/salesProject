export const SQLSelect = ({
  Queries = ["*"],
  TableName = "",
  Where = {},
  JoinBy = {},
  GroupBy = [],
  OrderBy = "",
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

  // Handle JOIN clause dynamically
  if (Object.keys(JoinBy).length > 0) {
    Object.entries(JoinBy).forEach(([table, condition]) => {
      query += ` JOIN ${table} ON ${condition}`;
    });
  }

  // Handle WHERE clause dynamically
  let conditions = [];
  if (Object.keys(Where).length > 0) {
    conditions = Object.entries(Where).map(([key, value]) => `${key} = '${value}'`);
  }
  if (IsDeleted) {
    conditions.push(`isDeleted = 1`);
  }
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Handle GROUP BY clause
  if (Array.isArray(GroupBy) && GroupBy.length > 0) {
    query += ` GROUP BY ${GroupBy.join(", ")}`;
  }

  // Handle ORDER BY clause
  if (OrderBy !== "") {
    query += ` ORDER BY ${OrderBy}`;
  }

  // Add LIMIT clause
  if (Limit !== 0) {
    query += ` LIMIT ${Limit}`;
  }

  return query;
};

export default SQLSelect;
