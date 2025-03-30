import { retailingByCategoryQuery, retailingByChannelQuery, retailingStatsQuery, retailTrendQuery, topTenBrandFormQuery } from "#commands/Dashboard/dashboardQuery.js";
import mySqlPool from "#config/db.js";
import { DB_CACHE_KEYS } from "#config/key.js";
import { getCachedData, updateCache } from "#utils/cacheManager.js";

export const updateDashBoardCache = async (req, res) => {
    try {
        // Get database connection
        await mySqlPool.query("SET SESSION sql_mode = ''");

        const [
            [[dashboardData]],
            [[retailingStats]],
            [retailingByChannel],
            [retailingByCategory],
            [retailTrend],
            [topTenBrandForm],
        ] = await Promise.all([
            getCachedData(DB_CACHE_KEYS.PSR_SUMMARY),
            mySqlPool.query(retailingStatsQuery),
            mySqlPool.query(retailingByChannelQuery),
            mySqlPool.query(retailingByCategoryQuery),
            mySqlPool.query(retailTrendQuery),
            mySqlPool.query(topTenBrandFormQuery),
        ]);


        // Format data functions
        const formatData = (arr, nameKey) =>
            arr.map((row) => ({
                name: row[nameKey],
                value: parseFloat(row.totalRetailing),
            }));

        const formattedRetailTrend = retailTrend.map((row) => ({
            year: row.year.toString(),
            month: row.month.toString(),
            value: parseFloat(row.totalRetailing),
        }));

        const percentageChangeinRetailing =
            retailingStats.prev_total > 0
                ? ((retailingStats.latest_total - retailingStats.prev_total) /
                    retailingStats.prev_total) *
                100
                : null;

        // Final Response Data
        const responseData = {
            totalRetailingValue: dashboardData.retailing_sum,
            latestMonthTotalRetailing: {
                year: retailingStats.year,
                month: retailingStats.month,
                total_retailing: retailingStats.latest_total,
            },
            previousYearSameMonthTotalRetailing: {
                year: retailingStats.year - 1,
                month: retailingStats.month,
                total_retailing: retailingStats.prev_total,
            },
            percentageChangeinRetailing: percentageChangeinRetailing,
            retailChannelData: formatData(retailingByChannel, "broad_channel"),
            retailCategoryData: formatData(retailingByCategory, "category"),
            topRetailingBrand: {
                title: dashboardData.highest_retailing_brand,
                value: dashboardData.highest_retailing_brand_value,
            },
            topRetailingBranch: {
                title: dashboardData.highest_retailing_branch,
                value: dashboardData.highest_retailing_branch_value,
            },
            retailTrendByMonthAndYear: formattedRetailTrend,
            topTenBrandForm: topTenBrandForm,
        };

        // Cache the response
        await updateCache(DB_CACHE_KEYS.SALES_DASHBOARD, responseData);
        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Error updating dashboard cache:", error?.message || error);
        return res.status(500).json({ error: error?.message || error });
    }
}