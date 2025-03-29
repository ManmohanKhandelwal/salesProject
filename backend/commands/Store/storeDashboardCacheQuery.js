const storeRevenueStatsQuery = `   WITH
        CustomerEarnings AS (
            SELECT
                p.customer_name,
                SUM(p.retailing) AS total_retailing
            FROM
                psr_data p
            GROUP BY
                p.customer_name
        )
    SELECT
        (
            SELECT
                customer_name
            FROM
                CustomerEarnings
            ORDER BY
                total_retailing DESC
            LIMIT
                1
        ) AS highest_earning_customer,
        (
            SELECT
                total_retailing
            FROM
                CustomerEarnings
            ORDER BY
                total_retailing DESC
            LIMIT
                1
        ) AS highest_retailing_amount,
        (
            SELECT
                customer_name
            FROM
                CustomerEarnings
            ORDER BY
                total_retailing ASC
            LIMIT
                1
        ) AS lowest_earning_customer,
        (
            SELECT
                total_retailing
            FROM
                CustomerEarnings
            ORDER BY
                total_retailing ASC
            LIMIT
                1
        ) AS lowest_retailing_amount;
    `;

const zoneManagerRetailingQuery = `
    SELECT
        store.ZM AS zone_manager,
        SUM(p.retailing) AS total_retailing
    FROM
        psr_data p
        JOIN store_mapping store ON p.customer_code = store.Old_Store_Code
    GROUP BY
        store.ZM;
    `;

const businessExecutiveRetailingQuery = `
    SELECT
        store.BE AS business_executive,
        SUM(p.retailing) AS total_retailing
    FROM
        psr_data p
        JOIN store_mapping store ON p.customer_code = store.Old_Store_Code
    GROUP BY
        store.BE;
    `;

export { storeRevenueStatsQuery, zoneManagerRetailingQuery, businessExecutiveRetailingQuery };