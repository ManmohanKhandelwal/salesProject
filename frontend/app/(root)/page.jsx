"use client";
import { useEffect, useState } from "react";

import CategoryStats from "@/components/CategoryStats";
import Header from "@/components/Header";
import RetailCategory from "@/components/RetailCategory";
import RetailChannel from "@/components/RetailChannel";
import RetailMonthYear from "@/components/RetailMonthYear";
import SalesCard from "@/components/SalesCard";
import SummaryCard from "@/components/SummaryCard";
import TrendCoverage from "@/components/TrendCoverage";
import TrendRetail from "@/components/TrendRetail";
import fetchDashBoardData from "@/lib/utils";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRetailingValue: 0,
    topRetailingBrand: {
      title: "",
      value: "",
    },
    topRetailingBranch: {
      title: "",
      value: "",
    },
    retailChannelData: [],
    retailCategoryChannelData: [],
    branchData: [],
    brandformData: [],
    retailMonthYearData: [],
    categoryStatsData: [],
    trendRetailData: [],
    trendCoverageData: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    years: "all",
    months: "all",
    branches: "all",
    zm: "all",
    sm: "all",
    be: "all",
    channel: "all",
    broadChannel: "all",
    shortChannel: "all",
    category: "all",
    brand: "all",
    brandform: "all",
    subBrandform: "all",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDashBoardData(selectedFilters).then(setDashboardData);
    setLoading(false);
  }, []);

  return (
    <div className="pt-3 mx-5">
      <Header
        SetDashboarddata={setDashboardData}
        SelectedFilters={selectedFilters}
        SetSelectedFilters={setSelectedFilters}
      />

      {/* ✅ Show Loading Indicator */}
      {loading ? (
        <div className="text-center text-lg font-semibold py-10">
          Loading Dashboard...
        </div>
      ) : (
        <>
          {/* TOP SECTION */}
          <section className="pt-5 grid grid-cols-4 gap-4">
            {/* SALES CARD */}
            <div className="col-span-1 flex flex-col gap-4">
              <SalesCard
                title="Total Retailing"
                data={dashboardData?.totalRetailingValue}
                trend="up"
                percentChange="+10%"
                className="bg-sale-card-gradient text-white"
                isShadow={false}
              />
              <SalesCard
                title="Total Sales"
                data="3456"
                trend="down"
                percentChange="-7.5%"
              />
            </div>

            {/* PIE CHARTS */}
            <div className="col-span-2 grid grid-cols-2 px-4 border border-gray-200 rounded-lg shadow-md">
              <div className="flex flex-col items-center col-span-1">
                <h1 className="text-xl font-semibold">Retailing by Channel</h1>
                <RetailChannel ChannelData={dashboardData?.retailChannelData} />
              </div>
              <div className="flex flex-col items-center col-span-1">
                <h1 className="text-xl font-semibold">Retailing by Category</h1>
                <RetailCategory
                  ChannelData={dashboardData?.retailCategoryChannelData}
                />
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="col-span-1 flex flex-col gap-4">
              <SummaryCard
                title="Highest Retailing Branch"
                data={dashboardData?.branchData}
              />
              <SummaryCard
                title="Highest Retailing Brand"
                data={dashboardData?.brandformData}
              />
            </div>
          </section>

          {/* BOTTOM SECTION */}
          <section className="pt-5 grid grid-cols-5 gap-4 pb-3">
            <div className="col-span-3 flex flex-col items-center px-2">
              <h1 className="text-xl font-bold pb-2">
                Retailing by Month and Year
              </h1>
              <RetailMonthYear
                RetailMonthYearData={dashboardData?.retailMonthYearData}
              />
            </div>

            <div className="col-span-2 flex flex-col items-center">
              <h1 className="text-2xl font-bold">Top Retailing Categories</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-1 pb-2">
                Track category-wise retailing
              </p>
              <CategoryStats
                CategoryStatsData={dashboardData?.categoryStatsData}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
