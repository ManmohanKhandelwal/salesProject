import { branches, cities } from "@/constants";
import FilterDropdown from "./FilterDropdown";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      {/* HEADING */}
      <div className="">
        <h1 className="text-3xl font-bold">Sales Overview</h1>
        <p className="text-gray-500 font-semibold">
          Your current sales summary and activity
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2">
        <FilterDropdown filter={branches} name="Branch" />
        <FilterDropdown filter={cities} name="City" />
      </div>
    </div>
  );
};

export default Header;
