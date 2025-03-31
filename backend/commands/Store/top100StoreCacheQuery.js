/**
 * @name Store
 * @description Query to get the top 100 stores by average retailing
 * @returns {
 * store_code: String,
 * store_name: String,
 * branch_name: String,
 * customer_type: String,
 * channel: String,
 * total_retailing: Number,
 * avg_retailing: Number
 * }
 */
const top100StoresQuery = `
    WITH
        Last_Three_Months AS (
            SELECT DISTINCT
                DATE_FORMAT (document_date, '%Y-%m') AS month
            FROM
                psr_data
            ORDER BY
                month DESC
            LIMIT
                3
        )
    SELECT
        psr.customer_code AS store_code,
        psr.customer_name AS store_name,
        store.New_Branch AS branch_name,
        psr.customer_type,
        psr.channel_description AS channel,
        SUM(psr.retailing) AS total_retailing,
        SUM(psr.retailing) / COUNT(DISTINCT DATE_FORMAT (psr.document_date, '%Y-%m')) AS monthly_avg_retailing
    FROM
        psr_data psr
        JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
    WHERE
        DATE_FORMAT (psr.document_date, '%Y-%m') IN (
            SELECT
                month
            FROM
                Last_Three_Months
        )
    GROUP BY
        psr.customer_code,
        psr.customer_name,
        store.New_Branch,
        psr.customer_type,
        psr.channel_description
    ORDER BY
        monthly_avg_retailing DESC
    LIMIT
        100;
`;

export { top100StoresQuery };
