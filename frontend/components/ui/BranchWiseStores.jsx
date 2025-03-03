"use client"
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
const BranchWiseStores = ({ branchList }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    console.log(branchList)
  return (
    <div className="p-5 shadow-lg shadow-green-500 rounded-lg flex flex-col gap-3 relative">
        <p className="text-xl font-bold tracking-wide">Branch Wise Stores</p>
        <div className="flex justify-between items-center">
            <p className="text-3xl tracking-wide font-semibold">{(branchList[currentIndex]?.branch).toUpperCase()}</p>
            <p className="text-2xl font-semibold">{branchList[currentIndex]?.store_count}</p>
        </div>
        <div className='absolute rounded-full w-5 h-5 bg-green-500 shadow-md shadow-green-400/60 -left-3 top-1/2 cursor-pointer  flex justify-center items-center' onClick={() => setCurrentIndex(currentIndex => currentIndex==0?branchList.length-1:currentIndex-1)}><ChevronLeft /></div>
        <div className='absolute rounded-full w-5 h-5 bg-green-500 shadow-md shadow-green-400/60 -right-3 top-1/2 cursor-pointer flex justify-center items-center' onClick={() => setCurrentIndex(currentIndex => currentIndex==branchList.length-1?0:currentIndex+1)}><ChevronRight /></div>
    </div>
  )
}

export default BranchWiseStores