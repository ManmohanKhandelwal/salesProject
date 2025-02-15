import mySqlPool from "#config/db.js";
export const getFilteredDashBoardData = async (req, res) => {
  try {
    const queries = req.body;
    console.clear();

    // Month Name -> Month Number Mapping
    const monthMapping = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Mapping frontend filter keys to corresponding DB columns
    const formattedQueryKeys = {
      years: "YEAR(psr_data.document_date)",
      months: "MONTH(psr_data.document_date)",
      category: "psr_data.category",
      brand: "psr_data.brand",
      brandform: "psr_data.brandform",
      subBrandform: "psr_data.subbrandform_name",
      customer_type: "psr_data.customer_type",
      channel: "psr_data.channel_description",
      branches: "store_mapping.New_Branch",
      zm: "store_mapping.ZM",
      sm: "store_mapping.SM",
      be: "store_mapping.BE",
      broadChannel: "channel_mapping.broad_channel",
      shortChannel: "channel_mapping.short_channel",
    };

    // Remove filters where value is "all"
    const filteredQueries = Object.entries(queries).reduce(
      (acc, [key, value]) => {
        if (value.length > 0 && !value.includes("all")) {
          // Convert month names to numbers if filtering by months
          if (key === "months") {
            acc[key] = value.map((month) => monthMapping[month] || month);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      },
      {}
    );

    console.log("Filtered Queries:", filteredQueries);

    // Identify tables required based on filters
    const requiresStoreMapping = Object.keys(filteredQueries).some((key) =>
      ["branches", "zm", "sm", "be"].includes(key)
    );
    const requiresChannelMapping = Object.keys(filteredQueries).some((key) =>
      ["broadChannel", "shortChannel"].includes(key)
    );

    // Build WHERE conditions dynamically
    let whereClause = "";
    let queryParams = [];

    if (Object.keys(filteredQueries).length > 0) {
      whereClause =
        "WHERE " +
        Object.entries(filteredQueries)
          .map(([key, values]) => {
            const column = formattedQueryKeys[key]; // Get corresponding DB column
            const placeholders = values.map(() => "?").join(", ");
            queryParams.push(...values);
            return `${column} IN (${placeholders})`;
          })
          .join(" AND ");
    }

    // Construct FROM and JOINs based on required tables
    let fromClause = "FROM psr_data";
    if (requiresStoreMapping) {
      fromClause +=
        " LEFT JOIN store_mapping ON psr_data.customer_code = store_mapping.Old_Store_Code";
    }
    if (requiresChannelMapping) {
      fromClause +=
        " LEFT JOIN channel_mapping ON psr_data.channel_description = channel_mapping.channel";
    }

    // Get database connection
    const connection = await mySqlPool.getConnection();
    await connection.query("SET SESSION sql_mode = ''");

    // SQL Query (Dynamically Includes JOINs Only When Required)
    const sqlQuery = `
      SELECT psr_data.*
      ${
        requiresStoreMapping
          ? ", store_mapping.New_Branch, store_mapping.ZM, store_mapping.SM, store_mapping.BE"
          : ""
      }
      ${
        requiresChannelMapping
          ? ", channel_mapping.broad_channel, channel_mapping.short_channel"
          : ""
      }
      ${fromClause}
      ${whereClause}
    `;

    console.log("Final SQL Query:", sqlQuery);
    console.log("Query Params:", queryParams);

    const [filteredDashboardData] = await connection.query(
      sqlQuery,
      queryParams
    );
    const totalRetailingValue = filteredDashboardData.reduce(
      (acc, curr) => acc + curr.retailing,
      0
    );
    //check highest retailing brand by aggregating retailing values amd name of the brand
    // topRetailingBrand: {
    //   title:
    //   value:
    // },
    const topRetailingBrand = filteredDashboardData.reduce(
      (acc, curr) => {
        if (acc.value < curr.retailing) {
          acc.value = curr.retailing;
          acc.title = curr.brand;
        }
        return acc;
      },
      { title: "", value: 0 }
    );

    // Release connection
    connection.release();
    console.log("Filtered Dashboard Data:", filteredDashboardData);

    return res.status(200).json({ filteredDashboardData });
  } catch (error) {
    console.error("Error fetching filtered dashboard data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
