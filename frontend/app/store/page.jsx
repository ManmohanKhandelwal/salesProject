"use client";

import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import axios from "axios";
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomLoader from "@/components/ui/loader";
import { CircleCheck, MapPin, X } from "lucide-react";
import { months, years, zm, sm, be } from "@/constants";
import StoreRetailMonthYear from "@/components/ui/storeRetailMonthYear";
import StoreAdditionalDetails from "@/components/ui/storeAdditionalDetails";
import StorePagePieChart from "@/components/ui/StorePagePieChart";
import BranchWiseStores from "@/components/ui/BranchWiseStores";
import { backEndURL } from "@/lib/utils";

const HashLoader = dynamic(() => import("react-spinners/HashLoader"), {
  ssr: false,
});

const filtersToShowTop = [
  { filterModule: years, filterLabel: "Year", filterKey: "years" },
  { filterModule: months, filterLabel: "Month", filterKey: "months" },
];

const filtersToShowBottom = [
  { filterModule: zm, filterLabel: "ZM", filterKey: "zm" },
  { filterModule: sm, filterLabel: "SM", filterKey: "sm" },
  { filterModule: be, filterLabel: "BE", filterKey: "be" },
]
const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedStores, setSearchedStores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [branch, setBranch] = useState("");
  const [hideBranchSearchMiddle, setHideBranchSearchMiddle] = useState(false);
  const [hideBranchSearchLower, setHideBranchSearchLower] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchResultMiddle, setBranchResultMiddle] = useState(null);
  const [branchResultLower, setBranchResultLower] = useState(null);
  const [top100StoresLoading, setTop100StoresLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedResults, setPaginatedResults] = useState([]);
  const [totalPages, setTotalPages] = useState(5);
  const itemsPerPage = 20;

  const middleSectionRef = useRef(null);

  //DashBoard Data
  const [dashBoardData, setDashBoardData] = useState({});
  const [selectedFiltersTop, setSelectedFiltersTop] = useState({
    years: ["all"],
    months: ["all"],
  });
  const [selectedFiltersBottom, setSelectedFiltersBottom] = useState({
    zm: ["all"],
    sm: ["all"],
    be:["all"]
  })
  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFiltersTop({
      years: ["all"],
      months: ["all"],
    });
    setSelectedFiltersBottom({
      zm: ["all"],
      sm: ["all"],
      be:["all"]
    })
    window.location.reload(); // Refresh the page to reflect changes immediately
  };

  // Remove a single filter
  const removeFilter = (filterKey,section) => {
    let updatedFilters;
    section==="top"? updatedFilters = { ...selectedFiltersTop }: updatedFilters = { ...selectedFiltersBottom };
    console.log("updatedFilters: ",updatedFilters);
    delete updatedFilters[filterKey]; // Remove filter from selected state
    section==="top"?setSelectedFiltersTop(updatedFilters):setSelectedFiltersBottom(updatedFilters);
  };

  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (!q) return;
      console.log("Searching for:", q);
      console.log("Selected branch:", selectedBranch);
      try {
        const response = await axios.get(
          backEndURL(
            `/store/store-suggestions?oldStoreCode=${q}&branchName=${selectedBranch}`
          )
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
    [selectedBranch]
  );

  const handleSearchInputChange = (e) => {
    setHideSearch(false);
    const value = e.target.value;
    setSearchQuery(value);
    console.log(value);
    debouncedSearch(value);
  };

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem) return;
    const fetchStoreData = async () => {
      try {
        console.log("SelectedItem: ",selectedItem);
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
    setTop100StoresLoading(true);
    setDashboardLoading(true);
    const fetchTop100Stores = async () => {
      try {
        const response = await axios.get(backEndURL(`/store/top-stores`));
        console.log(response);
        setPaginatedResults(response.data?.cachedData || response.data?.topStoresDetails);
        if(response.data?.cachedData?.length>0) setTotalPages(Math.ceil(response.data?.cachedData?.length/20));
      } catch (error) {
        console.error("Error fetching top 100 stores, Error: ",error);
      } finally {
        setTop100StoresLoading(false);
        setDashboardLoading(false);
      }
    }
    fetchTop100Stores();
  }, []);

  const getTopStores = async (query) => {
    if (query.trim() === "") return;
    setLoading(true);
    try {
      const response = await axios.get(
        backEndURL(`/store/top-stores?branchName=${query}&topStoresCount=20`)
      );
      console.log(response?.data);
      setPaginatedResults(response.data?.cachedData);
      if(response.data?.cachedData?.length>0) setTotalPages(Math.ceil(response.data?.cachedData?.length/20));
    } catch (error) {
      console.error("Couldn't fetch top stores, Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const displayedStores = paginatedResults?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [hideSearch, setHideSearch] = useState(false);

  const showStoreDetails = (id) => {
    console.log("Store ID:", id);
    setHideSearch(true);
    setSelectedItem(id);
    setSearchQuery(id);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed");
      getTopStores();
    }
  };

  const addBranch = (branch) => {
    setSearchedStores([]);
    setSelectedBranch(branch);
    setHideBranchSearchMiddle(true);
    setBranch(branch);
    setSearchQuery("");
  };

  const removeBranch = () => {
    setSearchedStores([]);
    setSelectedBranch("");
    setHideBranchSearchMiddle(false);
    setBranch("");
    setSearchQuery("");
  };

  const branchInputChange = (e, section) => {
    const value = e.target.value;
    section === "middle" ? setBranch(value) : setQuery(value);
    section === "lower" ? setHideBranchSearchLower(false) : "";
    searchBranch(value, section);
  };
  const searchBranch = useCallback(
    debounce(async (q, section) => {
      if (!q) return;
      const lookupForFilter = {
        zm: "zoneManager",
        sm: "salesManager",
        be:"businessExecutive"
      };
      const queryParams = Object.entries(selectedFiltersBottom)
        .filter(([key, values]) => values.length > 0 && !values.includes("all")) // Remove empty and "all"
        .map(
          ([key, values]) =>
            `${lookupForFilter[key]}=${encodeURIComponent(values[0])}`
        ) // Send only the first valid value
        .join("&");
      console.log(queryParams);
      const url = `/store/branch-suggestions?${queryParams}&branchName=${q}`;
      try {
        const response = await axios.get(backEndURL(url));
        console.log(response.data);
        section === "middle"
          ? setBranchResultMiddle(response.data)
          : setBranchResultLower(response.data);
      } catch (error) {
        console.error("Error while loading branches, Error: ", error);
      }
    }, 500),
    [selectedFiltersBottom]
  );

  /*const submitFilters = async () => {
    console.log("query:", branch);
    if (!query) return;
    const lookupForFilter = {
      zm: "zoneManager",
      sm: "salesManager",
    };
    const queryParams = Object.entries(selectedFilters)
      .filter(([key, values]) => values.length > 0 && !values.includes("all")) // Remove empty and "all"
      .map(
        ([key, values]) =>
          `${lookupForFilter[key]}=${encodeURIComponent(values[0])}`
      ) // Send only the first valid value
      .join("&");
    console.log(queryParams);
    const url = backEndURL(
      `/store/store-suggestions?${queryParams}&branchName=${query}`
    );
    try {
      const response = await axios.get(url);
      console.log("Filtered Data:", response.data);
      setBranchResultMiddle(response.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };*/

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      searchBranch.cancel();
    };
  }, [debouncedSearch, searchBranch]);

  return (
    <div className={`pt-3 mx-5`}>
      {/* HEADING */}
      <div className={``}>
        <div className="flex-col col-span-1 text-center">
          <div className="text-3xl font-bold">Store at Fingertips</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">
            Your current stores' summary & activity
          </div>
        </div>
      </div>

      {!dashboardLoading ? (
        <div>
          {/* TOP SECTION */}
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
                className={`relative w-1/5 ${
                  hideBranchSearchMiddle ? "hidden" : ""
                }`}
              >
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-orange-500 text-black"
                  placeholder="Search Branch..."
                  value={branch}
                  onChange={(e) => branchInputChange(e, "middle")}
                />
                {/* SEARCH SUGGESTIONS (IF APPLICABLE) */}
                <ul
                  className={`absolute left-0 top-[110%] w-full bg-slate-100 shadow-md shadow-gray-700 rounded-b-lg z-30 max-h-48 overflow-y-auto scrollbar-hide dark:text-black
              `}
                >
                  {branch &&
                    branchResultMiddle?.length > 0 &&
                    branchResultMiddle.map((branch, index) => (
                      <li
                        key={index}
                        className={`py-2 px-4 cursor-pointer truncate text-sm ${
                          index !== branchResultMiddle.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                        onClick={() => addBranch(branch)}
                      >
                        <span className="inline-flex gap-3 items-center">
                          <MapPin width={16} height={16} strokeWidth={2.5} />
                          <strong> {branch}</strong>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              {selectedBranch && hideBranchSearchMiddle && (
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
              <div className="flex items-center gap-3">
                {filtersToShowTop.map((filter) => (
                  <FilterDropdown
                    key={filter.filterKey}
                    filter={filter.filterModule}
                    name={filter.filterLabel}
                    filterKey={filter.filterKey}
                    selectedFilters={selectedFiltersTop}
                    setSelectedFilters={setSelectedFiltersTop}
                  />
                ))}
              </div>
              {/* SUBMIT & CLEAR BUTTONS */}
              {Object.values(selectedFiltersTop).some(
                (filter) => filter.length > 0 && !filter.includes("all")
              ) && (
                <div className="flex items-center gap-3">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
            {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
            {/* Filters Display */}
            {Object.values(selectedFiltersTop).some(
              (filter) => filter.length > 0 && !filter.includes("all")
            ) && (
              <div className="w-full max-w-5xl px-3 py-2 mt-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
                {Object.entries(selectedFiltersTop)
                  .filter(([, selectedValues]) => !selectedValues.includes("all"))
                  .map(([filterKey, selectedValues]) => {
                    const filter = filtersToShowTop.find((f) => f.filterKey === filterKey);
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
                          onClick={() => removeFilter(filterKey,"top")}
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
                    storeRetailMonthYear={Object.entries(storeDetails.monthly_metadata)}
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
                    <StoreAdditionalDetails data={storeDetails?.metadata}/>
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
                    categoryData={storeDetails?.category_retailing}
                    nameKey="category"
                    yearFilter={String(selectedFiltersTop?.years || "all")}
                    monthFilter={String(selectedFiltersTop?.months || "all")}
                  />
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM SECTION */}
          <div className="p-3 mt-6">
            <p className="text-center font-semibold text-xl">
              Top Stores' Information
            </p>

            {/* Search Input */}
            <div className="flex gap-6 items-center justify-center mt-3">
              <div className="relative w-2/5">
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => branchInputChange(e, "lower")}
                  onKeyDown={handleKeyPress}
                  className="text-black w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 dark:focus:ring-orange-500 focus:ring-green-500"
                />
                <ul
                  className={`${
                    hideBranchSearchLower ? "hidden" : ""
                  } absolute top-[110%] w-full left-0 bg-white text-black shadow-md rounded-lg max-h-40 overflow-auto scrollbar-hide`}
                >
                  {query &&
                    branchResultLower?.length > 0 &&
                    branchResultLower.map((branch, index) => (
                      <li
                        key={index}
                        className={`py-2 px-4 cursor-pointer truncate text-sm ${
                          index !== branchResultLower.length - 1
                            ? "border-b border-gray-300"
                            : ""
                        }`}
                        onClick={() => {
                          setHideBranchSearchLower(true);
                          setQuery(branch);
                          getTopStores(branch);
                        }}
                      >
                        <span className="inline-flex gap-3 items-center">
                          <MapPin width={16} height={16} strokeWidth={2.5} />
                          <strong> {branch}</strong>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              {/* FILTERS */}
              <div className="flex items-center gap-3">
                {filtersToShowBottom.map((filter) => (
                  <FilterDropdown
                    key={filter.filterKey}
                    filter={filter.filterModule}
                    name={filter.filterLabel}
                    filterKey={filter.filterKey}
                    selectedFilters={selectedFiltersBottom}
                    setSelectedFilters={setSelectedFiltersBottom}
                  />
                ))}
              </div>

              {/* SUBMIT & CLEAR BUTTONS */}
              {Object.values(selectedFiltersBottom).some(
                (filter) => filter.length > 0 && !filter.includes("all")
              ) && (
                <div className="flex items-center gap-3">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
            {/* Filters Display */}
            {Object.values(selectedFiltersBottom).some(
              (filter) => filter.length > 0 && !filter.includes("all")
            ) && (
              <div className="w-full max-w-5xl px-3 py-2 mt-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
                {Object.entries(selectedFiltersBottom)
                  .filter(([, selectedValues]) => !selectedValues.includes("all"))
                  .map(([filterKey, selectedValues]) => {
                    const filter = filtersToShowBottom.find((f) => f.filterKey === filterKey);
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
                          onClick={() => removeFilter(filterKey,"bottom")}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Results Table */}
            {paginatedResults && paginatedResults.length > 0 && !top100StoresLoading && displayedStores.length>0 ? (
              <div className="overflow-x-auto mt-6">
                <table className="w-full max-w-4xl mx-auto border-collapse border border-gray-300 dark:border-gray-700 shadow-md">
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
                  <tbody>
                    {displayedStores.map((storeDetails, index) => (
                      <tr
                        key={index}
                        className={`border border-gray-300 dark:border-gray-700 ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"} hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
                      >
                        <td className="p-3 text-center text-gray-800 dark:text-gray-300">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td
                          className="p-3 text-center font-semibold text-gray-900 dark:text-gray-200 cursor-pointer"
                          onClick={() => {
                            setSearchQuery(storeDetails["store_code"]);
                            showStoreDetails(storeDetails["store_code"]);
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
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-3 mt-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 dark:text-gray-200">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 5))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
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
