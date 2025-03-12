"use client";
import SummaryCard from "@/components/SummaryCard";
import axios from "axios";
import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { backEndURL } from "@/lib/utils";

const sampleData = [
  { month: "Sep", sales: 4000 },
  { month: "Oct", sales: 3000 },
  { month: "Nov", sales: 5000 },
  { month: "Dec", sales: 7000 },
  { month: "Jan", sales: 6000 },
  { month: "Feb", sales: 8000 },
];

const Product = () => {
  const [brand, setBrand] = useState("");
  const [data, setData] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBrand, setSearchedPBrand] = useState(null);
  const [searchedCategory, setSearchedCategory] = useState(null);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = debounce(async (q) => {
    if (!q) return;
    if (!searchType) return;
    setLoading(true);
    try {
      const response = await axios.post(backEndURL(), {
        searchQuery: q,
        searchType,
      });
      console.log(response.data);
      searchType === "category"
        ? setSearchedCategory(response.data)
        : setSearchedPBrand(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchTypeSelection = (e) => {
    setSearchType(searchType === e ? null : e);
  };
  const isSearchVisible = isFocused || searchQuery.trim() !== "";

  const handleSearch = () => {
    // Fetch brand data based on search (Replace with actual API call)
    const fetchedData = {
      highestRetailing: {
        brandform: "Brand A",
        subBrandform: "Sub A1",
        amount: 10000,
      },
      lowestRetailing: {
        brandform: "Brand B",
        subBrandform: "Sub B1",
        amount: 2000,
      },
      highestByBranch: {
        branch: "Branch X",
        brandform: "Brand A",
        amount: 12000,
      },
      lowestByBranch: {
        branch: "Branch Y",
        brandform: "Brand B",
        amount: 1500,
      },
    };
    setData(fetchedData);
  };

  return (
    <div className="p-3">
      <div className="flex flex-col text-center">
        <p className="text-3xl font-semibold">Product Overview</p>
        <p className="text-md font-semibold text-gray-500 tracking-wide">
          Product sales summary
        </p>
      </div>
      <div className="my-3 grid grid-cols-3 justify-center relative">
        <div className="col-span-2 flex justify-end">
          <input
            type="text"
            className="w-1/2 px-6 py-2 text-black rounded-full outline-none border-green-400 border-2 dark:border-orange-400 border-b-1"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-orange-400 text-white mx-3 px-1.5  rounded-lg"
          >
            Search
          </button>
        </div>
        <div className="flex justify-start mx-3 items-center">
          <div
            className={`rounded-full dark:bg-slate-100 shadow-md shadow-gray-200 dark:shadow-none dark:text-black py-1.5 border dark:border-orange-400 border-green-400`}
          >
            <div className="grid grid-cols-2 gap-3 font-mono text-sm font-bold mx-3">
              <div
                className={`rounded-full border flex items-center justify-center cursor-pointer p-1 ${
                  searchType === "category"
                    ? "border-green-600 bg-green-600  dark:border-orange-400 dark:bg-orange-400 text-white"
                    : "border-black"
                }`}
                onClick={() => handleSearchTypeSelection("category")}
              >
                Category
              </div>
              <div
                className={`rounded-full border flex items-center justify-center cursor-pointer p-1 ${
                  searchType === "brand"
                    ? "border-green-600 bg-green-600 dark:border-orange-400 dark:bg-orange-400 dark:text-white"
                    : "border-black"
                }`}
                onClick={() => handleSearchTypeSelection("brand")}
              >
                Brand
              </div>
            </div>
          </div>
        </div>
        <div className="absolute hidden justify-center mt-1 text-black font-medium top-11 left-1/3">
          <ul className="bg-slate-100 shadow-md rounded-md flex flex-col w-[31rem] gap-1 max-h-40 overflow-y-scroll scrollbar-hide">
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
            <li
              className={`cursor-pointer px-3 py-1 border-none whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
          </ul>
        </div>
      </div>
      {!loading && searchedCategory && (
        <div className="mt-6 grid grid-cols-4">
          <div className="col-start-4 col-span-1 flex flex-col gap-3">
            <SummaryCard
              title={"Highest Retailing Brand"}
              data={{
                title: "Nestle",
                value: "1428723",
              }}
            />
            <SummaryCard
              title={"Lowest Retailing Brand"}
              data={{
                title: "Bewakoof",
                value: "14287",
              }}
            />
            <SummaryCard
              title={"Highest Retailing Store - Category"}
              data={{
                title: "Bewakoof",
                value: "14287",
              }}
            />
            <SummaryCard
              title={"Lowest Retailing Store - Category"}
              data={{
                title: "Bewakoof",
                value: "14287",
              }}
            />
          </div>
        </div>
      )}
      {data && (
        <div className="grid grid-cols-2 gap-6">
          {[
            "highestRetailing",
            "lowestRetailing",
            "highestByBranch",
            "lowestByBranch",
          ].map((key) => (
            <Card key={key} className="p-4 shadow-lg rounded-2xl">
              <CardContent>
                <h3 className="text-lg font-semibold capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </h3>
                <p>
                  <strong>Brandform:</strong> {data[key].brandform}
                </p>
                {data[key].subBrandform && (
                  <p>
                    <strong>Sub-Brandform:</strong> {data[key].subBrandform}
                  </p>
                )}
                {data[key].branch && (
                  <p>
                    <strong>Branch:</strong> {data[key].branch}
                  </p>
                )}
                <p>
                  <strong>Amount:</strong> ${data[key].amount}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="w-full h-64 bg-white p-4 shadow-lg rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">
          Performance Over Last 6 Months
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Product;
