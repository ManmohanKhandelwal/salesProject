"use client"
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";

const Product = () => {
  const [productList, setProductList] = useState(null);

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
          <div className="text-3xl font-bold">Product List</div>
          <div className="text-md font-semibold text-gray-500 tracking-wide">Tabular view of Products</div>
        </div>
        <div className="col-span-3 flex justify-center items-center relative">
          <div className="w-5/6 -mb-2">
            <input className="px-2 py-1.5 border-green-400 dark:border-orange-500 border-2 outline-none rounded-full w-full dark:text-black" placeholder="Search here" value={searchQuery} onChange={handleSearchInputChange}></input>
          </div>
          <ul className={`${hideSearch?"hidden":""} z-30 absolute top-24 max-h-48 overflow-y-auto scrollbar-hide md:top-16 lg:top-14 left-50 rounded-b-lg bg-slate-100 shadow-md shadow-gray-700 w-4/5 rounded-t-sm dark:text-black`}>
          {searchedProducts && searchedProducts?.length >0 && searchedProducts.map((result,index) =>
            (<li key={result.id} className={`${index!==searchedProducts.length-1?"border-b-slate-300 border-b":""} py-2 px-4 whitespace-pre cursor-pointer truncate text-sm`} onClick={() => handleSeachResultClick(result.id,index)}><strong>↖   {result["New Code"]}</strong></li>
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
            {productList && productList?.length>0 &&  productList.map((product,index)=>(
                <React.Fragment key={product.id}>
                  <tr onClick={() => toggleRow(product.id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td title={product["Old Code"]} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white  text-center truncate px-1`}>{product["Old Code"]}</td>
                    <td title={product["New Code"]} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["New Code"]}</td>
                    <td title={product["New Branch"].toUpperCase()}  className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["New Branch"].toUpperCase()}</td>
                    <td title={product["DSE Code"]} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["DSE Code"]}</td>
                    <td title={product["ZM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["ZM"].toUpperCase()}</td>
                    <td title={product["SM"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["SM"].toUpperCase()}</td>
                    <td title={product["BE"].toUpperCase()} className={`w-1/12 border-r-2 border-black ${(productList.length-1)===index?"":"border-b-2 "} tracking-wide  dark:border-white text-center truncate px-1`}>{product["BE"].toUpperCase()}</td>
                    <td title={product["STL"].toUpperCase()} className={`w-2/12 ${(productList.length-1)===index?"":"border-b-2 border-black"} tracking-wide text-center dark:border-white truncate px-1`}>{product["STL"].toUpperCase()}</td>
                  </tr>
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
          <div className="text-center font-bold tracking-wider text-[20px] text-green-700 font-open-sans col-start-2 -mt-2 mb-0.5">Product Details</div>
          <div className="col-start-3 flex justify-end pr-3">
            <span className="text-sm cursor-pointer " onClick={() => handleSeachResultClick(-1, -1)}>❌</span>
          </div>
        </div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">🏷️<strong className="text-green-600">Old Code:</strong> {searchedProducts[selectedItem[1]]["Old Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">🏷️<strong className="text-green-600">New Code:</strong> {searchedProducts[selectedItem[1]]["New Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">🌍<strong className="text-green-600">New Branch:</strong> {searchedProducts[selectedItem[1]]["New Branch"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">🏢<strong className="text-green-600">DSE Code:</strong> {searchedProducts[selectedItem[1]]["DSE Code"]}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">👤<strong className="text-green-600">ZM:</strong> {searchedProducts[selectedItem[1]]["ZM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">👤<strong className="text-green-600">SM:</strong> {searchedProducts[selectedItem[1]]["SM"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-end mr-6">👤<strong className="text-green-600">BE:</strong> {searchedProducts[selectedItem[1]]["BE"].toUpperCase()}</div>
        <div className="tracking-wider text-sm col-span-2 flex justify-start ml-6">👤<strong className="text-green-600">STL:</strong> {searchedProducts[selectedItem[1]]["STL"].toUpperCase()}</div>
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
  )
};

export default Product;
