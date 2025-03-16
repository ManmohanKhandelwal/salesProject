"use client";

import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import axios from "axios";
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomLoader from "@/components/ui/loader";
import StoreCard from "@/components/ui/StoreCard";
import { CircleCheck, X } from "lucide-react";
import { months, years } from "@/constants";
import StoreRetailMonthYear from "@/components/ui/storeRetailMonthYear";
import StoreAdditionalDetails from "@/components/ui/storeAdditionalDetails";
import StorePagePieChart from "@/components/ui/StorePagePieChart";
import BranchWiseStores from "@/components/ui/BranchWiseStores";
import { backEndURL } from "@/lib/utils";

const HashLoader = dynamic(() => import("react-spinners/HashLoader"), {
  ssr: false,
});

const filtersToShow = [
  { filterModule: years, filterLabel: "Year", filterKey: "years" },
  { filterModule: months, filterLabel: "Month", filterKey: "months" },
];

const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStores, setSearchedStores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [branch, setBranch] = useState("");
  const [hideBranchSearch, setHideBranchSearch] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchResult, setBranchResult] = useState([
    "Uluberia",
    "Akui",
    "Sonadanga",
    "North",
  ]);

  const middleSectionRef = useRef(null);

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
          backEndURL(`/store/suggestions?oldStoreCode=${q}`)
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
          backEndURL(`/store/meta-data?oldStoreCode=${selectedItem}`)
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
    setDashboardLoading(true);
    const fetchStoreDashBoardData = async () => {
      try {
        const response = await axios.get(backEndURL("/store/dashboard"));
        console.log(response.data);
        setDashBoardData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setDashboardLoading(false);
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

  const getTopStores = async (e) => {
    if (e) e.preventDefault();

    if (query.trim() === "") return;
    setLoading(true);

    try {
      const response = await axios.get(
        backEndURL(`/store/get-top-stores?branchName=${query}`)
      );
      console.log(response?.data);
      setResults(response.data?.topStoresDetails);
    } catch (error) {
      console.error("Couldn't fetch top stores, Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed");
      getTopStores();
    }
  };

  const addBranch = (branch) => {
    setSelectedBranch(branch);
    setHideBranchSearch(true);
    setBranch(branch);
  };

  const removeBranch = () => {
    setSelectedBranch(null);
    setHideBranchSearch(false);
    setBranch("");
  };

  return (
    <div className={`pt-3 mx-5`}>
      {/* HEADING */}
      <div className={``}>
        <div className="flex-col col-span-1 text-center">
          <div className="text-3xl font-bold">Store Overview</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">
            Your current stores' summary & activity
          </div>
        </div>
      </div>

      {!dashboardLoading ? (
        <div>
          {/* TOP SECTION */}
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="w-[400px] h-[125px]">
              <StoreCard
                title={"Total Stores"}
                data={dashBoardData?.storeCount}
                className={"bg-sale-card-gradient text-white"}
                isShadow={false}
                trend={null}
              />
            </div>
            <div className="w-[400px] h-[125px]">
              {dashBoardData &&
                dashBoardData?.storeCountByBranch?.length > 0 && (
                  <BranchWiseStores
                    branchList={dashBoardData?.storeCountByBranch}
                  />
                )}
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div className="p-3 mt-6" ref={middleSectionRef}>
            <p className="text-center text-xl font-semibold pb-1">
              Retailing of Store by Month and Year
            </p>

            <div className="flex items-center justify-center w-full gap-6">
              {/* STORE SEARCH */}
              <div className="relative w-2/5">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-orange-500 text-black"
                  placeholder="Search store here"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {/* SEARCH SUGGESTIONS */}
                <ul
                  className={`absolute left-0 top-[110%] w-full bg-slate-100 shadow-md shadow-gray-700 rounded-b-lg z-30 max-h-48 overflow-y-auto scrollbar-hide dark:text-black ${
                    hideSearch ? "hidden" : ""
                  }`}
                >
                  {searchQuery &&
                    searchedStores?.length > 0 &&
                    searchedStores.map((result, index) => (
                      <li
                        key={result["Id"]}
                        className={`py-2 px-4 cursor-pointer truncate text-sm ${
                          index !== searchedStores.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                        onClick={() =>
                          showStoreDetails(result["Old_Store_Code"])
                        }
                      >
                        <strong>↖ {result["Old_Store_Code"]}</strong>
                      </li>
                    ))}
                </ul>
              </div>

              {/* BRANCH SEARCH */}
              <div
                className={`relative w-1/5 ${hideBranchSearch ? "hidden" : ""}`}
              >
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-orange-500 text-black"
                  placeholder="Search Branch..."
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
                {/* SEARCH SUGGESTIONS (IF APPLICABLE) */}
                <ul
                  className={`absolute left-0 top-[110%] w-full bg-slate-100 shadow-md shadow-gray-700 rounded-b-lg z-30 max-h-48 overflow-y-auto scrollbar-hide dark:text-black
              `}
                >
                  {branch &&
                    branchResult?.length > 0 &&
                    branchResult.map((branch, index) => (
                      <li
                        key={index}
                        className={`py-2 px-4 cursor-pointer truncate text-sm ${
                          index !== branchResult.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                        onClick={() => addBranch(branch)}
                      >
                        <strong>🏢 {branch}</strong>
                      </li>
                    ))}
                </ul>
              </div>
              {selectedBranch && hideBranchSearch && (
                <div className="grid grid-cols-3 gap-2 bg-amber-50 border-2 border-amber-400 py-2 px-3 text-gray-600 rounded-full items-center">
                  <span
                    title={selectedBranch}
                    className="col-span-2 max-w-24 truncate text-sm font-medium"
                  >
                    {selectedBranch}
                  </span>
                  <X
                    className="cursor-pointer"
                    size={20}
                    onClick={removeBranch}
                  />
                </div>
              )}

              {/* FILTERS */}
              <div className="flex flex-wrap items-center gap-3">
                {filtersToShow.map((filter) => (
                  <FilterDropdown
                    key={filter.filterKey}
                    filter={filter.filterModule}
                    name={filter.filterLabel}
                    filterKey={filter.filterKey}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                  />
                ))}
              </div>

              {/* SUBMIT & CLEAR BUTTONS */}
              {Object.values(selectedFilters).some(
                (filter) => filter.length > 0 && !filter.includes("all")
              ) && (
                <div className="flex items-center gap-3">
                  <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
                    <CircleCheck />
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
            {Object.values(selectedFilters).some(
              (filter) => filter.length > 0 && !filter.includes("all")
            ) && (
              <div className="w-full max-w-5xl px-3 py-2 mb-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
                {Object.entries(selectedFilters)
                  .filter(
                    ([, selectedValues]) => !selectedValues.includes("all")
                  )
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

            <div className="grid grid-cols-3 mt-6">
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
              <div className="px-3">
                <p className="text-center -mt-4 text-xl font-semibold">
                  Additional Details
                </p>
                {storeDetails ? (
                  <div className="mt-3">
                    <StoreAdditionalDetails data={storeDetails?.metadata} />
                  </div>
                ) : (
                  <div className="mt-4 text-white/80 text-center p-3 rounded-md bg-gradient-to-t from-gray-700 to-gray-600  ">
                    No data available !
                  </div>
                )}
              </div>
            </div>

            {storeDetails && storeDetails?.category_retailing && (
              <div className="flex flex-col items-center mt-3">
                <div className="text-center text-2xl font-bold text-gray-700 dark:text-white">
                  Categorywise Retailing
                </div>
                <div className="">
                  <StorePagePieChart
                    data={storeDetails?.category_retailing}
                    nameKey="category"
                  />
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM SECTION */}
          <div className="p-3 mt-6">
            <p className="text-center font-semibold text-xl">
              Store Information by Branch
            </p>

            {/* Search Input */}
            <div className="flex gap-6 items-center justify-center mt-3">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-black w-1/3 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 dark:focus:ring-orange-500 focus:ring-green-500"
              />
              <button
                onClick={(e) => getTopStores(e)}
                className="py-2 px-4 shadow-md text-white rounded-lg bg-gradient-to-br from-green-500 to-green-400 dark:from-orange-500 dark:to-orange-400 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Results Table */}
            {results && results.length > 0 && !loading ? (
              <div className="overflow-x-auto mt-6">
                <table className="w-full max-w-4xl mx-auto border-collapse border border-gray-300 dark:border-gray-700 shadow-md">
                  {/* Table Header */}
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr className="text-left">
                      <th className="p-3 text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                        Rank
                      </th>
                      <th className="p-3 text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                        Store Code
                      </th>
                      <th className="p-3 text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                        Avg Retailing (₹)
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {results.map((storeDetails, index) => (
                      <tr
                        key={index}
                        className={`border border-gray-300 dark:border-gray-700 ${
                          index % 2 === 0
                            ? "bg-gray-50 dark:bg-gray-900"
                            : "bg-white dark:bg-gray-800"
                        } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
                      >
                        <td className="p-3 text-center text-gray-800 dark:text-gray-300">
                          {index + 1}
                        </td>
                        <td
                          className="p-3 text-center font-semibold text-gray-900 dark:text-gray-200 cursor-pointer"
                          onClick={() => {
                            setSearchQuery(storeDetails["store_code"]); // Autofill the search input
                            showStoreDetails(storeDetails["store_code"]); // Fetch store details
                            middleSectionRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                        >
                          {storeDetails["store_code"]}
                        </td>
                        <td className="p-3 text-center text-lg font-medium text-green-600 dark:text-orange-400">
                          ₹ {Number(storeDetails["avg_retailing"]).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center mt-3">
                {loading ? "Searching for stores..." : "No data available!"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-inherit">
          <HashLoader
            color="rgb(249, 115, 22)"
            size={120}
            loading={dashboardLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Store;
