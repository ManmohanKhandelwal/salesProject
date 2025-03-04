"use client"
import SummaryCard from "@/components/SummaryCard";
import axios from "axios";
import  debounce  from "lodash.debounce";
import React, { useEffect, useState } from "react";

const Product = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState(null);

  const debouncedSearch = debounce(async (q) => {
    if (!q) return;

    try {
      //const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      //const data = await res.json();
      //setSearchedProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  useEffect(() => {
    const fetchPSRData = async() => {
      try {
        const response = await axios.get("http://localhost:5000/psrSummary/updatePSRSummary");
        console.log(response);
      } catch (error) {
        console.error("Error:", error.message)
      }
    }
  })

  const [selectedItem,setSelectedItem] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSeachResultClick = (id,index) => {
    if(index===-1) setSelectedItem(null);
    else setSelectedItem([id,index]);
  }

  const [serachType, setSearchType] = useState(null);
  const handleSearchTypeSelection = (e) => {
    setSearchType(serachType===e?null:e);
  }
  const isSearchVisible = isFocused || searchQuery.trim() !== '';
  return (
    <div className="p-3">
      <div className="flex flex-col text-center">
        <p className="text-3xl font-semibold">
          Product Overview
        </p>
        <p className="text-md font-semibold text-gray-500 tracking-wide">
          Product sales summary
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 justify-center relative">
        <div className="col-span-2 flex justify-end">
          <input type="text" className="w-1/2 px-6 py-2 text-black rounded-full outline-none border-green-400 border-2 dark:border-orange-400 border-b-1" />
        </div>
        <div className="flex justify-start mx-3 items-center">
        <div className={`rounded-full dark:bg-slate-100 shadow-md shadow-gray-200 dark:shadow-none dark:text-black py-1.5 border dark:border-orange-400 border-green-400`}>
          <div className="grid grid-cols-2 gap-3 font-mono text-sm font-bold mx-3">
            <div className={`rounded-full border flex items-center justify-center cursor-pointer p-1 ${serachType==="category"?"border-green-600 bg-green-600  dark:border-orange-400 dark:bg-orange-400 text-white":"border-black"}`} onClick={() => handleSearchTypeSelection("category")}>Category</div>
            <div className={`rounded-full border flex items-center justify-center cursor-pointer p-1 ${serachType==="brand"?"border-green-600 bg-green-600 dark:border-orange-400 dark:bg-orange-400 dark:text-white":"border-black"}`} onClick={() => handleSearchTypeSelection("brand")}>Brand</div>
          </div>
        </div>
      </div>
      <div className="absolute hidden justify-center mt-1 text-black font-medium top-11 left-1/3">
        <ul className="bg-slate-100 shadow-md rounded-md flex flex-col w-[31rem] gap-1 max-h-40 overflow-y-scroll scrollbar-hide">
          <li className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
          <li className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
          <li className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
          <li className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
          <li className={`cursor-pointer border-b border-slate-300 px-3 py-1 whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
          <li className={`cursor-pointer px-3 py-1 border-none whitespace-pre tracking-wide`}><strong>↖  hello</strong></li>
        </ul>
      </div>
      </div>
      <div className="mt-6 grid grid-cols-4">
        <div className="col-start-4 col-span-1 flex flex-col gap-3">
          <SummaryCard title={"Highest Retailing Brand"} 
            data={{
              title: "Nestle",
              value: "1428723",
            }}/>
          <SummaryCard title={"Lowest Retailing Brand"} 
            data={{
              title: "Bewakoof",
              value: "14287",
            }}/>
          <SummaryCard title={"Highest Retailing Store - Category"} 
          data={{
            title: "Bewakoof",
            value: "14287",
          }}/>
          <SummaryCard title={"Lowest Retailing Store - Category"} 
          data={{
            title: "Bewakoof",
            value: "14287",
          }}/>
        </div>
      </div>
    </div>
  )
};

export default Product;
