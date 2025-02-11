import { NextResponse } from "next/server";

/**
 * Handles POST requests to the dashboard route.
 *
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} - The response containing the initial dashboard data.
 */
export async function POST(req) {
  try {
    let data;

    if (process.env.NODE_ENV === "development") {
      const res = await fetch("http://localhost:5000/Dashboard/DashboardData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      data = await res.json();
      const dataToSend = {
        totalRetailingValue: data.totalRetailingValue,
        topRetailingBrand: data.topRetailingBrand,
        topRetailingBranch: data.topRetailingBranch,
        retailChannelData: data.retailChannelData,
        retailChannelBrandData: [
          { name: "Brand A1", value: 250 },
          { name: "Brand A2", value: 150 },
          { name: "Brand B1", value: 200 },
          { name: "Brand B2", value: 100 },
          { name: "Brand C1", value: 90 },
          { name: "Brand C2", value: 110 },
          { name: "Brand C3", value: 100 },
          { name: "Brand D1", value: 100 },
          { name: "Brand D2", value: 100 },
          { name: "Brand E1", value: 178 },
          { name: "Brand E2", value: 100 },
          { name: "Brand F1", value: 146 },
          { name: "Brand F2", value: 100 },
          { name: "Brand F3", value: 100 },
        ],
        retailCategoryChannelData: data.retailCategoryData,
        retailCategoryBrandData: [
          { name: "Brand A1", value: 250 },
          { name: "Brand A2", value: 150 },
          { name: "Brand B1", value: 200 },
          { name: "Brand B2", value: 100 },
          { name: "Brand C1", value: 90 },
          { name: "Brand C2", value: 110 },
          { name: "Brand C3", value: 100 },
          { name: "Brand D1", value: 100 },
          { name: "Brand D2", value: 100 },
          { name: "Brand E1", value: 178 },
          { name: "Brand E2", value: 100 },
          { name: "Brand F1", value: 146 },
          { name: "Brand F2", value: 100 },
          { name: "Brand F3", value: 100 },
        ],
        branchData: data.topRetailingBranch,
        brandformData: data.topRetailingBrand,
        retailMonthYearData: data.retailTrendByMonthAndYear,
        categoryStatsData: data.retailTopTen,
        trendRetailData: [
          { name: "2017-18", retail: 2400, amt: 2400 },
          { name: "2018-19", retail: 1398, amt: 2210 },
          { name: "2019-20", retail: 9800, amt: 2290 },
          { name: "2020-21", retail: 3908, amt: 2000 },
          { name: "2021-22", retail: 4800, amt: 2181 },
          { name: "2022-23", retail: 3800, amt: 2500 },
          { name: "2023-24", retail: 4300, amt: 2100 },
        ],
      };
      data = dataToSend;
    } else {
      data = { message: "Dashboard API is disabled in production" };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
