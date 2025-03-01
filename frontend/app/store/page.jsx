"use client";
import debounce from "lodash.debounce";
import axios from "axios";
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback } from "react";
import { HashLoader } from "react-spinners";
import CustomLoader from "@/components/ui/loader";
import StoreCard from "@/components/ui/StoreCard";
import SummaryCard from "@/components/SummaryCard";
import { CircleCheck } from "lucide-react";
import SalesBarChart from "@/components/ui/SalesBarChart";
import { be, branches, months, sm, years, zm } from "@/constants";

const filtersToShow = [
  { filterModule: years, filterLabel: "Year", filterKey: "years" },
  { filterModule: months, filterLabel: "Month", filterKey: "months" },
  { filterModule: branches, filterLabel: "Branch", filterKey: "branches" },
  { filterModule: zm, filterLabel: "ZM", filterKey: "zm" },
  { filterModule: sm, filterLabel: "SM", filterKey: "sm" },
  { filterModule: be, filterLabel: "BE", filterKey: "be" },
];

const Store = () => {
  const [storeList, setStoreList] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchedStores, setSearchedStores] = useState(null);

  const [expandedRowId, setExpandedRowId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingForRetailStats, setLoadingForRetailStats] = useState(true);
  const [storeDetails, setStoreDetails] = useState(null);
  //DashBoard Data
  const [dashBoardData, setDashBoardData] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    years: ["all"],
    months: ["all"],
    branches: ["all"],
    zm: ["all"],
    sm: ["all"],
    be: ["all"],
    category: ["all"],
  });

  /*const toggleRow = async (store) => {
    const storeId = store["Id"]; // Ensure correct case

    if (expandedRowId === storeId) {
      setExpandedRowId(null);
      return;
    }

    setLoadingForRetailStats(true);
    setStoreDetails(null); // Clear previous data

    try {
      const response = await axios.get(
        `http://localhost:5000/store/output?oldStoreCode=${store["Old_Store_Code"]}`
      );

      console.log(response.data);
      setStoreDetails(response.data); // Save fetched details
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoadingForRetailStats(false);
      setExpandedRowId(storeId);
    }
  };*/
  const debouncedSearch = useCallback(
    debounce(async (q) => {
      if (!q) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/store/metaData?oldStoreCode=" + q
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

  useEffect(() => {
    /*const fetchStoreList = async () => {
      try {
        const response = await axios.get("/api/store");
        if(!response.ok) throw new Error("Couldn't find stores");
        setStoreList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreList();*/
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem) return;
    const fetchStoreData = async () => {
      try {
        console.log(selectedItem);
        const response = await axios.get(
          `http://localhost:5000/store/output?oldStoreCode=${selectedItem}`
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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/store/dashboard`
        );
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
  };
  return (
    <div className={`pt-3 mx-5`}>
      <div className={``}>
        <div className="flex-col col-span-1 text-center">
          <div className="text-3xl font-bold">Store Overview</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">
            Your current stores summary & activity
          </div>
        </div>
        {/*<div className="col-span-3 flex justify-center items-center relative">
          <div className="w-5/6 -mb-2">
            <input
              className="px-2 py-1.5 border-green-400 dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchInputChange}
            ></input>
          </div>
          <ul
            className={`${
              hideSearch ? "hidden" : ""
            } z-30 absolute top-24 max-h-48 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-b-lg bg-slate-100 shadow-md shadow-gray-700 w-4/5 rounded-t-sm dark:text-black`}
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
                  onClick={() => handleSeachResultClick(result.id, index)}
                >
                  <strong>↖ {result["Old_Store_Code"]}</strong>
                </li>
              ))}
          </ul>
        </div>*/}
        {/*<div className="col-span-1 flex justify-center items-center">
          <div className="px-1 py-2 rounded-md cursor-pointer">
            storeList!==null && storeList.length > 0 && <FilterDropdown filter={storeList} name={"Filter"}/>
          </div>
        </div>*/}
      </div>
      <div className="grid grid-cols-4 my-3 gap-3">
        <div className="flex flex-col gap-3">
          <StoreCard
            title={"Total Stores"}
            data={dashBoardData?.storeCount}
            className={"bg-sale-card-gradient text-white"}
            isShadow={false}
            trend={null}
          />
          <StoreCard
            title={"YoY Growth in Number of Stores"}
            trend={"up"}
            percentChange={2.4}
            className="h-full"
          />
        </div>
        <div className="col-span-2"></div>
        <div className="flex flex-col gap-3">
          <SummaryCard
            title={"Highest retailing store"}
            data={{
              title: dashBoardData?.storeRevenueStats?.highest_earning_customer,
              value: dashBoardData?.storeRevenueStats?.highest_retailing_amount,
            }}
          />
          <SummaryCard
            title={"Lowest retailing store"}
            data={{
              title: dashBoardData?.storeRevenueStats?.lowest_earning_customer,
              value: dashBoardData?.storeRevenueStats?.lowest_retailing_amount,
            }}
          />
        </div>
      </div>
      <div className="p-3">
        <div className="">
          <p className="text-center text-xl font-semibold">
            Retailing of store by Month and Year
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 p-4 border border-gray-300 rounded-lg w-full">
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
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
            <CircleCheck />
          </button>
        </div>
        <div className="flex justify-center items-center relative">
          <div className="w-2/6 mt-3 mb-2">
            <input
              className="px-2 py-1.5 border-green-400 dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black"
              placeholder="Search store here"
              value={searchQuery}
              onChange={handleSearchInputChange}
            ></input>
          </div>
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
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            {storeDetails ? (
              <SalesBarChart storeDetails={storeDetails} />
            ) : (
              <div className="h-[400px] text-white tracking-wide text-lg flex justify-center items-center bg-gradient-to-br rounded-lg from-slate-200 to-slate-600">
                Enter store code to see data
              </div>
            )}
          </div>
        </div>
      </div>
      {/*<div
        className={`mt-8 flex justify-center ${
          selectedItem !== null ? "blur-[10px]" : ""
        }`}
        >
        {loading ? (
          <HashLoader
            loading={loading}
            color="rgb(74 222 128 / var(--tw-bg-opacity, 1))"
            size={75}
            aria-label="Loading Spinner"
            data-testid="loader"
            style={{
              display: "block",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "rotate(165deg)",
            }}
          />
        ) : (
          <table className="table-fixed border-collapse dark:border-white border-black border-2 w-full max-h-screen overflow-y-auto">
            <thead className="sticky top-0 dark:text-black z-20">
              <tr>
                <th className="w-1/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">
                  Old Code
                </th>
                <th className="w-1/12 border-r-2 border-b-2 border-black bg-white">
                  New Code
                </th>
                <th className="w-1/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">
                  New Branch
                </th>
                <th className="w-1/12 border-r-2 border-b-2 border-black bg-white">
                  DSE Code
                </th>
                <th className="w-2/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">
                  ZM
                </th>
                <th className="w-2/12 border-r-2 border-b-2 border-black bg-white">
                  SM
                </th>
                <th className="w-2/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">
                  BE
                </th>
                <th className="w-2/12 border-b-2 border-black bg-white">STL</th>
              </tr>
            </thead>
            <tbody>
              {storeList &&
                storeList.length > 0 &&
                storeList.map((store, index) => (
                  <React.Fragment key={store["Id"]}>
                    <tr
                      onClick={async () => toggleRow(store)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td
                        title={store["Old_Store_Code"]}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white  text-center truncate px-1`}
                      >
                        {store["Old_Store_Code"]}
                      </td>
                      <td
                        title={store["New_Store_Code"]}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["New_Store_Code"]}
                      </td>
                      <td
                        title={store["New_Branch"].toUpperCase()}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["New_Branch"].toUpperCase()}
                      </td>
                      <td
                        title={store["DSE_Code"]}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["DSE_Code"]}
                      </td>
                      <td
                        title={store["ZM"].toUpperCase()}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["ZM"].toUpperCase()}
                      </td>
                      <td
                        title={store["SM"].toUpperCase()}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["SM"].toUpperCase()}
                      </td>
                      <td
                        title={store["BE"].toUpperCase()}
                        className={`w-1/12 border-r-2 border-black ${
                          storeList.length - 1 === index ? "" : "border-b-2 "
                        } tracking-wide  dark:border-white text-center truncate px-1`}
                      >
                        {store["BE"].toUpperCase()}
                      </td>
                      <td
                        title={store["STL"].toUpperCase()}
                        className={`w-2/12 ${
                          storeList.length - 1 === index
                            ? ""
                            : "border-b-2 border-black"
                        } tracking-wide text-center dark:border-white truncate px-1`}
                      >
                        {store["STL"].toUpperCase()}
                      </td>
                    </tr>
                    {expandedRowId === store["Id"] && (
                      <tr>
                        <td
                          colSpan="8"
                          className="p-4 bg-gray-50 dark:bg-gray-800"
                        >
                          {storeDetails ? (
                            <div>
                              <p className="m-1">
                                <strong>Additional Details:</strong>
                              </p>
                              <p className="text-sm font-medium m-1">
                                Total Retailing: ₹{" "}
                                {storeDetails.total_retailing}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Highest Retailing Amount: ₹{" "}
                                {storeDetails.highest_retailing_amount}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Highest Retailing Month:{" "}
                                {storeDetails.highest_retailing_month}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Highest Retailing Product:{" "}
                                {storeDetails.highest_retailing_product}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Highest Retailing Product Amount: ₹{" "}
                                {storeDetails.highest_retailing_product_amount}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Lowest Retailing Amount: ₹{" "}
                                {storeDetails.lowest_retailing_amount}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Lowest Retailing Month:{" "}
                                {storeDetails.lowest_retailing_month}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Lowest Retailing Product:{" "}
                                {storeDetails.lowest_retailing_product}
                              </p>
                              <p className="text-sm font-medium m-1">
                                Lowest Retailing Product Amount: ₹{" "}
                                {storeDetails.lowest_retailing_product_amount}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-red-500">
                              No data available.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        )}
      </div>*/}
      {/*selectedItem !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-3/4 h-80 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-100 dark:to-green-300 text-black p-5 rounded-3xl border-green-200 border-2 shadow-sm shadow-green-500 transition-all duration-300 ease-in-out opacity-0 scale-95 animate-fade-in">
            <div className="grid grid-cols-4 grid-rows-5">
              <div className="grid grid-cols-3 mb-4 col-span-full">
                <div className="text-center font-bold tracking-wider text-[20px] text-green-700 font-open-sans col-start-2 -mt-2 mb-0.5">
                  Store Details
                </div>
                <div className="col-start-3 flex justify-end pr-3">
                  <span
                    className="text-sm cursor-pointer "
                    onClick={() => handleSeachResultClick(-1, -1)}
                  >
                    ❌
                  </span>
                </div>
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">
                🏷️<strong className="text-green-600">Old Code:</strong>{" "}
                {searchedStores[selectedItem[1]]["Old_Store_Code"]}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">
                🏷️<strong className="text-green-600">New Code:</strong>{" "}
                {searchedStores[selectedItem[1]]["New_Store_Code"]}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">
                🌍<strong className="text-green-600">New Branch:</strong>{" "}
                {searchedStores[selectedItem[1]]["New_Branch"].toUpperCase()}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">
                🏢<strong className="text-green-600">DSE Code:</strong>{" "}
                {searchedStores[selectedItem[1]]["DSE_Code"]}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">
                👤<strong className="text-green-600">ZM:</strong>{" "}
                {searchedStores[selectedItem[1]]["ZM"].toUpperCase()}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">
                👤<strong className="text-green-600">SM:</strong>{" "}
                {searchedStores[selectedItem[1]]["SM"].toUpperCase()}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">
                👤<strong className="text-green-600">BE:</strong>{" "}
                {searchedStores[selectedItem[1]]["BE"].toUpperCase()}
              </div>
              <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">
                👤<strong className="text-green-600">STL:</strong>{" "}
                {searchedStores[selectedItem[1]]["STL"].toUpperCase()}
              </div>
              <div className="bg-green-50 dark:bg-green-100 grid grid-cols-5 col-span-full text-center p-0.5 mt-1 rounded-t-sm">
                <div className="border-r border-green-400">Total Retailing</div>
                <div className="border-r border-green-400">
                  Highest Retailing Month
                </div>
                <div className="border-r border-green-400">
                  Highest Sold Product
                </div>
                <div className="border-r border-green-400">
                  Lowest Retailing Month
                </div>
                <div className="">Lowest Sold Product</div>
              </div>
              <div className="bg-green-300 grid grid-cols-5 col-span-full text-center p-0.5 border-l border-r border-b border-green-500">
                <div className="border-r border-green-600">₹5,000,000</div>
                <div className="border-r border-green-600">December</div>
                <div className="border-r border-green-600">Colgate</div>
                <div className="border-r border-green-600">February</div>
                <div>Fashion Shoes</div>
              </div>
            </div>
          </div>
        </div>
      )*/}
    </div>
  );
};

export default Store;
