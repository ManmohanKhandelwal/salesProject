"use client";
import { useEffect, useState } from "react";

import BrandFormStats from "@/components/BrandFormStats";
import Header from "@/components/Header";
import RetailCategoryPieChart from "@/components/RetailCategoryPieChart";
import RetailChannelPieChart from "@/components/RetailChannelPieChart";
import RetailMonthYear from "@/components/RetailMonthYear";
import SalesCard from "@/components/SalesCard";
import SummaryCard from "@/components/SummaryCard";
import CustomLoader from "@/components/ui/loader";
import fetchDashBoardData from "@/lib/utils";
import { months } from "@/constants";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRetailingValue: 0,
    latestMonthTotalRetailing: { year: "", month: "", total_retailing: "" },
    percentageChangeinRetailing: "",
    topRetailingBrand: { title: "", value: "" },
    topRetailingBranch: { title: "", value: "" },
    retailChannelData: [],
    retailCategoryChannelData: [],
    topRetailingBranch: [],
    topRetailingBrand: [],
    retailMonthYearData: [],
    topTenBrandForm: [],
    trendRetailData: [],
    trendCoverageData: [],
  });

  const [selectedFilters, setSelectedFilters] = useState({
    years: ["all"],
    months: ["all"],
    branches: ["all"],
    zm: ["all"],
    sm: ["all"],
    be: ["all"],
    channel: ["all"],
    broadChannel: ["all"],
    shortChannel: ["all"],
    category: ["all"],
    brand: ["all"],
    brandform: ["all"],
    subBrandform: ["all"],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDashBoardData(selectedFilters)
      .then((data) => setDashboardData(data))
      .finally(() => setLoading(false)); // Ensure loading state is removed only after fetch is done
  }, []);

  return (
    <div className="pt-3 mx-5">
      <Header
        SetDashboarddata={setDashboardData}
        SelectedFilters={selectedFilters}
        SetSelectedFilters={setSelectedFilters}
        SetLoading={setLoading}
      />

      {/* ✅ Show Full-Page Loader While Loading */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
          <CustomLoader />
        </div>
      )}

      {/* ✅ Render Content After Loading */}
      {!loading && (
        <>
          {/* TOP SECTION */}
          <section className="pt-5 grid grid-cols-4 gap-4">
            {/* SALES CARD */}
            <div className="col-span-1 flex flex-col gap-4">
              <SalesCard
                title="Total Retailing"
                data={dashboardData?.totalRetailingValue}
                className="bg-sale-card-gradient text-white"
                isShadow={false}
              />
              <SalesCard
                title={`Retailing in ${
                  months[dashboardData?.latestMonthTotalRetailing.month].title
                } ${dashboardData?.latestMonthTotalRetailing.year}`}
                data={dashboardData?.latestMonthTotalRetailing.total_retailing}
                trend={
                  dashboardData?.percentageChangeinRetailing > 0 ? "up" : "down"
                }
                percentChange={
                  Number(dashboardData?.percentageChangeinRetailing).toFixed(
                    2
                  ) + "%"
                }
                className="bg-month-sale-card-gradient dark:text-gray-100"
                isShadow={false}
              />
            </div>

            {/* PIE CHARTS */}
            <div className="col-span-2 grid grid-cols-2 px-4 border border-gray-200 rounded-lg shadow-md">
              <div className="flex flex-col items-center col-span-1">
                <h1 className="text-xl font-semibold">Retailing by Channel</h1>
                <RetailChannelPieChart
                  ChannelData={dashboardData?.retailChannelData}
                />
              </div>
              <div className="flex flex-col items-center col-span-1">
                <h1 className="text-xl font-semibold">Retailing by Category</h1>
                <RetailCategoryPieChart
                  ChannelData={dashboardData?.retailCategoryChannelData}
                />
              </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="col-span-1 flex flex-col gap-4">
              <SummaryCard
                title="Highest Retailing Branch"
                data={dashboardData?.topRetailingBranch}
              />
              <SummaryCard
                title="Highest Retailing Brand"
                data={dashboardData?.topRetailingBrand}
              />
            </div>
          </section>

          {/* BOTTOM SECTION */}
          <section className="pt-5 grid grid-cols-5 gap-4 pb-3">
            <div className="col-span-3 flex flex-col items-center px-2">
              <h1 className="text-2xl font-bold pb-2">
                Retail Performance Over the Years
              </h1>
              <RetailMonthYear
                RetailMonthYearData={dashboardData?.retailMonthYearData}
              />
            </div>

            <div className="col-span-2 flex flex-col items-center">
              <h1 className="text-2xl font-bold">Top Retailing BrandForm</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-1 pb-2">
                Track BrandForm-wise retailing
              </p>
              <BrandFormStats
                TopTenBrandForm={dashboardData?.topTenBrandForm}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
