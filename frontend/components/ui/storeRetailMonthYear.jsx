/*'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Sample data for the last 24 months

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const SalesBarChart = ({ storeDetails }) => {
  console.log(storeDetails)
  // const data = Array.from({ length: 6 }, (_, i) => {
  //   const month = new Date();
  //   month.setMonth(month.getMonth() - i);
  //   return {
  //     month: month.toLocaleString('default', { month: 'short', year: '2-digit' }),
  //     totalSales: Number(storeDetails?.total_retailing).toFixed(2),
  //     onlineSales: Number(storeDetails?.highest_retailing_amount).toFixed(2),
  //     inStoreSales: Number(storeDetails?.lowest_retailing_amount).toFixed(2),
  //   };
  // }).reverse();
  const data = Array.isArray(storeDetails)
  ? storeDetails.map(sales => {
      const month = Number(sales.monthYear?.split("-")[1]);
      const year = sales?.monthYear.split("-")[0];

      const date = new Date(year, month - 1, 1);

      return {
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }), 
        totalRetailing: Number(sales?.totalRetailing).toFixed(2),
        highestRetailing: Number(sales?.highestRetailing || 0).toFixed(2),
        lowestRetailing: Number(sales?.lowestRetailing || 0).toFixed(2),
      };
    }).reverse()
  : []
  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sales Report (Last 24 Months)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalRetailing" fill="#8884d8" name="Total Retailing" />
          <Bar dataKey="highestRetailing" fill="#82ca9d" name="Highest Retailing" />
          <Bar dataKey="lowestRetailing" fill="#ffc658" name="Lowest Retailing" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};*/
"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const StoreRetailMonthYear = ({ storeRetailMonthYear, yearFilter, monthFilter }) => {
  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors

  // Mapping month names to numeric format
  const monthNames = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const isAllYears = yearFilter.includes("all");
  const isAllMonths = monthFilter.includes("all");

  // Filter and format data based on selected filters
  const formattedData = [];

  storeRetailMonthYear.forEach((arr) => {
    const year = arr[0];
    const retailData = arr[1];

    Object.keys(retailData.months).forEach((monthNum) => {
      const month = Object.keys(monthNames).find((key) => monthNames[key] === monthNum);

      // Check if the entry exists for the given month
      if (
        (isAllYears || year === yearFilter) &&
        (isAllMonths || monthFilter === month)
      ) {
        let existingEntry = formattedData.find((entry) => entry.month === month);

        if (!existingEntry) {
          existingEntry = { month };
          formattedData.push(existingEntry);
        }

        existingEntry[year] = retailData.months[monthNum] /1000; // Convert value to K
      }
    });
  });

  // Find the minimum value in the dataset for a better Y-axis start
  const minValue = Math.min(
    ...formattedData.flatMap((entry) =>
      Object.values(entry).filter((value) => typeof value === "number")
    )
  );

  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <LineChart
        width={500}
        height={300}
        data={formattedData}
        margin={{ top: 5, bottom: 5, left: 20, right: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          unit="K" // Indicate values are in thousands
          domain={[minValue * 0.9, "auto"]} // Start slightly below the minimum value
        />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />

        {/* Lines for each year */}
        {Object.keys(storeRetailMonthYear.reduce((acc, cur) => ({ ...acc, [cur[0]]: true }), {})).map(
          (year, index) => (
            <Line
              key={year}
              type="monotone"
              dataKey={year}
              stroke={vibrantColors[index % vibrantColors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          )
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StoreRetailMonthYear;


