'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Sample data for the last 24 months


const SalesBarChart = ({ storeDetails }) => {
  console.log(storeDetails)
  const data = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    return {
      month: month.toLocaleString('default', { month: 'short', year: '2-digit' }),
      totalSales: Number(storeDetails?.total_retailing).toFixed(2),
      onlineSales: Number(storeDetails?.highest_retailing_amount).toFixed(2),
      inStoreSales: Number(storeDetails?.lowest_retailing_amount).toFixed(2),
    };
  }).reverse();
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
          <Bar dataKey="totalSales" fill="#8884d8" name="Total Retailing" />
          <Bar dataKey="onlineSales" fill="#82ca9d" name="Highest Retailing" />
          <Bar dataKey="inStoreSales" fill="#ffc658" name="Lowest Retailing" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
