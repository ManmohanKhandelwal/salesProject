import Header from "@/components/Header";
import SalesCard from "@/components/SalesCard";

const Dashboard = () => {
  return (
    <div className="pt-3 mx-5">
      <Header />
      <section className="pt-5 grid grid-cols-3 gap-2">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="">
            <SalesCard
              title="Total Revenue"
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

        <div className="col-span-1"></div>

        <div className="col-span-1"></div>
      </section>
    </div>
  );
};

export default Dashboard;
