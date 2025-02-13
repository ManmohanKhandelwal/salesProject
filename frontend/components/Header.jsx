// "use client";
// import {
//   be,
//   branches,
//   brand,
//   brandform,
//   broadChannel,
//   category,
//   channel,
//   months,
//   shortChannel,
//   sm,
//   sub_brandform,
//   years,
//   zm,
// } from "@/constants";
// import FilterDropdown from "./FilterDropdown";
// import DateRangeFilter from "./DateRangeFilter";
// import { useState } from "react";

// //Array to run Loop to show all filters which are imported from constants
// const filtersToShow = [
//   { filterModule: years, filterLabel: "Year" },
//   { filterModule: months, filterLabel: "Month" },
//   { filterModule: branches, filterLabel: "Branch" },
//   { filterModule: zm, filterLabel: "ZM" },
//   { filterModule: sm, filterLabel: "SM" },
//   { filterModule: be, filterLabel: "BE" },
//   { filterModule: channel, filterLabel: "Channel" },
//   { filterModule: broadChannel, filterLabel: "Broad Channel" },
//   { filterModule: shortChannel, filterLabel: "Short Channel" },
//   { filterModule: category, filterLabel: "Category" },
//   { filterModule: brand, filterLabel: "Brand" },
//   { filterModule: brandform, filterLabel: "Brandform" },
//   { filterModule: sub_brandform, filterLabel: "Sub_Brandform" },
// ];

// const Header = () => {

//   //UseState to store the selected filters
//   const [SelectedFilters, SetSelectedFilters] = useState({
//     //Set the default values of filters
//   });
//   const submitForm = () => {
//     console.log(SelectedFilters);
//     //fetch api url with selected filters
//     //also pass the parent graphical states here as props to update the data and show it.
//   //Why the Filterdropdown is not having onchange attribute due to usage of external libs
//   // so make them such that on change it should save values in usestate->SelectedFilters
//   // onsubmit buttons it should use that
//   };
//   return (
//     <div className="flex items-center justify-between">
//       {/* HEADING */}
//       <div className="">
//         <h1 className="text-3xl font-bold">Sales Overview</h1>
//         <p className="text-gray-500 font-semibold">
//           Your current sales summary and activity
//         </p>
//       </div>

//       {/* FILTERS */}
//       <div className="flex items-center gap-1 flex-wrap">
//         {/* <FilterDropdown filter={years} name="Year" />
//         <FilterDropdown filter={months} name="Month" />
//         <FilterDropdown filter={branches} name="Branch" />
//         <FilterDropdown filter={zm} name="ZM" />
//         <FilterDropdown filter={sm} name="SM" />
//         <FilterDropdown filter={be} name="BE" />
//         <FilterDropdown filter={channel} name="Channel" />
//         <FilterDropdown filter={broadChannel} name="Broad Channel" />
//         <FilterDropdown filter={shortChannel} name="Short Channel" />
//         <FilterDropdown filter={category} name="Category" />
//         <FilterDropdown filter={brand} name="Brand" />
//         <FilterDropdown filter={brandform} name="Brandform" />
//         <FilterDropdown filter={sub_brandform} name="Sub_Brandform" /> */}
//         {filtersToShow.map((filter, index) => (
//           <FilterDropdown
//             key={index}
//             filter={filter.filterModule}
//             name={filter.filterLabel}
//             // onChanges={(selected) => {
//             //   SetSelectedFilters({ ...SelectedFilters, [filter.filterLabel]: selected });
//             // }}
//           />
//         ))}
//         {/* <DateRangeFilter name="Date Range" /> */}
//       </div>
//       {/* Submits the form */}
//       <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={submitForm}>
//         Submit
//       </button>
//     </div>
//   );
// };

// export default Header;

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
import { CircleCheck } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

// Define all filters dynamically
const filtersToShow = [
  { filterModule: years, filterLabel: "Year", filterKey: "years" },
  { filterModule: months, filterLabel: "Month", filterKey: "months" },
  { filterModule: branches, filterLabel: "Branch", filterKey: "branches" },
  { filterModule: zm, filterLabel: "ZM", filterKey: "zm" },
  { filterModule: sm, filterLabel: "SM", filterKey: "sm" },
  { filterModule: be, filterLabel: "BE", filterKey: "be" },
  { filterModule: channel, filterLabel: "Channel", filterKey: "channel" },
  {
    filterModule: broadChannel,
    filterLabel: "Broad Channel",
    filterKey: "broadChannel",
  },
  {
    filterModule: shortChannel,
    filterLabel: "Short Channel",
    filterKey: "shortChannel",
  },
  { filterModule: category, filterLabel: "Category", filterKey: "category" },
  { filterModule: brand, filterLabel: "Brand", filterKey: "brand" },
  { filterModule: brandform, filterLabel: "Brandform", filterKey: "brandform" },
  {
    filterModule: sub_brandform,
    filterLabel: "Sub Brandform",
    filterKey: "subBrandform",
  },
];

const Header = ({ SelectedFilters, SetSelectedFilters }) => {
  const submitForm = () => {
    // console.clear();
    console.log("Selected Filters:", SelectedFilters);
    // Use `SelectedFilters` to fetch API data and update UI
    // SetDashboarddata(fetchResponse);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* HEADING */}
      <div>
        <h1 className="text-3xl font-bold">Sales Overview</h1>
        <p className="text-gray-500 font-semibold">
          Your current sales summary and activity
        </p>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg w-full">
        {filtersToShow.map((filter) => (
          <FilterDropdown
            key={filter.filterKey}
            filter={filter.filterModule}
            name={filter.filterLabel}
            filterKey={filter.filterKey} // Unique key to store selection
            selectedFilters={SelectedFilters}
            setSelectedFilters={SetSelectedFilters}
          />
        ))}
        {/* SUBMIT BUTTON */}
        <button
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
          onClick={submitForm}
        >
          <CircleCheck />
        </button>
      </div>
    </div>
  );
};

export default Header;
