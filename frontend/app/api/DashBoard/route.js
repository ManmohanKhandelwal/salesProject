import { NextResponse } from "next/server";

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
        retailCategoryChannelData: data.retailCategoryData,
        branchData: data.topRetailingBranch,
        brandformData: data.topRetailingBrand,
        retailMonthYearData: data.retailTrendByMonthAndYear,
        categoryStatsData: data.retailTopTen,
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
