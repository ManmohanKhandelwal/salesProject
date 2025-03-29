/**
 * @name Store
 * @description Query to get the top 100 stores by average retailing
 * @param {String} ? - Start date
 * @param {String} ? - End date
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
    SELECT
        psr.customer_code AS store_code,
        psr.customer_name AS store_name,
        store.New_Branch AS branch_name,
        psr.customer_type,
        psr.channel_description AS channel,
        SUM(psr.retailing) AS total_retailing,
        AVG(psr.retailing) AS avg_retailing
    FROM
        psr_data psr
        JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
        WHERE psr.document_date BETWEEN ? AND ?
    GROUP BY
        psr.customer_code,
        psr.customer_name,
        store.New_Branch,
        psr.customer_type,
        psr.channel_description
    ORDER BY
        avg_retailing DESC
    LIMIT
        100;
`;

export { top100StoresQuery };
