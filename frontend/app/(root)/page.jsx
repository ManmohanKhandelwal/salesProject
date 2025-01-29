import Header from "@/components/Header";
import RetailCategory from "@/components/RetailCategory";
import RetailChannel from "@/components/RetailChannel";
import SalesCard from "@/components/SalesCard";
import SummaryCard from "@/components/SummaryCard";

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
        <div className="col-span-2 grid grid-cols-2">
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
      <section></section>
    </div>
  );
};

export default Dashboard;
