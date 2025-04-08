import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData } from "#utils/cacheManager.js";

// ✅ Only check meaningful filters (excluding topStoresCount & offset)
const isTruthyFilter = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const getTopStores = async (req, res) => {
  try {
    let {
      branchName = "",
      topStoresCount = 100,
      zoneManager = "",
      salesManager = "",
      branchExecutive = "",
      categoryName = [],
      brandName = [],
      brandFormName = [],
      broadChannelName = [],
      startDate = "",
      endDate = "",
      offset = 0,
    } = req.body; // ✅ Use req.query instead of req.params

    const filters = [
      branchName,
      zoneManager,
      salesManager,
      branchExecutive,
      categoryName,
      brandName,
      brandFormName,
      broadChannelName,
    ];

    const shouldNotUseCache = filters.some(isTruthyFilter);

    console.log("Request Body : ", req.body);
    console.log("Should Use Cache ? :--- ", !shouldNotUseCache);

    // ✅ Use cache only when no filters are applied
    if (!shouldNotUseCache) {
      const cachedData = await getCachedData(DB_CACHE_KEYS.TOP_100_STORE);
      if (cachedData) {
        return res.json({ cached: true, cachedData });
      }
    }
    let query = "";
    if (startDate && endDate) {
      query = `
        WITH
            Filtered_Months AS (
              SELECT DISTINCT
                DATE_FORMAT (document_date, '%Y-%m') AS month
              FROM
                psr_data
              WHERE
                document_date BETWEEN '${startDate}' AND '${endDate}'
            ),
            Month_Count AS (
              SELECT
                COUNT(*) AS month_count
              FROM
                Filtered_Months
            )
          SELECT
            psr.customer_code AS store_code,
            psr.customer_name AS store_name,
            store.New_Branch AS branch_name,
            psr.customer_type,
            psr.channel_description AS channel,
            SUM(psr.retailing) AS total_retailing,
            SUM(psr.retailing) / (
              SELECT
                month_count
              FROM
                Month_Count
            ) AS avg_retailing
          FROM
            psr_data psr
            JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
            ${
              broadChannelName.length
                ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type"
                : ""
            }
          WHERE
            DATE_FORMAT (psr.document_date, '%Y-%m') IN (
              SELECT
                month
              FROM
                Filtered_Months
            )
      `;
    } else {
      query = `
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
      SUM(psr.retailing) / COUNT(DISTINCT DATE_FORMAT (psr.document_date, '%Y-%m')) AS avg_retailing
  FROM
      psr_data psr
      JOIN store_mapping store ON psr.customer_code = store.Old_Store_Code
      ${
        broadChannelName.length
          ? "JOIN channel_mapping cm ON psr.customer_type = cm.customer_type"
          : ""
      }
  WHERE
      DATE_FORMAT (psr.document_date, '%Y-%m') IN (
          SELECT
              month
          FROM
              Last_Three_Months
      )`;
    }
    let queryParams = [];
    let queryConditions = [];

    const queryFilters = [
      { field: "store.New_Branch", value: branchName, type: "string" },
      { field: "store.ZM", value: zoneManager, type: "string" },
      { field: "store.SM", value: salesManager, type: "string" },
      { field: "store.BE", value: branchExecutive, type: "string" },
      { field: "psr.category", value: categoryName, type: "array" },
      { field: "psr.brand", value: brandName, type: "array" },
      { field: "psr.brandform", value: brandFormName, type: "array" },
      { field: "cm.broad_channel", value: broadChannelName, type: "array" },
    ];

    // Build Query Conditions
    queryFilters.forEach(({ field, value, type }) => {
      if (!value) return; // Skip if value is empty
      if (Array.isArray(value) && value.length > 0 && type === "array") {
        // Handle array values
        queryConditions.push(`${field} IN (?)`);
        queryParams.push(value);
      } else if (type === "string") {
        // Handle string values
        queryConditions.push(`${field} = ?`);
        queryParams.push(value);
      }
    });

    // **Final Query Construction**
    if (queryConditions.length > 0) {
      query += " AND " + queryConditions.join(" AND ");
    }

    // ✅ **Final Query Structure**
    query += `
    GROUP BY
        psr.customer_code,
        psr.customer_name,
        store.New_Branch,
        psr.customer_type,
        psr.channel_description
    ORDER BY
        avg_retailing DESC
    LIMIT ? OFFSET ?;`;

    queryParams.push(topStoresCount, offset);

    console.log("Query Params", queryParams);
    console.log("Query", query);

    // ✅ **Execute Database Query**
    // const [topStoresDetails] = await mySqlPool.query(query, queryParams);

    res.json({
      cached: true,
      cachedData: [
        {
          channel: "eCommerce",
          store_code: "BGJAN_19187",
          store_name: "Flipkart India Private Limited - Haringhata",
          branch_name: "JANGALPUR",
          avg_retailing: 53430011.1,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 160290033.3,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19219",
          store_name: "RK WORLDINFOCOM PRIVATE LIMITED - Dankuni",
          branch_name: "JANGALPUR",
          avg_retailing: 31583083,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 94749249,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19258",
          store_name: "SUPERWELL COMTRADE PRIVATE LIMITED - Mohispota",
          branch_name: "JANGALPUR",
          avg_retailing: 28614915.803333,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 85844747.41,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_19244",
          store_name: "RELIANCE RETAIL LIMITED - Panchla",
          branch_name: "JANGALPUR",
          avg_retailing: 25675187.736667,
          customer_type: "MR (Hyper)",
          total_retailing: 77025563.21,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_95512",
          store_name: "Flipkart India Private Limited - Super Mart Chanditala",
          branch_name: "JANGALPUR",
          avg_retailing: 25269810.26,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 75809430.78,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19268",
          store_name: "RK WORLDINFOCOM PRIVATE LIMITED - Panchla",
          branch_name: "JANGALPUR",
          avg_retailing: 24372920.73,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 73118762.19,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGJAN_19344",
          store_name: "APOLLO HEALTHCO LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 20137069.423333,
          customer_type: "MR (Large A Pharmacy)",
          total_retailing: 60411208.27,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_19199",
          store_name: "MORE RETAIL PRIVATE LIMITED - Serampore",
          branch_name: "JANGALPUR",
          avg_retailing: 19997577.3,
          customer_type: "MR (Hyper)",
          total_retailing: 59992731.9,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19267",
          store_name: "MYNTRA JABONG INDIA PVT LTD",
          branch_name: "JANGALPUR",
          avg_retailing: 19873566.316667,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 59620698.95,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19217",
          store_name: "RK WORLDINFOCOM PRIVATE LIMITED - Sreerampore",
          branch_name: "JANGALPUR",
          avg_retailing: 15567633.366667,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 46702900.1,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_80192",
          store_name: "SPENCERS RETAIL LIMITED-DC",
          branch_name: "JANGALPUR",
          avg_retailing: 13822162.846667,
          customer_type: "MR (Hyper)",
          total_retailing: 41466488.54,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_40048",
          store_name: "QUENCY CONSULTANCY PVT.LTD.",
          branch_name: "JANGALPUR",
          avg_retailing: 11143715.035,
          customer_type: "eCom Pure Play Other (eCommerce)",
          total_retailing: 22287430.07,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19247",
          store_name: "INNOVATIVE RETAIL CONCEPTS PRIVATE LIMITED - Bhangar",
          branch_name: "JANGALPUR",
          avg_retailing: 11006092.473333,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 33018277.42,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19198",
          store_name: "FLIPKART INDIA PRIVATE LIMITED - Amta1",
          branch_name: "JANGALPUR",
          avg_retailing: 9374723.886667,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 28124171.66,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19190",
          store_name: "SCOOTSY LOGISTICS PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 8945752.266667,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 26837256.8,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGJAN_19343",
          store_name: "APOLLO HEALTHCO LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 7583567.286667,
          customer_type: "MR (Large A Pharmacy)",
          total_retailing: 22750701.86,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19272",
          store_name: "RK WORLDINFOCOM PRIVATE LIMITED - SCCX",
          branch_name: "JANGALPUR",
          avg_retailing: 6977630,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 13955260,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_19260",
          store_name: "RELIANCE RETAIL LIMITED - Amta",
          branch_name: "JANGALPUR",
          avg_retailing: 6976560.85,
          customer_type: "MR (Hyper)",
          total_retailing: 20929682.55,
        },
        {
          channel: "Cash&Carry",
          store_code: "BGJAN_80185",
          store_name: "Metro Cash & Carry India Private Limited",
          branch_name: "JANGALPUR",
          avg_retailing: 6802996.193333,
          customer_type: "MR (Cash&Carry)",
          total_retailing: 20408988.58,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19147",
          store_name: "FLIPKART INDIA PVT. LTD.-Uluberia",
          branch_name: "JANGALPUR",
          avg_retailing: 6784826.433333,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 20354479.3,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_67121",
          store_name: "67121_GARG TRADING CO._Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 5382063.11,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 16146189.33,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19179",
          store_name: "Flipkart India Pvt Ltd - Supermart",
          branch_name: "JANGALPUR",
          avg_retailing: 4934649.873333,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 14803949.62,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_98001",
          store_name: "GRS ENTERPRISES",
          branch_name: "JANGALPUR",
          avg_retailing: 4830135.01,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 14490405.03,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19212",
          store_name: "KIRANAKART TECHNOLOGIES PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 4415822.95,
          customer_type: "eCom Pure Play Other (eCommerce)",
          total_retailing: 13247468.85,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19194",
          store_name: "NYKAA E-RETAIL PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 4272154.336667,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 12816463.01,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19142",
          store_name: "NYKAA E-RETAIL PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 4239602.166667,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 12718806.5,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_98002",
          store_name: "VIGNESH ENTERPRISE",
          branch_name: "JANGALPUR",
          avg_retailing: 2980697.56,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 8942092.68,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_99156",
          store_name: "ARAMBAGH FOODMART PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 2977320.23,
          customer_type: "New HFS (Hyper)",
          total_retailing: 2977320.23,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_99164",
          store_name: "99164_GRANARY WHOLESALE PRIVATE LIMITED - Sonai",
          branch_name: "JANGALPUR",
          avg_retailing: 2970838.023333,
          customer_type: "eCom B2B MR (eCommerce)",
          total_retailing: 8912514.07,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGJAN_62113",
          store_name: "EMAMI FRANK ROSS LTD.",
          branch_name: "JANGALPUR",
          avg_retailing: 2893938.63,
          customer_type: "New (Large A Pharmacy)",
          total_retailing: 2893938.63,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_26962",
          store_name: "KASHISH TRADING",
          branch_name: "JANGALPUR",
          avg_retailing: 2819664.53,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 8458993.59,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19218",
          store_name: "FSN DISTRIBUTION PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 2691050.496667,
          customer_type: "eCom B2B MR (eCommerce)",
          total_retailing: 8073151.49,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19273",
          store_name: "FLIPKART INDIA PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 2413799.13,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 2413799.13,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGJAN_62113",
          store_name: "EMAMI FRANK ROSS LTD.",
          branch_name: "JANGALPUR",
          avg_retailing: 2405947.04,
          customer_type: "HFS (Large A Pharmacy)",
          total_retailing: 4811894.08,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_99156",
          store_name: "ARAMBAGH FOODMART PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 2298681.955,
          customer_type: "HFS (Hyper)",
          total_retailing: 4597363.91,
        },
        {
          channel: "Hyper",
          store_code: "BGJAN_80182",
          store_name: "RELIANCE RETAIL LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 2250295.75,
          customer_type: "MR (Hyper)",
          total_retailing: 4500591.5,
        },
        {
          channel: "Super",
          store_code: "BGJAN_19239",
          store_name: "V MART RETAIL LIMITED - LIC Building",
          branch_name: "JANGALPUR",
          avg_retailing: 2056893.71,
          customer_type: "HFS (Super)",
          total_retailing: 4113787.42,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19269",
          store_name: "RK WORLDINFOCOM PRIVATE LIMITED - CCX2",
          branch_name: "JANGALPUR",
          avg_retailing: 2001457.585,
          customer_type: "eCom Open Market MR (eCommerce)",
          total_retailing: 4002915.17,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_26932",
          store_name: "V-26932_RAJESH MEDICAL & CO._Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 1714994.703333,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 5144984.11,
        },
        {
          channel: "Super",
          store_code: "BGJAN_19239",
          store_name: "V MART RETAIL LIMITED - LIC Building",
          branch_name: "JANGALPUR",
          avg_retailing: 1603693.03,
          customer_type: "New HFS (Super)",
          total_retailing: 1603693.03,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGHAB_90838",
          store_name: "V-90838_JAY MATA DI COSMETICS (Credit)",
          branch_name: "HABRA",
          avg_retailing: 1412208.49,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 4236625.47,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGNWS_66919",
          store_name: "66919_S B & Sons_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 1324380.17,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 2648760.34,
        },
        {
          channel: "Super",
          store_code: "BGBLN_67279",
          store_name: "67279_MODERN RETAILS (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 1227644.32,
          customer_type: "New HFS Sectorized (Super)",
          total_retailing: 1227644.32,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGJAN_95510",
          store_name: "OPTIVAL HEALTH SOLUTIONS  PVT.LTD",
          branch_name: "JANGALPUR",
          avg_retailing: 1176523.14,
          customer_type: "MR (Large A Pharmacy)",
          total_retailing: 3529569.42,
        },
        {
          channel: "Super",
          store_code: "BGBLN_95544",
          store_name: "95544_BIMLA ENTERPRISES (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 1102434.716667,
          customer_type: "HFS (Super)",
          total_retailing: 3307304.15,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGNWS_18026",
          store_name: "18026_MRITYUNJOY STORES ($PDC)_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 1089470.22,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 3268410.66,
        },
        {
          channel: "Large A Beauty",
          store_code: "BGNWS_99934",
          store_name: "99934_BAGARIA BROTHERS_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 1068412.66,
          customer_type: "HFS (Large A Beauty)",
          total_retailing: 3205237.98,
        },
        {
          channel: "Semi WS Beauty",
          store_code: "BGNWS_71073",
          store_name: "71073_QUENCY CONSULTANCY PVT. LTD. (Credit)",
          branch_name: "NORTH_WS",
          avg_retailing: 1054081.616667,
          customer_type: "WS Platinum (Semi WS Beauty)",
          total_retailing: 3162244.85,
        },
        {
          channel: "Super",
          store_code: "BGBLN_67278",
          store_name: "67278_NEW SUPER STORE (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 987004.17,
          customer_type: "New HFS Sectorized (Super)",
          total_retailing: 987004.17,
        },
        {
          channel: "Super",
          store_code: "BGJAN_80212",
          store_name: "V MART RETAIL LIMITED - NAIHATI",
          branch_name: "JANGALPUR",
          avg_retailing: 923840.24,
          customer_type: "New HFS (Super)",
          total_retailing: 923840.24,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_26288",
          store_name: "V-26288_VIKRAM PHARMA_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 849636.74,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 2548910.22,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGHAB_03980",
          store_name: "03980_NEW MATRI VT STORES (Credit)",
          branch_name: "HABRA",
          avg_retailing: 793373.97,
          customer_type: "WS Gold (WS Non-Feeder Traditional)",
          total_retailing: 2380121.91,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGBAR_03213",
          store_name: "03213_MA TARA STORES (CREDIT)",
          branch_name: "BARASAT",
          avg_retailing: 759715.715,
          customer_type: "WS Silver (WS Non-Feeder Traditional)",
          total_retailing: 1519431.43,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_18021",
          store_name: "V-18021_AMBEY STORE_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 711675.006667,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 2135025.02,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGNWS_18032",
          store_name: "18032_SHREE KRISHNA ENTERPRISE_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 703335.676667,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 2110007.03,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGNWS_Z0018",
          store_name: "V-Z0018_NAMAN STORE_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 696541.053333,
          customer_type: "WS Gold (WS Non-Feeder Traditional)",
          total_retailing: 2089623.16,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGNWS_19110",
          store_name: "19110_THE UDAY SHANKER STORES_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 690071.73,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 2070215.19,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGBAR_57119",
          store_name: "57119_KALPANA MEDICAL AGENCY (Credit)",
          branch_name: "BARASAT",
          avg_retailing: 689323.166667,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 2067969.5,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_67127",
          store_name: "67127_P K ENTERPRISE_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 689104.14,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1378208.28,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGBAR_45781",
          store_name: "45781_M/S - MAA ANNAPURNA ENTERPRISE (Credit)",
          branch_name: "BARASAT",
          avg_retailing: 688898.403333,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 2066695.21,
        },
        {
          channel: "Large A Pharmacy",
          store_code: "BGBLN_54968",
          store_name: "54968_AMERICAN DRY FRUITS (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 683797.256667,
          customer_type: "HFS (Large A Pharmacy)- L type- Sectorized",
          total_retailing: 2051391.77,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGBAG_Z0004",
          store_name: "Z0004_MAZUMDER & MAZUMDER (Credit)",
          branch_name: "BAGHAJATIN",
          avg_retailing: 681977.473333,
          customer_type: "WS Gold (Semi WS Traditional)",
          total_retailing: 2045932.42,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGNWS_17081",
          store_name: "17081_JAY MA TARA STORES_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 671991.39,
          customer_type: "WS Gold (WS Non-Feeder Traditional)",
          total_retailing: 671991.39,
        },
        {
          channel: "Super",
          store_code: "BGJAN_19274",
          store_name: "V MART RETAIL LIMITED - Dankuni",
          branch_name: "JANGALPUR",
          avg_retailing: 664469.46,
          customer_type: "New HFS (Super)",
          total_retailing: 664469.46,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGBAS_60652",
          store_name: "60652_SIBANI PHARMA (Credit)",
          branch_name: "BASIRHAT",
          avg_retailing: 658558.803333,
          customer_type: "WS Gold (WS Non-Feeder Pharmacy)",
          total_retailing: 1975676.41,
        },
        {
          channel: "Super",
          store_code: "BGJAN_19271",
          store_name: "FLEET LABS TECHNOLOGIES PRIVATE LIMITED",
          branch_name: "JANGALPUR",
          avg_retailing: 642881.79,
          customer_type: "HFS (Super)",
          total_retailing: 1285763.58,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGNWS_12201",
          store_name: "12201_UMA SHANKAR SHAW_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 623353.125,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 1246706.25,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_89821",
          store_name: "V-89821_AMAR STORES_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 609689.426667,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1829068.28,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_26307",
          store_name: "V-26307_DRUG HOUSE_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 579885.383333,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1739656.15,
        },
        {
          channel: "Super",
          store_code: "BGBLN_67211",
          store_name: "67211_HOME MART (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 571442.076667,
          customer_type: "HFS (Super)",
          total_retailing: 1714326.23,
        },
        {
          channel: "Super",
          store_code: "BGBAS_47162",
          store_name: "47162_V MART RETAIL LIMITED - Basirhat",
          branch_name: "BASIRHAT",
          avg_retailing: 562348.2,
          customer_type: "New HFS (Super)",
          total_retailing: 562348.2,
        },
        {
          channel: "Super",
          store_code: "BGBLN_67279",
          store_name: "67279_MODERN RETAILS (Cash)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 546242.58,
          customer_type: "New HFS Sectorized (Super)",
          total_retailing: 1092485.16,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGHAB_03977",
          store_name: "03977_NEW MATRI BHANDER (Credit)",
          branch_name: "HABRA",
          avg_retailing: 527951.54,
          customer_type: "WS Platinum (WS Non-Feeder Traditional)",
          total_retailing: 1583854.62,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_26286",
          store_name: "26286_M/S. JAY MATA DI_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 517642.186667,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1552926.56,
        },
        {
          channel: "WS Feeder Traditional",
          store_code: "BGSHY_08534",
          store_name: "08534_BABY ALEX CENTER(BINOD SHAW) (Credit)",
          branch_name: "SHYAMNAGAR",
          avg_retailing: 515764.613333,
          customer_type: "Maximus 2 WS Platinum (WS Feeder Traditional)",
          total_retailing: 1547293.84,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGNWS_19134",
          store_name: "19134_THE CHARU BHANDER (Credit)",
          branch_name: "NORTH_WS",
          avg_retailing: 514186.22,
          customer_type: "WS Gold (Semi WS Traditional)",
          total_retailing: 1028372.44,
        },
        {
          channel: "Large A Beauty",
          store_code: "BGBLN_66066",
          store_name: "66066_C.M.Cosmetics (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 504006.906667,
          customer_type: "HFS Sectorized (Large A Beauty)",
          total_retailing: 1512020.72,
        },
        {
          channel: "eCommerce",
          store_code: "BGJAN_19192",
          store_name: "DEALSHARE",
          branch_name: "JANGALPUR",
          avg_retailing: 503160.25,
          customer_type: "eCom Pure Play MR (eCommerce)",
          total_retailing: 1509480.75,
        },
        {
          channel: "WS Feeder Traditional",
          store_code: "BGBAS_Z0026",
          store_name: "Z0026_GHOSH STORES (Credit)",
          branch_name: "BASIRHAT",
          avg_retailing: 499256.076667,
          customer_type: "WS Platinum (WS Feeder Traditional)",
          total_retailing: 1497768.23,
        },
        {
          channel: "Super",
          store_code: "BGBON_05141",
          store_name: "05141_V MART BONGAON",
          branch_name: "BONGAON",
          avg_retailing: 498695.98,
          customer_type: "HFS (Super)",
          total_retailing: 997391.96,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGNWS_67163",
          store_name: "67163_JAISWAL STORES_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 472812.3,
          customer_type: "WS Platinum (WS Non-Feeder Traditional)",
          total_retailing: 945624.6,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGJOK_10094",
          store_name: "10094_GUPTA TRADING (Credit)",
          branch_name: "JOKA",
          avg_retailing: 468985.286667,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 1406955.86,
        },
        {
          channel: "WS Non-Feeder Traditional",
          store_code: "BGBLN_53235",
          store_name: "53235_SHIB SHAKTI BHANDAR (Credit)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 466563.97,
          customer_type: "WS Platinum (WS Non-Feeder Traditional)",
          total_retailing: 933127.94,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGBAS_01819",
          store_name: "01819_RAMKRISHNA PHARMA (Credit)",
          branch_name: "BASIRHAT",
          avg_retailing: 459902.76,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 459902.76,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGHAB_90647",
          store_name: "90647_BIKASH STORES (Credit)",
          branch_name: "HABRA",
          avg_retailing: 454851.823333,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1364555.47,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGNWS_99023",
          store_name: "99023_NEW SURGICAL AGENCY_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 436734.38,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 1310203.14,
        },
        {
          channel: "Super",
          store_code: "BGBLN_67278",
          store_name: "67278_NEW SUPER STORE (Cash)",
          branch_name: "BALLYGUNJ",
          avg_retailing: 428414.72,
          customer_type: "New HFS Sectorized (Super)",
          total_retailing: 856829.44,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGNWS_18039",
          store_name: "18039_GANAPATI COSMETICS_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 426970.82,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 1280912.46,
        },
        {
          channel: "Semi WS Pharmacy",
          store_code: "BGRAJ_30250",
          store_name: "30250_JOYDEB ENTERPRISE (Credit)",
          branch_name: "RAJARHAT",
          avg_retailing: 424988.92,
          customer_type: "WS Platinum (Semi WS Pharmacy)",
          total_retailing: 1274966.76,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGBAR_12020",
          store_name: "12020_A2 PHARMA (Credit)",
          branch_name: "BARASAT",
          avg_retailing: 423152.02,
          customer_type: "WS Gold (Semi WS Traditional)",
          total_retailing: 1269456.06,
        },
        {
          channel: "Large B Pharmacy",
          store_code: "BGJOK_45681",
          store_name: "45681_D W D PHARMACEUTICALS LTD. (Cash)",
          branch_name: "JOKA",
          avg_retailing: 414954.05,
          customer_type: "New (Large B Pharmacy)",
          total_retailing: 829908.1,
        },
        {
          channel: "WS Feeder Traditional",
          store_code: "BGJOY_08004",
          store_name: "08004_MAHARANI STORES (Credit)",
          branch_name: "JOYNAGAR",
          avg_retailing: 412161.965,
          customer_type: "WS Gold (WS Feeder Traditional)",
          total_retailing: 824323.93,
        },
        {
          channel: "WS Non-Feeder Pharmacy",
          store_code: "BGNWS_26294",
          store_name: "26294_NEW BHARAT AGENCY_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 411862.736667,
          customer_type: "WS Platinum (WS Non-Feeder Pharmacy)",
          total_retailing: 1235588.21,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGJOK_70019",
          store_name: "70019_SRI RADHAYSHYAM STORES (Credit)",
          branch_name: "JOKA",
          avg_retailing: 411548.015,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 823096.03,
        },
        {
          channel: "Semi WS Beauty",
          store_code: "BGNWS_17187",
          store_name:
            "17187_QUENCY CONSULTANCY PVT. LTD. (SANTOSHPUR) (Credit)",
          branch_name: "NORTH_WS",
          avg_retailing: 408477.165,
          customer_type: "New WS Gold (Semi WS Beauty)",
          total_retailing: 816954.33,
        },
        {
          channel: "WS Feeder Traditional",
          store_code: "BGRAJ_22426",
          store_name: "22426_NARAYANI BHANDER (Credit)",
          branch_name: "RAJARHAT",
          avg_retailing: 406539.243333,
          customer_type: "WS Silver (WS Feeder Traditional)",
          total_retailing: 1219617.73,
        },
        {
          channel: "Large A Beauty",
          store_code: "BGNWS_52470",
          store_name: "52470_NEW BHARAT AGENCY_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 395772.746667,
          customer_type: "HFS (Large A Beauty)",
          total_retailing: 1187318.24,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGSHY_14179",
          store_name: "14179_NEW LAXMI STORE (Credit)",
          branch_name: "SHYAMNAGAR",
          avg_retailing: 393881.62,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 787763.24,
        },
        {
          channel: "Semi WS Traditional",
          store_code: "BGNWS_19044",
          store_name: "V-19044_GOUTAM STORES_Credit",
          branch_name: "NORTH_WS",
          avg_retailing: 393303.86,
          customer_type: "WS Platinum (Semi WS Traditional)",
          total_retailing: 1179911.58,
        },
        {
          channel: "WS Feeder Traditional",
          store_code: "BGSHI_10935",
          store_name: "10935_Ghosh Traders (Credit)",
          branch_name: "SHIBANIPUR",
          avg_retailing: 386377.55,
          customer_type: "WS Platinum (WS Feeder Traditional)",
          total_retailing: 1159132.65,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching top stores:", error?.message || error);
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};
