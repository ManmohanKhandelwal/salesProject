import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const conditions = await req.json();

    let data;
    // Check if any array in the object contains a value other than "all"
    const hasFilters = Object.values(conditions).some(
      (arr) => Array.isArray(arr) && arr.some((value) => value !== "all")
    );
    if (process.env.NODE_ENV === "development") {
      const url = hasFilters
        ? "http://localhost:5000/Dashboard/FilterredDashBoardData"
        : "http://localhost:5000/Dashboard";

      const res = await fetch(url, {
        method: hasFilters ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: hasFilters ? JSON.stringify(conditions) : null,
      });

      if (!res.ok)
        throw new Error(`Failed to fetch dashboard data from ${url}`);
      data = await res.json();

      const dataToSend = {
        totalRetailingValue: data.totalRetailingValue,
        latestMonthTotalRetailing: data.latestMonthTotalRetailing,
        percentageChangeinRetailing: data.percentageChangeinRetailing,
        topRetailingBrand: data.topRetailingBrand,
        topRetailingBranch: data.topRetailingBranch,
        retailChannelData: data.retailChannelData,
        retailCategoryChannelData: data.retailCategoryData,
        branchData: data.topRetailingBranch,
        brandformData: data.topRetailingBrand,
        retailMonthYearData: data.retailTrendByMonthAndYear,
        topTenBrandForm: data.topTenBrandForm,
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