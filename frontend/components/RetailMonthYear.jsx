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
  console.log(RetailMonthYearData);

  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors
  const darkColors = ["#00FFFF", "#FF8C00"]; // Contrasting dark mode colors

  // Mapping Month number to Month Name
  const monthNames = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  const previousYear1 = currentYear - 1;
  const previousYear2 = currentYear - 2;

  // Format the data for the BarChart
  const formattedRetailMonthYearData = RetailMonthYearData.reduce(
    (acc, data) => {
      const month = monthNames[data.month] || data.month;
      const existingEntry = acc.find((entry) => entry.month === month);

      if (existingEntry) {
        existingEntry[data.year] = data.value / 10000000; // Convert value to millions
      } else {
        acc.push({
          month,
          [data.year]: data.value / 10000000,
        });
      }

      return acc;
    },
    []
  );

  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <BarChart
        width={500}
        height={300}
        data={formattedRetailMonthYearData}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
        />
        <YAxis
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          unit="Cr" // Indicate values are in millions
        />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />

        {/* Bars for the last two years */}
        <Bar
          dataKey={previousYear2}
          fill={`var(--color-bar-1, ${vibrantColors[0]})`}
        />
        <Bar
          dataKey={previousYear1}
          fill={`var(--color-bar-2, ${vibrantColors[1]})`}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RetailMonthYear;
