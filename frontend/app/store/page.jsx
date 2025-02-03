"use client"
import { debounce, result } from "lodash";
import FilterDropdown from "@/components/FilterDropdown";
import { useState, useEffect } from "react";
const Store = () => {
  const [storeList, setStoreList] = useState([
    {
      id:1,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:2,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:3,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:4,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:5,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:6,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:7,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:8,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:9,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:10,
      "Old Code":"GAGA_01098",
      "New Code":"GAGA_01098",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchedStores,setSearchedStores] = useState([
    {
      id:11,
      "Old Code":"GAGA_01099",
      "New Code":"GAGA_01099",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:12,
      "Old Code":"GAGA_01100",
      "New Code":"GAGA_01100",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:13,
      "Old Code":"GAGA_01111",
      "New Code":"GAGA_01111",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:14,
      "Old Code":"GAGA_01112",
      "New Code":"GAGA_01112",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
    {
      id:15,
      "Old Code":"GAGA_01113",
      "New Code":"GAGA_01113",
      "New Branch":"North",
      "DSE Code":"BGAGA_MS001",
      "ZM":"Somnath Banerjee",
      "SM":"Biswajit Bardhan",
      "BE":"Biswajit Bardhan",
      "STL":"Avijit Das"
    },
  ]);

  const debouncedSearch = debounce(async (q) => {
    if (!q) return;

    try {
      //const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      //const data = await res.json();
      //setSearchedStores(data);
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
          <ul className={`${hideSearch?"hidden":""} z-30 absolute top-24 max-h-48 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-b-lg bg-slate-100 shadow-md shadow-gray-700 w-5/6  dark:text-black`}>
          {searchedStores && searchedStores?.length >0 && searchedStores.map((result,index) =>
            (<li key={result.id} className={`${index!==searchedStores.length-1?"border-b-slate-300 border-b":""} py-2 px-4 whitespace-pre cursor-pointer truncate text-sm`} onClick={() => handleSeachResultClick(result.id,index)}><strong>↖   {result["New Code"]}</strong></li>
          ))}
          </ul>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <div className="px-1 py-2 rounded-md cursor-pointer">
              <FilterDropdown filter={storeList} name={"Filter"}/>
          </div>
        </div>
      </div>
      <div className={`mt-8 flex justify-center ${selectedItem!==null?"blur-[10px]":""}`}>
        <table className="table-fixed border-separate dark:border-white border-black border-2 w-full rounded-t-md max-h-screen overflow-y-auto">
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
          {storeList.map((store,index)=>(
              <tbody key={store.id} >
                <tr>
                  <td title={store["Old Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white  text-center truncate px-1`}>{store["Old Code"]}</td>
                  <td title={store["New Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New Code"]}</td>
                  <td title={store["New Branch"].toUpperCase()}  className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New Branch"].toUpperCase()}</td>
                  <td title={store["DSE Code"]} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["DSE Code"]}</td>
                  <td title={store["ZM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["ZM"].toUpperCase()}</td>
                  <td title={store["SM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["SM"].toUpperCase()}</td>
                  <td title={store["BE"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["BE"].toUpperCase()}</td>
                  <td title={store["STL"].toUpperCase()} className={`w-2/12 ${(storeList.length-1)===index?"":"border-b-2 border-black"} tracking-wide text-center dark:border-white truncate px-1`}>{store["STL"].toUpperCase()}</td>
                </tr>
              </tbody>))}
        </table>
      </div>
      {selectedItem !== null && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="w-1/3 h-80 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-100 dark:to-green-300 text-black p-5 rounded-3xl border-green-200 border-2 shadow-sm shadow-green-500 transition-all duration-300 ease-in-out opacity-0 scale-95 animate-fade-in">
      <div className="grid grid-rows-9 gap-1">
        <div className="grid grid-cols-3 mb-1">
          <div className="text-center font-bold tracking-wider text-[20px] text-green-700 font-open-sans col-start-2 -mt-2 mb-0.5">Store Details</div>
          <div className="col-start-3 flex justify-end pr-3">
            <span className="text-sm cursor-pointer " onClick={() => handleSeachResultClick(-1, -1)}>❌</span>
          </div>
        </div>
        <div className="tracking-wider text-sm">🏷️<strong className="text-green-600">Old Code:</strong> {searchedStores[selectedItem[1]]["Old Code"]}</div>
        <div className="tracking-wider text-sm">🏷️<strong className="text-green-600">New Code:</strong> {searchedStores[selectedItem[1]]["New Code"]}</div>
        <div className="tracking-wider text-sm">🌍<strong className="text-green-600">New Branch:</strong> {searchedStores[selectedItem[1]]["New Branch"].toUpperCase()}</div>
        <div className="tracking-wider text-sm">🏢<strong className="text-green-600">DSE Code:</strong> {searchedStores[selectedItem[1]]["DSE Code"]}</div>
        <div className="tracking-wider text-sm">👤<strong className="text-green-600">ZM:</strong> {searchedStores[selectedItem[1]]["ZM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm">👤<strong className="text-green-600">SM:</strong> {searchedStores[selectedItem[1]]["SM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm">👤<strong className="text-green-600">BE:</strong> {searchedStores[selectedItem[1]]["BE"].toUpperCase()}</div>
        <div className="tracking-wider text-sm">👤<strong className="text-green-600">STL:</strong> {searchedStores[selectedItem[1]]["STL"].toUpperCase()}</div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Store;
