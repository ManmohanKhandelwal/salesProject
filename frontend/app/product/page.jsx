"use client";
import SummaryCard from "@/components/SummaryCard";
import axios from "axios";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
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


const Product = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedBrand, setSearchedPBrand] = useState(null);
  const [searchedCategory, setSearchedCategory] = useState(null);
  const [searchType, setSearchType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const debouncedSearch = useCallback(debounce(async (q, currentSearchType) => {
    console.log(q,currentSearchType);
    if (!q) return;
    if (!currentSearchType) return;
    setLoading(true);
    let brandName = "", categoryName = "";
    currentSearchType === "category" ? (categoryName = q) : (brandName = q);
    try {
      const response = await axios.post(backEndURL("/product/suggestions"), {
        categoryName,
        brandName,
        searchType: currentSearchType,
      });
      console.log(response);
      searchType === "category"
        ? setSearchedCategory(response.data)
        : setSearchedPBrand(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, 500),[]);

  const handleSearchInputChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value, searchType);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchTypeSelection = (type) => {
    console.log(type);
    setSearchType((prev) => (prev === type ? null : type));
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
            placeholder="Search Products..."
            className="w-1/2 px-3 py-2 text-black rounded-lg outline-none focus:border-green-400 border-2 focus:dark:border-orange-400 border-b-1"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="flex justify-start mx-3 items-center">
          <div
            className={`rounded-lg shadow-md shadow-gray-200 dark:shadow-none dark:text-black py-1.5 border-2 dark:border-orange-400 border-green-400`}
          >
            <div className="grid grid-cols-2 gap-3 font-sans tracking-wide text-sm font-medium mx-1.5">
              <div
                className={`rounded-lg dark:text-white dark:border-2 flex items-center justify-center cursor-pointer p-1 ${
                  searchType === "category"
                    ? "border-green-600 bg-green-600  dark:border-orange-400 dark:bg-orange-400 text-white"
                    : "border-black"
                }`}
                onClick={() => handleSearchTypeSelection("category")}
              >
                Category
              </div>
              <div
                className={`rounded-lg dark:text-white dark:border-2 flex items-center justify-center cursor-pointer p-1 ${
                  searchType === "brand"
                    ? "border-green-600 bg-green-600 dark:border-orange-400 dark:bg-orange-400 text-white"
                    : "border-black"
                }`}
                onClick={() => handleSearchTypeSelection("brand")}
              >
                Brand
              </div>
            </div>
          </div>
        </div>
        {<div className="absolute hidden justify-center mt-1 text-black font-medium top-[110%] left-1/3">
          <ul className="bg-slate-100 shadow-md rounded-md flex flex-col w-[31rem] gap-1 max-h-40 overflow-y-scroll scrollbar-hide">
            <li
              className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}
            >
              <strong>↖ hello</strong>
            </li>
          </ul>
        </div>}
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
      {/*data && (
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
      )*/}

      {/*<div className="w-full h-64 bg-white p-4 shadow-lg rounded-2xl">
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
      </div>*/}
    </div>
  );
};

export default Product;
