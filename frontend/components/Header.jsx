"use client";
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
import { useState } from "react";

//Array to run Loop to show all filters which are imported from constants
const filtersToShow = [
  { filterModule: years, filterLabel: "Year" },
  { filterModule: months, filterLabel: "Month" },
  { filterModule: branches, filterLabel: "Branch" },
  { filterModule: zm, filterLabel: "ZM" },
  { filterModule: sm, filterLabel: "SM" },
  { filterModule: be, filterLabel: "BE" },
  { filterModule: channel, filterLabel: "Channel" },
  { filterModule: broadChannel, filterLabel: "Broad Channel" },
  { filterModule: shortChannel, filterLabel: "Short Channel" },
  { filterModule: category, filterLabel: "Category" },
  { filterModule: brand, filterLabel: "Brand" },
  { filterModule: brandform, filterLabel: "Brandform" },
  { filterModule: sub_brandform, filterLabel: "Sub_Brandform" },
];

const Header = () => {

  //UseState to store the selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    //Set the default values of filters
  });
  const submitForm = () => {
    console.log(selectedFilters);
    //fetch api url with selected filters
    //also pass the parent graphical states here as props to update the data and show it.
  //Why the Filterdropdown is not having onchange attribute due to usage of external libs
  // so make them such that on change it should save values in usestate->selectedFilters
  // onsubmit buttons it should use that
  };
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
      <div className="flex items-center gap-1 flex-wrap">
        {/* <FilterDropdown filter={years} name="Year" />
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
        <FilterDropdown filter={sub_brandform} name="Sub_Brandform" /> */}
        {filtersToShow.map((filter, index) => (
          <FilterDropdown
            key={index}
            filter={filter.filterModule}
            name={filter.filterLabel}
            // onChanges={(selected) => {
            //   setSelectedFilters({ ...selectedFilters, [filter.filterLabel]: selected });
            // }}
          />
        ))}
        {/* <DateRangeFilter name="Date Range" /> */}
      </div>
      {/* Submits the form */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={submitForm}>
        Submit
      </button>
    </div>
  );
};

export default Header;
