import {
  be,
  branches,
  brand,
  brandform,
  broadChannel,
  category,
  channel,
  months,
  shortChannel,
  sm,
  sub_brandform,
  years,
  zm,
} from "@/constants";
import FilterDropdown from "./FilterDropdown";
import DateRangeFilter from "./DateRangeFilter";

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
        <FilterDropdown filter={years} name="Year" />
        <FilterDropdown filter={months} name="Month" />
        <FilterDropdown filter={branches} name="Branch" />
        <FilterDropdown filter={zm} name="ZM" />
        <FilterDropdown filter={sm} name="SM" />
        <FilterDropdown filter={be} name="BE" />
        <FilterDropdown filter={channel} name="Channel" />
        <FilterDropdown filter={broadChannel} name="Broad Channel" />
        <FilterDropdown filter={shortChannel} name="Short Channel" />
        <FilterDropdown filter={category} name="Category" />
        <FilterDropdown filter={brand} name="Brand" />
        <FilterDropdown filter={brandform} name="Brandform" />
        <FilterDropdown filter={sub_brandform} name="Sub_Brandform" />
        {/* <DateRangeFilter name="Date Range" /> */}
      </div>
    </div>
  );
};

export default Header;
