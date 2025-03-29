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
import fetchDashBoardData, { backEndURL } from "@/lib/utils";
import { CircleCheck, X } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

// Define all filters dynamically
const filtersToShow = [
  { filterModule: years, filterLabel: "Year", filterKey: "year" },
  { filterModule: months, filterLabel: "Month", filterKey: "month" },
  { filterModule: branches, filterLabel: "Branch", filterKey: "branch" },
  { filterModule: zm, filterLabel: "ZM", filterKey: "zoneManager" },
  { filterModule: sm, filterLabel: "SM", filterKey: "salesManager" },
  { filterModule: be, filterLabel: "BE", filterKey: "branchExecutive" },
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
  // {
  //   filterModule: sub_brandform,
  //   filterLabel: "Sub Brandform",
  //   filterKey: "subBrandform",
  // },
];

const Header = ({
  SelectedFilters,
  SetSelectedFilters,
  SetDashboarddata,
  SetLoading,
}) => {
  // Check if any filter is selected (excluding "all")
  const hasSelectedFilters = Object.values(SelectedFilters).some(
    (values) => values.length && !values.includes("all")
  );

  // Remove a single filter
  const removeFilter = (filterKey) => {
    const updatedFilters = { ...SelectedFilters };
    delete updatedFilters[filterKey]; // Remove filter from selected state
    SetSelectedFilters(updatedFilters);
  };

  // Reset all filters & refresh page
  const clearAllFilters = () => {
    SetSelectedFilters({});
    window.location.reload(); // Refresh the page to reflect changes immediately
  };

  // Submit selected filters
  const submitForm = () => {
    console.clear();
    console.log("Selected Filters:", SelectedFilters);
    SetLoading(true);
    fetch(backEndURL("/dashboard/filterred-dashboard-data"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SelectedFilters),
    }).then((res) => res.json()).then((data) => SetDashboarddata(data)).catch((error) =>
      console.error("Error fetching filtered dashboard data:", error))
      .finally(() => SetLoading(false)); // Ensure loading state is removed only after fetch is done
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

        {/* SHOW SUBMIT & CLEAR BUTTONS ONLY IF FILTERS ARE SELECTED */}
        {hasSelectedFilters && (
          <>
            {/* Submit Button */}
            <button
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
              onClick={submitForm}
            >
              <CircleCheck />
            </button>

            {/* Clear All Filters Button */}
            <button
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </>
        )}
      </div>

      {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
      {hasSelectedFilters && (
        <div className="w-full max-w-5xl px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2">
          {Object.entries(SelectedFilters)
            .filter(([, selectedValues]) => !selectedValues.includes("all"))
            .map(([filterKey, selectedValues]) => {
              const filter = filtersToShow.find(
                (f) => f.filterKey === filterKey
              );
              return (
                <div
                  key={filterKey}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-2"
                >
                  <span className="font-semibold">
                    {filter?.filterLabel || filterKey}
                  </span>
                  : {selectedValues.join(", ")}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFilter(filterKey)}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Header;
