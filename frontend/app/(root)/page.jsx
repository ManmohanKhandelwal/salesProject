import Header from "@/components/Header";
import RetailCategory from "@/components/RetailCategory";
import RetailChannel from "@/components/RetailChannel";
import RetailMonthYear from "@/components/RetailMonthYear";
import SalesCard from "@/components/SalesCard";
import SummaryCard from "@/components/SummaryCard";
import TrendCoverageRetail from "@/components/TrendCoverageRetail";

const Dashboard = () => {
  const brandformData = {
    title: "Tide",
    value: "₹10,000",
  };
  const branchData = {
    title: "Pune",
    value: "₹10,000",
  };

  return (
    <div className="pt-3 mx-5">
      <Header />

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
            <RetailChannel />
          </div>
          <div className="flex flex-col items-center col-span-1">
            <h1 className="text-xl font-semibold">Retailing by Category</h1>
            <RetailCategory />
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="col-span-1 flex flex-col gap-4">
          <div>
            <SummaryCard title="Highest Retailing Branch" data={branchData} />
          </div>
          <div>
            <SummaryCard
              title="Highest Retailing Brandform"
              data={brandformData}
            />
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="pt-5 grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col items-center px-2">
          <h1 className="text-xl font-semibold pb-2">
            Retailing by Month and Year
          </h1>
          <RetailMonthYear />
        </div>

        <div className="col-span-1 flex flex-col items-center">
          <h1 className="text-xl font-semibold pb-2">
            Coverage & Retail Trend
          </h1>
          <TrendCoverageRetail />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
