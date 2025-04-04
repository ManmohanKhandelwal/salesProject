"use client";

import dynamic from "next/dynamic";
import debounce from "lodash.debounce";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { months, years, zm, sm, be, category, brand, brandform, broadChannel } from "@/constants";
import StoreRetailMonthYear from "@/components/ui/storeRetailMonthYear";
import StoreAdditionalDetails from "@/components/ui/storeAdditionalDetails";
import StorePagePieChart from "@/components/ui/StorePagePieChart";
import { backEndURL } from "@/lib/utils";

import BranchWiseStores from "@/components/ui/BranchWiseStores";

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
];

const productFilter = [
  { filterModule: category, filterLabel: "Category", filterKey: "category" },
  { filterModule: brand, filterLabel: "Brand", filterKey: "brand" },
  { filterModule: brandform, filterLabel: "Brandform", filterKey: "brandform" },
  { filterModule: broadChannel, filterLabel: "Broad Channel", filterKey: "broadChannel" }
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
  const [selectedBranchBottom, setSelectedBranchBottom] = useState("");
  const [topStoresData, setTopStoresData] = useState([]);
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
    be: ["all"],
  });
  const [selectedProductFilters, setSelectedProductFilters] = useState({
    category: ["all"], brand: ["all"], brandform: ["all"], broadChannel:["all"]
  });

  const isBottomFilterSelected = Object.values(selectedFiltersBottom).some(filter => filter[0]!=="all");

  // Download Excel
  const downloadExcel = async () => {
    if (topStoresData.length === 0) {
      console.error("No data available for download.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Top Stores");

    // Define Column Headers
    worksheet.columns = [
      { header: "Store Code", key: "store_code", width: 15 },
      { header: "Store Name", key: "store_name", width: 25 },
      { header: "Branch Name", key: "branch_name", width: 20 },
      { header: "Customer Type", key: "customer_type", width: 15 },
      { header: "Channel", key: "channel", width: 15 },
      { header: "Avg Retailing", key: "avg_retailing", width: 20 },
    ];

    // Add Data Rows
    topStoresData.forEach((store) => {
      const { total_retailing, ...filteredStore } = store;
      worksheet.addRow(filteredStore);
    });

    // Style the Header Row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow background
      };
    });

    // Generate & Download Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const fileData = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    if (selectedBranchBottom)
      saveAs(
        fileData,
        `Top_Stores - ${selectedBranchBottom} ${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`
      );
    else
      saveAs(
        fileData,
        `Top_Stores_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
  };

  // Remove a single filter
  const removeFilter = (filterKey, section) => {
    let updatedFilters;
    section === "top"
      ? (updatedFilters = { ...selectedFiltersTop })
      : (updatedFilters = { ...selectedFiltersBottom });
    console.log("updatedFilters: ", updatedFilters);
    delete updatedFilters[filterKey]; // Remove filter from selected state
    section === "top"
      ? setSelectedFiltersTop(updatedFilters)
      : setSelectedFiltersBottom(updatedFilters);
  };

  const removeProductFilter = (filterKey) => {
    let updatedFilters = { ...selectedProductFilters };
    delete updatedFilters[filterKey];
    setSelectedProductFilters(updatedFilters);
  }

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
        console.log("SelectedItem: ", selectedItem);
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

  const isAnyBottomFilterSelected = () => {
    const queryParams = Object.entries(selectedFiltersBottom).filter(
      ([key, values]) => values.length > 0 && !values.includes("all")
    );
    return queryParams.length > 0 ? true : false;
  };

  //Fetch Dashboard Data
  useEffect(() => {
    setTop100StoresLoading(true);
    setDashboardLoading(true);
    const fetchTop100Stores = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/store/top-stores`,{});
        console.log(response);
        setTopStoresData(
          response.data?.cachedData || response.data?.topStoresDetails
        );
        setPaginatedResults(
          response.data?.cachedData || response.data?.topStoresDetails
        );
        if (response.data?.cachedData?.length > 0)
          setTotalPages(Math.ceil(response.data?.cachedData?.length / 20));
      } catch (error) {
        console.error("Error fetching top 100 stores, Error: ", error);
      } finally {
        setTop100StoresLoading(false);
        setDashboardLoading(false);
      }
    };
    isAnyBottomFilterSelected();
    fetchTop100Stores();
  }, []);

  const getTopStores = useCallback(
    async (query) => {
      if (query?.trim() === "" && selectedBranchBottom === "") return;
      setLoading(true);
      try {
        const response = await axios.post( `http://localhost:5000/store/top-stores`, {
          branchName:query || selectedBranchBottom,
          brandName:selectedProductFilters?.brand?.includes("all")?"":selectedProductFilters.brand,
          categoryName:selectedProductFilters?.category?.includes("all")?"":selectedProductFilters.category,
          brandFormName:selectedProductFilters?.brandform?.includes("all")?"":selectedProductFilters.brandform,
          broadChannelName:selectedProductFilters?.broadChannel?.includes("all")?"":selectedProductFilters.broadChannel,
        });
        console.log(response?.data);
        setResults(response.data?.cachedData);
        setTopStoresData(response.data?.cachedData);
        setCurrentPage(1);
        if (response.data?.cachedData?.length > 0)
          setTotalPages(Math.ceil(response.data?.cachedData?.length / 20));
      } catch (error) {
        console.error("Couldn't fetch top stores, Error: ", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedBranchBottom,selectedProductFilters]
  );

  const getTopStoresByFilter = useCallback(async () => {
    const queryParams = Object.entries(selectedFiltersBottom)
      .filter(([key, values]) => values.length > 0 && !values.includes("all")) // Remove empty and "all"
    if (queryParams?.length === 0) return;
    //if (queryParams?.split("&")?.length > 1) return;
    console.log("queryParams: ", queryParams);
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/store/top-stores`,
        {
          zoneManager:selectedFiltersBottom.zm[0]==="all"?"":selectedFiltersBottom.zm[0],
          salesManager:selectedFiltersBottom.sm[0]==="all"?"":selectedFiltersBottom.sm[0],
          branchExecutive:selectedFiltersBottom.be[0]==="all"?"":selectedFiltersBottom.be[0],
          brandName:selectedProductFilters?.brand?.includes("all")?"":selectedProductFilters.brand,
          categoryName:selectedProductFilters?.category?.includes("all")?"":selectedProductFilters.category,
          brandFormName:selectedProductFilters?.brandform?.includes("all")?"":selectedProductFilters.brandform,
          broadChannelName:selectedProductFilters?.broadChannel?.includes("all")?"":selectedProductFilters.broadChannel,
        }
      );
      setResults(response.data?.cachedData);
      setTopStoresData(response.data?.cachedData);
      setCurrentPage(1);
      if (response.data?.cachedData?.length > 0)
        setTotalPages(Math.ceil(response.data?.cachedData?.length / 20));
    } catch (error) {
      console.error("Error fetching top stores by filter, error: ", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFiltersBottom,selectedProductFilters]);

  const displayedStores =
    (query === "" || selectedBranchBottom === "") &&
    !isAnyBottomFilterSelected()
      ? paginatedResults?.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : results?.slice(
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
    if (section === "lower" && value === "") setResults([]);
    searchBranch(value, section);
  };

  const searchBranch = useCallback(
    debounce(async (q, section) => {
      if (q?.trim() === "") return;
      const lookupForFilter = {
        zm: "zoneManager",
        sm: "salesManager",
        be: "branchExecutive",
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
    getTopStoresByFilter();
    getTopStores();
  }, [selectedFiltersBottom, selectedProductFilters]);

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
            <p className="text-center text-xl font-semibold pb-2">
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
            </div>

            {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
            {Object.values(selectedFiltersTop).some(
              (filter) => filter.length > 0 && !filter.includes("all")
            ) && (
              <div className="w-full max-w-5xl px-3 py-2 mt-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
                {Object.entries(selectedFiltersTop)
                  .filter(
                    ([, selectedValues]) => !selectedValues.includes("all")
                  )
                  .map(([filterKey, selectedValues]) => {
                    const filter = filtersToShowTop.find(
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
                          onClick={() => removeFilter(filterKey, "top")}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* STORE DETAILS */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="col-span-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-6 shadow-md">
                {storeDetails ? (
                  <div>
                    {/* Store Metadata */}
                    <div className="flex justify-center items-center gap-8 font-medium text-xl text-gray-700 dark:text-gray-300">
                      <p>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Store Name:
                        </span>{" "}
                        {storeDetails.metadata?.store_name}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Channel:
                        </span>{" "}
                        {storeDetails.metadata?.channel_description}
                      </p>
                    </div>

                    {/* Line Chart */}
                    <div className="mt-6">
                      <StoreRetailMonthYear
                        storeRetailMonthYear={Object.entries(
                          storeDetails.monthly_metadata
                        )}
                        yearFilter={String(selectedFiltersTop?.years || "all")}
                        monthFilter={String(
                          selectedFiltersTop?.months || "all"
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  // Skeleton Loader for Line Chart
                  <div className="relative h-[400px] bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-900 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 dark:bg-gray-800/10 animate-pulse"></div>
                    <div className="flex flex-col justify-between h-full p-6">
                      {/* Y-Axis Labels */}
                      <div className="flex justify-between">
                        <div className="w-8 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                        <div className="w-8 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-8 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                        <div className="w-8 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                      </div>

                      {/* X-Axis Labels */}
                      <div className="flex justify-between mt-4">
                        <div className="w-12 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                        <div className="w-12 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                        <div className="w-12 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
                        <div className="w-12 h-4 bg-white/30 dark:bg-gray-600 rounded"></div>
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
                    <div className="absolute inset-0 flex justify-center items-center text-white text-lg tracking-wide">
                      Enter store code to see data
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details Section */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 shadow-md">
                <p className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
                  Additional Details
                </p>
                {storeDetails ? (
                  <div className="mt-4">
                    <StoreAdditionalDetails data={storeDetails?.metadata} />
                  </div>
                ) : (
                  <div className="mt-6 text-gray-700 dark:text-gray-300 text-center p-4 rounded-md bg-gray-300 dark:bg-gray-800">
                    No data available!
                  </div>
                )}
              </div>
            </div>

            {storeDetails && storeDetails?.category_retailing && (
              <div className="flex flex-col items-center mt-3 bg-gray-100 dark:bg-gray-900 rounded-xl p-6 shadow-md">
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
            {!isBottomFilterSelected && <div className="flex gap-6 items-center justify-center mt-3">
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
                          setSelectedBranchBottom(branch);
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
            </div>}
            {/* FILTERS and DOWNLOAD BUTTON */}
            <div className="flex items-center justify-center my-3 gap-3">
                {!query &&
                  filtersToShowBottom.map((filter) => (
                    <FilterDropdown
                      key={filter.filterKey}
                      filter={filter.filterModule}
                      name={filter.filterLabel}
                      filterKey={filter.filterKey}
                      selectedFilters={selectedFiltersBottom}
                      setSelectedFilters={setSelectedFiltersBottom}
                    />
                  ))}
                {
                  productFilter.map((filter) => (
                    <FilterDropdown
                    key={filter.filterKey}
                    filter={filter.filterModule}
                    name={filter.filterLabel}
                    filterKey={filter.filterKey}
                    selectedFilters={selectedProductFilters}
                    setSelectedFilters={setSelectedProductFilters}
                    />
                  ))
                }
                <button
                  onClick={downloadExcel}
                  className="bg-green-500 hover:bg-green-700 transition-all duration-200 text-white px-4 py-2 rounded"
                >
                  Download Excel
                </button>
              </div>

            {/* DISPLAY SELECTED FILTERS WITH REMOVE OPTION */}
            {(Object.values(selectedFiltersBottom).some(
              (filter) => filter.length > 0 && !filter.includes("all")) || 
              Object.values(selectedProductFilters).some(
                (filter) => filter.length > 0 && !filter.includes("all")))
             && (
              <div className="w-full max-w-5xl px-3 py-2 mt-2 border border-gray-200 rounded-md bg-gray-50 text-sm flex flex-wrap gap-2 justify-self-center">
                {Object.entries(selectedFiltersBottom)
                  .filter(
                    ([, selectedValues]) => !selectedValues.includes("all")
                  )
                  .map(([filterKey, selectedValues]) => {
                    const filter = filtersToShowBottom.find(
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
                          onClick={() => removeFilter(filterKey, "bottom")}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                  {Object.entries(selectedProductFilters)
                  .filter(
                    ([, selectedValues]) => !selectedValues.includes("all")
                  )
                  .map(([filterKey, selectedValues]) => {
                    const filter = filtersToShowBottom.find(
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
                          onClick={() => removeProductFilter(filterKey)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Results Table */}
            {(!top100StoresLoading && !loading && displayedStores?.length>0) ? (
              <div className="overflow-x-auto mt-3">
                <table className="w-full max-w-5xl mx-auto border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  {/* Table Header */}
                  <thead className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <tr>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Rank
                      </th>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Branch
                      </th>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Store Code
                      </th>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Name
                      </th>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Channel
                      </th>
                      <th className="p-4 text-center text-sm font-semibold border border-gray-300 dark:border-gray-700">
                        Avg Retailing (₹)
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {displayedStores.map((storeDetails, index) => (
                      <tr
                        key={index}
                        className={`border border-gray-300 dark:border-gray-700 ${
                          index % 2 === 0
                            ? "bg-gray-100 dark:bg-gray-900"
                            : "bg-white dark:bg-gray-800"
                        } hover:bg-gray-300 dark:hover:bg-gray-700 transition-all`}
                      >
                        {/* Rank */}
                        <td className="p-4 text-center text-gray-800 dark:text-gray-300">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>

                        {/* Branch Name */}
                        <td className="p-4 text-center text-gray-800 dark:text-gray-300">
                          {storeDetails["branch_name"]}
                        </td>

                        {/* Store Code (Clickable) */}
                        <td
                          className="p-4 text-center font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
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

                        {/* Store Name */}
                        <td className="p-4 text-center text-gray-800 dark:text-gray-300">
                          {storeDetails["store_name"]}
                        </td>

                        {/* Channel */}
                        <td className="p-4 text-center text-gray-800 dark:text-gray-300">
                          {storeDetails["channel"]}
                        </td>

                        {/* Avg Retailing */}
                        <td className="p-4 text-center text-lg font-semibold text-green-700 dark:text-orange-400">
                          ₹ {Number(storeDetails["avg_retailing"]).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  {/* Page Number Buttons */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-2 border rounded-md transition text-gray-700 dark:text-gray-200 ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white dark:bg-blue-500"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50"
                  >
                    Next →
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
