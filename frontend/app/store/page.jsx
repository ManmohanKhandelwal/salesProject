"use client"
import debounce from "lodash.debounce";
import axios from 'axios';
import FilterDropdown from "@/components/FilterDropdown";
import React, { useState, useEffect, useCallback  } from "react";
const Store = () => {
  const [storeList, setStoreList] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchedStores,setSearchedStores] = useState(null);

  const [expandedRowId, setExpandedRowId] = useState(null);

  const [loading, setLoading] = useState(false);

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const debouncedSearch = useCallback(debounce(async (q) => {
    if (!q) return;

    try {
      const response = await axios.get('http://localhost:5000/store/getStoreByID', {
        params: { Old_Store_Code: q },
    });
    
    setSearchedStores(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
  }
  }, 300),[]); 

  const handleSearchInputChange = (e) => {
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
    const fetchStoreList = async() =>{
      try {
        const response = await axios.get('http://localhost:5000/store/getStores');
        setStoreList(response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }
    fetchStoreList();
  },[])

  const [selectedItem,setSelectedItem] = useState(null);
  const [hideSearch, setHideSearch] = useState(false);
  
  const handleSeachResultClick = (id,index) => {
    if(index===-1) setSelectedItem(null);
    else setSelectedItem([id,index]);
    setHideSearch(!hideSearch);
  }
  return (
    <div className={`pt-3 mx-5`}>
      <div className={`grid grid-cols-5 ${selectedItem!==null?"blur-[10px]":""}`}>
        <div className="flex-col col-span-1">
          <div className="text-3xl font-bold">Store List</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">Tabular view of Stores</div>
        </div>
        <div className="col-span-3 flex justify-center items-center relative">
          <div className="w-5/6 -mb-2">
            <input className="px-2 py-1.5 border-green-400 dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black" placeholder="Search here" value={searchQuery} onChange={handleSearchInputChange}></input>
          </div>
          <ul className={`${hideSearch?"hidden":""} z-30 absolute top-24 max-h-48 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-b-lg bg-slate-100 shadow-md shadow-gray-700 w-4/5 rounded-t-sm dark:text-black`}>
          {searchQuery && searchedStores && searchedStores?.length >0 && searchedStores.map((result,index) =>
            (<li key={result["Id"]} className={`${index!==searchedStores.length-1?"border-b-slate-300 border-b":""} py-2 px-4 whitespace-pre cursor-pointer truncate text-sm`} onClick={() => handleSeachResultClick(result.id,index)}><strong>↖   {result["Old_Store_Code"]}</strong></li>
          ))}
          </ul>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <div className="px-1 py-2 rounded-md cursor-pointer">
              {/*storeList!==null && storeList.length > 0 && <FilterDropdown filter={storeList} name={"Filter"}/>*/}
          </div>
        </div>
      </div>
      <div className={`mt-8 flex justify-center ${selectedItem!==null?"blur-[10px]":""}`}>
        <table className="table-fixed border-collapse dark:border-white border-black border-2 w-full max-h-screen overflow-y-auto">
          <thead className="sticky top-0 dark:text-black z-20">
            <tr>
              <th className="w-1/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">Old Code</th>
              <th className="w-1/12 border-r-2 border-b-2 border-black bg-white">New Code</th>
              <th className="w-1/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">New Branch</th>
              <th className="w-1/12 border-r-2 border-b-2 border-black bg-white">DSE Code</th>
              <th className="w-2/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">ZM</th>
              <th className="w-2/12 border-r-2 border-b-2 border-black bg-white">SM</th>
              <th className="w-2/12 border-r-2 border-b-2 border-black dark:bg-green-400 bg-green-300">BE</th>
              <th className="w-2/12 border-b-2 border-black bg-white">STL</th>
            </tr>
          </thead>
          <tbody>
            {storeList && storeList.length>0 && storeList.map((store,index)=>(
                <React.Fragment key={store["Id"]}>
                  <tr onClick={() => toggleRow(store.id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td title={store["Old_Store_Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white  text-center truncate px-1`}>{store["Old_Store_Code"]}</td>
                    <td title={store["New_Store_Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New_Store_Code"]}</td>
                    <td title={store["New_Branch"].toUpperCase()}  className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New_Branch"].toUpperCase()}</td>
                    <td title={store["DSE_Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["DSE_Code"]}</td>
                    <td title={store["ZM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["ZM"].toUpperCase()}</td>
                    <td title={store["SM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["SM"].toUpperCase()}</td>
                    <td title={store["BE"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["BE"].toUpperCase()}</td>
                    <td title={store["STL"].toUpperCase()} className={`w-2/12 ${(storeList.length-1)===index?"":"border-b-2 border-black"} tracking-wide text-center dark:border-white truncate px-1`}>{store["STL"].toUpperCase()}</td>
                  </tr>
                  {expandedRowId === store.id && (
                    <tr>
                      <td colSpan="8" className="p-4 bg-gray-50 dark:bg-gray-800">
                        <div>
                          <p className="m-1"><strong>Additional Details:</strong></p>
                          <p className="text-sm font-medium m-1">Total Retailing: ₹5,000,000</p>
                          <p className="text-sm font-medium m-1">Highest Retailing Month: December</p>
                          <p className="text-sm font-medium m-1">Highest Sold Product: Colgate</p>
                          <p className="text-sm font-medium m-1">Lowest Retailing Month: February</p>
                          <p className="text-sm font-medium m-1">Lowest Sold Product: Fashion Shoes</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      {selectedItem !== null && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="w-3/4 h-80 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-100 dark:to-green-300 text-black p-5 rounded-3xl border-green-200 border-2 shadow-sm shadow-green-500 transition-all duration-300 ease-in-out opacity-0 scale-95 animate-fade-in">
      <div className="grid grid-cols-4 grid-rows-5">
        <div className="grid grid-cols-3 mb-4 col-span-full">
          <div className="text-center font-bold tracking-wider text-[20px] text-green-700 font-open-sans col-start-2 -mt-2 mb-0.5">Store Details</div>
          <div className="col-start-3 flex justify-end pr-3">
            <span className="text-sm cursor-pointer " onClick={() => handleSeachResultClick(-1, -1)}>❌</span>
          </div>
        </div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">🏷️<strong className="text-green-600">Old Code:</strong> {searchedStores[selectedItem[1]]["Old_Store_Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">🏷️<strong className="text-green-600">New Code:</strong> {searchedStores[selectedItem[1]]["New_Store_Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">🌍<strong className="text-green-600">New Branch:</strong> {searchedStores[selectedItem[1]]["New_Branch"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">🏢<strong className="text-green-600">DSE Code:</strong> {searchedStores[selectedItem[1]]["DSE_Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">👤<strong className="text-green-600">ZM:</strong> {searchedStores[selectedItem[1]]["ZM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">👤<strong className="text-green-600">SM:</strong> {searchedStores[selectedItem[1]]["SM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">👤<strong className="text-green-600">BE:</strong> {searchedStores[selectedItem[1]]["BE"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">👤<strong className="text-green-600">STL:</strong> {searchedStores[selectedItem[1]]["STL"].toUpperCase()}</div>
        <div className="bg-green-50 dark:bg-green-100 grid grid-cols-5 col-span-full text-center p-0.5 mt-1 rounded-t-sm">
          <div className="border-r border-green-400">Total Retailing</div>
          <div className="border-r border-green-400">Highest Retailing Month</div>
          <div className="border-r border-green-400">Highest Sold Product</div>
          <div className="border-r border-green-400">Lowest Retailing Month</div>
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
)}
    </div>
  );
};

export default Store;
