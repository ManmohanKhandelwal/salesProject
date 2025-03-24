// GET TOP 100 STORES
const defaultTop100Stores=`
        SELECT
            psr.customer_code AS store_code,
            psr.customer_name AS store_name,
            psr.customer_type,
            psr.channel_description AS channel,
            SUM(psr.retailing) AS total_retailing,
            AVG(psr.retailing) AS avg_retailing
        FROM
            psr_data psr
            JOIN store_mapping store ON psr.customer_code = store.New_Store_Code
        WHERE
            psr.document_date BETWEEN ? AND ?
        GROUP BY
            psr.customer_code,
            psr.customer_name,
            psr.customer_type,
            psr.channel_description
        ORDER BY
            total_retailing DESC
        LIMIT
            100;
`;
 export {defaultTop100Stores};