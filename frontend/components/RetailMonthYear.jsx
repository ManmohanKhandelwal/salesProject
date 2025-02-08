"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RetailMonthYear = ({ RetailMonthYearData }) => {
  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors
  const darkColors = ["#00FFFF", "#FF8C00"]; // Contrasting dark mode colors

  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <BarChart
        width={500}
        height={300}
        data={RetailMonthYearData}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
        />
        <YAxis tick={{ fill: "var(--color-tick)", fontWeight: "bold" }} />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />
        <Bar dataKey="2023" fill={`var(--color-bar-1, ${vibrantColors[0]})`} />
        <Bar dataKey="2024" fill={`var(--color-bar-2, ${vibrantColors[1]})`} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RetailMonthYear;
