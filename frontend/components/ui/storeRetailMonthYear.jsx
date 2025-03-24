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

const StoreRetailMonthYear = ({ storeRetailMonthYear }) => {

  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors
  
  // Mapping Month number to Month Name
  const monthNames = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  const previousYear1 = currentYear - 1;
  const previousYear2 = currentYear - 2;

  // Format the data for the LineChart
  console.log(storeRetailMonthYear);
  const formattedstoreRetailMonthYear = storeRetailMonthYear.reduce((acc, data) => {
    const year = data[0]?.split("-")[0];
    const month = monthNames[Number(data[0]?.split("-")[1])] || data.month;
    const existingEntry = acc.find((entry) => entry.month === month);

    if (existingEntry) {
      existingEntry[year] = data[1]?.total_retailing / 1000; // Convert value to millions
    } else {
      acc.push({
        month,
        [year]: data[1]?.total_retailing / 1000,
      });
    }

    return acc;
  }, []);

  // Find the minimum value in the dataset for a better Y-axis start
  console.log(formattedstoreRetailMonthYear);
  const minValue = Math.min(...formattedstoreRetailMonthYear.flatMap(entry => Object.values(entry).filter(value => typeof value === "number")));
  console.log(minValue);
  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <LineChart
        width={500}
        height={300}
        data={formattedstoreRetailMonthYear}
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
          unit="K" // Indicate values are in millions
          domain={[minValue * 0.9, "auto"]} // Start slightly below the minimum value
        />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />

        {/* Lines for the last two years */}
        <Line
          type="monotone"
          dataKey={previousYear2}
          stroke={`var(--color-line-1, ${vibrantColors[0]})`}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey={previousYear1}
          stroke={`var(--color-line-2, ${vibrantColors[1]})`}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StoreRetailMonthYear;

