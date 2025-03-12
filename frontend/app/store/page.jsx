"use client";
import debounce from "lodash.debounce";
import axios from "axios";
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import CustomLoader from "@/components/ui/loader";
import StoreCard from "@/components/ui/StoreCard";
import SummaryCard from "@/components/SummaryCard";
import { CircleCheck, X } from "lucide-react";
import { months, years } from "@/constants";
import StoreRetailMonthYear from "@/components/ui/storeRetailMonthYear";
import StoreAdditionalDetails from "@/components/ui/storeAdditionalDetails";
import StorePagePieChart from "@/components/ui/StorePagePieChart";
import BranchWiseStores from "@/components/ui/BranchWiseStores";
import { backEndURL } from "@/lib/utils";

const filtersToShow = [
  { filterModule: years, filterLabel: "Year", filterKey: "years" },
  { filterModule: months, filterLabel: "Month", filterKey: "months" },
];

const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStores, setSearchedStores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([
    "Sonarpur",
    "Sonadanga",
    "Pyradanga",
    "Gobardanga",
    "Akui",
    "Kandi",
    "Jemo",
  ]);
  //DashBoard Data
  const [dashBoardData, setDashBoardData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    years: ["all"],
    months: ["all"],
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      years: ["all"],
      months: ["all"],
    });
    window.location.reload(); // Refresh the page to reflect changes immediately
  };

  // Remove a single filter
  const removeFilter = (filterKey) => {
    const updatedFilters = { ...selectedFilters };
    delete updatedFilters[filterKey]; // Remove filter from selected state
    setSelectedFilters(updatedFilters);
  };

  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (!q) return;
      console.log("Searching for:", q);
      try {
        const response = await axios.get(
          backEndURL(`/store/meta-data?oldStoreCode=${q}`)
        );
        /*if(!response.ok) throw new Error("Couldn't find searched store")*/
        console.log(response.data);
        setSearchedStores(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchInputChange = (e) => {
    setHideSearch(false);
    const value = e.target.value;
    setSearchQuery(value);
    console.log(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem) return;
    const fetchStoreData = async () => {
      try {
        console.log(selectedItem);
        const response = await axios.get(
          backEndURL(`/store/output?oldStoreCode=${selectedItem}`)
        );
        console.log(response);
        setStoreDetails(response.data);
      } catch (error) {
        console.error(error?.message);
      }
    };
    fetchStoreData();
  }, [selectedItem]);

  //Fetch Dashboard Data
  useEffect(() => {
    const fetchStoreDashBoardData = async () => {
      try {
        const response = await axios.get(backEndURL("/store/dashboard"));
        console.log(response.data);
        setDashBoardData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchStoreDashBoardData();
  }, []);

  const [hideSearch, setHideSearch] = useState(false);

  const showStoreDetails = (id) => {
    setHideSearch(true);
    setSelectedItem(id);
    setSearchQuery(id);
  };

  return (
    <div className={`pt-3 mx-5`}>
      {/* HEADING */}
      <div className={``}>
        <div className="flex-col col-span-1 text-center">
          <div className="text-3xl font-bold">Store Overview</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">
            Your current stores summary & activity
          </div>
        </div>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-2 gap-6 mt-3">
        <div className="grid grid-cols-2 items-center">
          <div className="col-start-2">
            <StoreCard
              title={"Total Stores"}
              data={dashBoardData?.storeCount}
              className={"bg-sale-card-gradient text-white"}
              isShadow={false}
              trend={null}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          {dashBoardData && dashBoardData?.storeCountByBranch?.length > 0 && (
            <BranchWiseStores branchList={dashBoardData?.storeCountByBranch} />
          )}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-3 mt-6">
        <p className="text-center text-xl font-semibold pb-1">
          Retailing of Store by Month and Year
        </p>

        <div className="flex justify-center items-center relative gap-3 mb-3">
          <div className="w-2/6 mt-3 mb-2">
            <input
              className="px-2 py-1.5 border-green-400 dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black"
              placeholder="Search store here"
              value={searchQuery}
              onChange={handleSearchInputChange}
            ></input>
            <ul
              className={`${
                hideSearch ? "hidden" : ""
              } z-30 absolute top-24 max-h-48 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-b-lg bg-slate-100 shadow-md shadow-gray-700 w-2/6 rounded-t-sm dark:text-black`}
            >
              {searchQuery &&
                searchedStores &&
                searchedStores?.length > 0 &&
                searchedStores.map((result, index) => (
                  <li
                    key={result["Id"]}
                    className={`${
                      index !== searchedStores.length - 1
                        ? "border-b-slate-300 border-b"
                        : ""
                    } py-2 px-4 whitespace-pre cursor-pointer truncate text-sm`}
                    onClick={() => showStoreDetails(result["Old_Store_Code"])}
                  >
                    <strong>↖ {result["Old_Store_Code"]}</strong>
                  </li>
                ))}
            </ul>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center justify-center gap-3 py-1 px-3 ">
            {filtersToShow.map((filter) => (
              <FilterDropdown
                key={filter.filterKey}
                filter={filter.filterModule}
                name={filter.filterLabel}
                filterKey={filter.filterKey} // Unique key to store selection
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            ))}

            {/* SUBMIT BUTTON */}
            {Object.values(selectedFilters).some(
              (filter) => filter.length > 0 && !filter.includes("all")
            ) && (
              <>
                <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
                  <CircleCheck />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
        {Object.values(selectedFilters).some(
          (filter) => filter.length > 0 && !filter.includes("all")
        ) && (
          <div className="w-full max-w-5xl px-3 py-2 mb-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
            {Object.entries(selectedFilters)
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

        <div className="grid grid-cols-3">
          <div className="col-span-2">
            {storeDetails ? (
              // Render the actual LineChart when storeDetails is available
              <StoreRetailMonthYear
                storeRetailMonthYear={storeDetails.monthly_sales}
              />
            ) : (
              // Skeleton Loader for Line Chart
              <div className="h-[400px] bg-gradient-to-br rounded-lg from-slate-200 to-slate-600 relative overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>

                {/* Placeholder Axes and Gridlines */}
                <div className="flex flex-col justify-between h-full p-4">
                  {/* Y-Axis Labels */}
                  <div className="flex justify-between">
                    <div className="w-8 h-4 bg-white/30 rounded"></div>
                    <div className="w-8 h-4 bg-white/30 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-4 bg-white/30 rounded"></div>
                    <div className="w-8 h-4 bg-white/30 rounded"></div>
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-between mt-4">
                    <div className="w-12 h-4 bg-white/30 rounded"></div>
                    <div className="w-12 h-4 bg-white/30 rounded"></div>
                    <div className="w-12 h-4 bg-white/30 rounded"></div>
                    <div className="w-12 h-4 bg-white/30 rounded"></div>
                  </div>
                </div>

                {/* Placeholder Line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M20,300 C50,200 150,350 250,250 C350,150 450,300 550,200"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex justify-center items-center text-white tracking-wider text-lg">
                  Enter store code to see data
                </div>
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="text-center text-xl font-semibold">
              Additional Details
            </p>
            {storeDetails ? (
              <div className="my-5 ">
                <StoreAdditionalDetails data={storeDetails?.metadata} />
              </div>
            ) : (
              <div className="mt-4 text-white/80 text-center p-3 rounded-md bg-gradient-to-t from-gray-700 to-gray-600  ">
                No data available !
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 mt-6 relative">
        <p className="text-center font-semibold text-xl">
          Store Information by Branch
        </p>
        <div className="flex flex-col items-center justify-center mt-3 relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-black w-1/3 p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {results.length > 0 && (
            <div className="absolute top-12 w-1/3 bg-white text-black shadow-md rounded-lg max-h-40 overflow-auto scrollbar-hide border border-gray-300">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-200"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 mt-3 grid grid-cols-4">
          <div className="col-start-2 col-end-4 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 1
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 2
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 3
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 4
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 5
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              Store Details 6
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
