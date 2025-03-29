//=======================================================================
//======================= For Category Query ===============================
//=======================================================================
const brandDataForCategoryQuery = `
   WITH
      brand_sales AS (
         SELECT
               brand,
               SUM(retailing) AS total_retailing
         FROM
               psr_data
         WHERE
               category = ?
         GROUP BY
               brand
      )
   SELECT
      brand,
      total_retailing
   FROM
      brand_sales
   WHERE
      total_retailing = (
         SELECT
               MAX(total_retailing)
         FROM
               brand_sales
      )
      OR total_retailing = (
         SELECT
               MIN(total_retailing)
         FROM
               brand_sales
      );
   `;

const trendDataForCategoryQuery = `
   SELECT
      DATE_FORMAT (document_date, '%Y-%m') AS month_year,
      SUM(retailing) AS total_retailing
   FROM
      psr_data
   WHERE
      category = ?
   GROUP BY
      month_year
   ORDER BY
      month_year;
`;

const storeDataForCategoryQuery = `
   WITH
    branch_sales AS (
        SELECT
            store.New_Branch AS branch,
            SUM(psr.retailing) AS total_retailing
        FROM
            psr_data psr
            JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
        WHERE
            category = ?
        GROUP BY
            store.New_Branch
    )
   SELECT
      branch,
      total_retailing
   FROM
      branch_sales
   WHERE
      total_retailing = (
         SELECT
               MAX(total_retailing)
         FROM
               branch_sales
      )
      OR total_retailing = (
         SELECT
               MIN(total_retailing)
         FROM
               branch_sales
      );
`;


//=======================================================================
//======================= For Brand Query ===============================
//=======================================================================

const brandDataForBrandQuery = `
WITH
    brand_sales AS (
        SELECT
            brand,
            SUM(retailing) AS total_retailing
        FROM
            psr_data
        GROUP BY
            brand
    )
   SELECT
      brand,
      total_retailing
   FROM
      brand_sales
   WHERE
      total_retailing = (
         SELECT
               MAX(total_retailing)
         FROM
               brand_sales
      )
      OR total_retailing = (
         SELECT
               MIN(total_retailing)
         FROM
               brand_sales
      );
`;

const brandFormDataForBrandQuery = `
WITH
    brandform_sales AS (
        SELECT
            brandform,
            subbrandform_name,
            SUM(retailing) AS total_retailing
        FROM
            psr_data
        WHERE
            brand = ?
        GROUP BY
            brandform,
            subbrandform_name
    )
   SELECT
      brandform,
      subbrandform_name,
      total_retailing
   FROM
      brandform_sales
   WHERE
      total_retailing = (
         SELECT
               MAX(total_retailing)
         FROM
               brandform_sales
      )
      OR total_retailing = (
         SELECT
               MIN(total_retailing)
         FROM
               brandform_sales
      );
`;

const trendDataForBrandQuery = `
   SELECT
      DATE_FORMAT (document_date, '%Y-%m') AS month_year,
      SUM(retailing) AS total_retailing
   FROM
      psr_data
   WHERE
      brand = ?
   GROUP BY
      month_year
   ORDER BY
      month_year;
`;

const storeDataForBrandQuery = `
   WITH
      branch_sales AS (
         SELECT
               store.New_Branch AS branch,
               SUM(psr.retailing) AS total_retailing
         FROM
               psr_data psr
               JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
         WHERE
               brand = ?
         GROUP BY
               store.New_Branch
      )
   SELECT
      branch,
      total_retailing
   FROM
      branch_sales
   WHERE
      total_retailing = (
         SELECT
               MAX(total_retailing)
         FROM
               branch_sales
      )
      OR total_retailing = (
         SELECT
               MIN(total_retailing)
         FROM
               branch_sales
      );
`;


export {
    brandDataForCategoryQuery,
    trendDataForCategoryQuery,
    storeDataForCategoryQuery,
    brandDataForBrandQuery,
    brandFormDataForBrandQuery,
    trendDataForBrandQuery,
    storeDataForBrandQuery
}