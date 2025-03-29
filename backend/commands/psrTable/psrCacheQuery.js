const retailingSumQuery = `SELECT
        SUM(retailing) AS retailing_sum
FROM
        psr_data;
`;

const branchDetailsQuery = `SELECT
        store.New_Branch,
        SUM(p.retailing) AS total_retailing
FROM
        psr_data p
        JOIN store_mapping store ON p.customer_code = store.Old_Store_Code
GROUP BY
        store.New_Branch
ORDER BY
        total_retailing DESC
LIMIT
        1;`;
const brandDetailsQuery = `
SELECT
        brand,
        SUM(retailing) AS total_retailing
FROM
        psr_data
GROUP BY
        brand
ORDER BY
        total_retailing DESC
LIMIT
        1;`;

export { retailingSumQuery, branchDetailsQuery, brandDetailsQuery };
