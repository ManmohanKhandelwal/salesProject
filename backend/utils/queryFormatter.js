export const SQLSelect = (Queries = [], TableName = "") => {
    if (!Array.isArray(Queries) || Queries.length === 0) {
        throw new Error("Queries must be a non-empty array");
    }
    if (typeof TableName !== "string" || TableName.trim() === "") {
        throw new Error("TableName must be a non-empty string");
    }

    const query = `SELECT ${Queries.join(", ")} FROM ${TableName}`;
    return query;
};
