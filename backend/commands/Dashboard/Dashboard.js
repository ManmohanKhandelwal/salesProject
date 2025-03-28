const retailingStatsQuery = `
    WITH
        latest_month AS (
            SELECT
                YEAR (MAX(document_date)) AS latest_year,
                MONTH (MAX(document_date)) AS latest_month
            FROM
                psr_data
        )
    SELECT
        lm.latest_year AS year,
        lm.latest_month AS month,
        SUM(
            CASE
                WHEN YEAR (pd.document_date) = lm.latest_year THEN pd.retailing
                ELSE 0
            END
        ) AS latest_total,
        SUM(
            CASE
                WHEN YEAR (pd.document_date) = lm.latest_year - 1 THEN pd.retailing
                ELSE 0
            END
        ) AS prev_total
    FROM
        psr_data pd
        JOIN latest_month lm ON MONTH (pd.document_date) = lm.latest_month
    GROUP BY
        lm.latest_year,
        lm.latest_month;
`;

const retailingByChannelQuery = `
    SELECT
        cm.broad_channel,
        SUM(pd.retailing) as totalRetailing
    FROM
        psr_data pd
        JOIN channel_mapping cm ON pd.customer_type = cm.customer_type
    GROUP BY
        cm.broad_channel;
`;

const retailingByCategoryQuery = `
    SELECT
        category,
        SUM(retailing) as totalRetailing
    FROM
        psr_data
    GROUP BY
        category;
`;

const retailTrendQuery = `
    SELECT
        YEAR (document_date) AS year,
        MONTH (document_date) AS month,
        SUM(retailing) AS totalRetailing
    FROM
        psr_data
    GROUP BY
        YEAR (document_date),
        MONTH (document_date);
`;

const topTenBrandFormQuery = `
    SELECT
        brandform,
        SUM(retailing) as totalRetailing
    FROM
        psr_data
    GROUP BY
        brandform
    ORDER BY
        totalRetailing DESC
    LIMIT
        10;
`;

export {
  retailingStatsQuery,
  retailingByChannelQuery,
  retailingByCategoryQuery,
  retailTrendQuery,
  topTenBrandFormQuery,
};