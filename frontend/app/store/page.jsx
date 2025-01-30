"use client"
import { debounce } from "lodash";
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

  const [searchedStores,setSearchedStores] = useState([]);

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

  return (
    <div className="pt-3 mx-5">
      <div className="grid grid-cols-5">
        <div className="flex-col col-span-1">
          <div className="text-3xl font-bold">Store List</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">Tabular view of Stores</div>
        </div>
        <div className="col-span-3 flex justify-center items-center relative">
          <div className="w-5/6">
            <input className="px-2 py-1.5 border-black dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black" placeholder="Search here" value={searchQuery} onChange={handleSearchInputChange}></input>
          </div>
          <ul className="z-30 absolute top-24 max-h-44 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-xl bg-slate-100 shadow-md shadow-gray-700 w-5/6 hidden dark:text-black">
            <li className="border-b-slate-300 border-b py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
            <li className="border-b-slate-300 border-b py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
            <li className="border-b-slate-300 border-b py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
            <li className="border-b-slate-300 border-b py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
            <li className="border-b-slate-300 border-b py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
            <li className=" py-2 px-4 whitespace-pre cursor-pointer truncate">↖   hello world</li>
          </ul>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <div className="px-1 py-2 rounded-md cursor-pointer">
              <FilterDropdown filter={storeList} name={"Filter"}/>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center ">
        <table className="table-fixed border-separate dark:border-white border-black border-2 w-full rounded-t-md max-h-screen overflow-y-auto">
          <thead className="sticky top-0 dark:text-black">
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
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white  text-center truncate px-1`}>{store["Old Code"]}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New Code"]}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["New Branch"].toUpperCase()}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["DSE Code"]}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["ZM"].toUpperCase()}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["SM"].toUpperCase()}</td>
                  <td className={`w-1/12 border-r-2 border-black ${(storeList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{store["BE"].toUpperCase()}</td>
                  <td className={`w-2/12 ${(storeList.length-1)===index?"":"border-b-2 border-black"} tracking-wide text-center dark:border-white truncate px-1`}>{store["STL"].toUpperCase()}</td>
                </tr>
              </tbody>))}
        </table>
      </div>
    </div>
  );
};

export default Store;
