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
        ? "http://localhost:5000/dashboard/filterred-dashboarddata"
        : "http://localhost:5000/dashboard";

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
      let dataToSend;
      if( !hasFilters)
       dataToSend = {
        ...data,
        retailCategoryChannelData: data.retailCategoryData,
        retailMonthYearData: data.retailTrendByMonthAndYear,
      };
      else
       dataToSend = {
        ...data,
        totalRetailingValue:data.totalRetailingValue,
        retailCategoryChannelData: data.retailCategoryData,
        retailMonthYearData: data.retailTrendByMonthAndYear,
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
