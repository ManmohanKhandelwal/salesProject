"use client";
import CategoryStats from "@/components/CategoryStats";
import Header from "@/components/Header";
import RetailCategory from "@/components/RetailCategory";
import RetailChannel from "@/components/RetailChannel";
import RetailMonthYear from "@/components/RetailMonthYear";
import SalesCard from "@/components/SalesCard";
import SummaryCard from "@/components/SummaryCard";
import TrendCoverage from "@/components/TrendCoverage";
import TrendRetail from "@/components/TrendRetail";
import { DashboardInitialData } from "@/constants/dashBoardData";
import { useState } from "react";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(DashboardInitialData);
  return (
    <div className="pt-3 mx-5">
      <Header SetDashboarddata={setDashboardData} />

      {/* TOP SECTION */}
      <section className="pt-5 grid grid-cols-4 gap-4">
        {/* SALES CARD */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="">
            <SalesCard
              title="Total Retailing"
              data="₹10,000"
              trend="up"
              percentChange="+10%"
              className="bg-sale-card-gradient text-white"
              isShadow={false}
            />
          </div>
          <div className="">
            <SalesCard
              title="Total Sales"
              data="3,456"
              trend="down"
              percentChange="-7.5%"
            />
          </div>
        </div>

        {/* PIE CHARTS */}
        <div className="col-span-2 grid grid-cols-2 px-4 border border-gray-200 rounded-lg shadow-md">
          <div className="flex flex-col items-center col-span-1">
            <h1 className="text-xl font-semibold">Retailing by Channel</h1>
            <RetailChannel
              ChannelData={dashboardData?.retailChannelData}
              BrandData={dashboardData?.retailChannelBrandData}
            />
          </div>
          <div className="flex flex-col items-center col-span-1">
            <h1 className="text-xl font-semibold">Retailing by Category</h1>
            <RetailCategory
              ChannelData={dashboardData?.retailCategoryChannelData}
              BrandData={dashboardData?.retailCategoryBrandData}
            />
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <SummaryCard
              title="Highest Retailing Branch"
              data={dashboardData?.branchData}
            />
          </div>
          <div>
            <SummaryCard
              title="Highest Retailing Brand"
              data={dashboardData?.brandformData}
            />
          </div>
        </div>
      </section>

      {/* MIDDLE SECTION */}
      <section className="pt-5 grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col items-center px-2">
          <h1 className="text-xl font-semibold pb-2">
            Retailing by Month and Year
          </h1>
          <RetailMonthYear
            RetailMonthYearData={dashboardData?.retailMonthYearData}
          />
        </div>

        <div className="col-span-1 flex flex-col items-center">
          <h1 className="text-xl font-semibold">Category Statistics</h1>
          <p className=" text-gray-600 dark:text-gray-300 mb-1 pb-2">
            Track category-wise retailing
          </p>
          <CategoryStats CategoryStatsData={dashboardData?.categoryStatsData} />
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="pt-5 grid grid-cols-2 gap-4 border border-gray-200 rounded-lg px-3">
        <div className="col-span-1 flex flex-col items-center">
          <h1 className="text-xl font-semibold pb-2">Retail Trend</h1>
          <TrendRetail TrendRetailData={dashboardData?.trendRetailData} />
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h1 className="text-xl font-semibold pb-2">Coverage Trend</h1>
          <TrendCoverage TrendCoverageData={dashboardData?.trendCoverageData} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
