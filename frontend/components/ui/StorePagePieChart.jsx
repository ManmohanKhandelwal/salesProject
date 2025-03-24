"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useState } from "react";
import { flatMap } from "lodash";

const monthNameToNumber = {
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

const generateColors = (size) => {
  const baseColors = [
    "#FF6B6B", // Vibrant Red
    "#FF9F43", // Warm Orange
    "#E4A11B", // Deep Gold
    "#6BCB77", // Green
    "#4D96FF", // Blue
    "#AA7BC3", // Purple
    "#FF66C4", // Pink
    "#00C2C7", // Cyan
  ];


  // If more colors are needed, generate dynamic HSL-based colors
  return Array.from(
    { length: size },
    (_, i) =>
      baseColors[i % baseColors.length] || `hsl(${(i * 137) % 360}, 70%, 55%)` // Ensures varied, visible colors
  );
};

const RADIAN = Math.PI / 180;

// Function to render labels with percentage values
const renderCustomLabel =
  (formattedData) =>
  ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = formattedData[index]?.percentage.toFixed(2);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        fontSize={12}
        fontWeight="600"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {percentage}%
      </text>
    );
  };

const StorePagePieChart = ({ categoryData, nameKey, yearFilter, monthFilter }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p>Loading chart...</p>;

   // Filter data based on applied filters
   console.log("categoryData, Year, Month: ",categoryData, yearFilter, monthFilter);
  // Filtering categoryData based on yearFilter & monthFilter
  const filteredData = Object.entries(categoryData)
    .filter(([key]) => {
      const [year, month] = key.split("-");
      const isAllYears = yearFilter.includes("all") ;
      const isAllMonths = monthFilter.includes("all");
      console.log(isAllYears,isAllMonths);
      const filteredMonths = isAllMonths?monthFilter:monthNameToNumber[monthFilter];

      return (
        (isAllYears && isAllMonths) || // Default: Show all data
        (isAllYears && filteredMonths.includes(month)) || // Filter by month only
        (isAllMonths && yearFilter.includes(year)) || // Filter by year only
        (yearFilter.includes(year) && filteredMonths.includes(month)) // Filter by both
      );
    })
    .flatMap(([_, values]) => values); // Flatten arrays

  console.log("filteredData:",filteredData)
  // Aggregating total_retailing per category
  const aggregatedData = filteredData.reduce((acc, item) => {
    const existing = acc.find((el) => el.category === item.category);
    if (existing) {
      existing.total_retailing += Number(item.total_retailing);
    } else {
      acc.push({ category: item.category, total_retailing: Number(item.total_retailing) });
    }
    return acc;
  }, []);

  console.log("Filtered & Aggregated Data:", aggregatedData);

  const totalRetailing = aggregatedData.reduce(
    (sum, item) => sum + Math.abs(Number(item.total_retailing)),
    0
  );

  const formattedData = aggregatedData.map((item) => {
    const originalValue = Number(item.total_retailing);
    const absoluteValue = Math.abs(originalValue); // Always positive for pie chart slices
    return {
      name: item[nameKey] || item.category,
      originalValue,
      value: absoluteValue, // Used for rendering PieChart
      percentage: (absoluteValue / totalRetailing) * 100, // Always positive percentage
    };
  });

  const COLORS = generateColors(formattedData?.length);

  return (
    <PieChart width={800} height={350}>
      <Pie
        data={formattedData}
        cx="40%" // Shift pie slightly to the right
        cy="50%"
        labelLine
        label={renderCustomLabel(formattedData)}
        outerRadius={120}
        dataKey="value"
        nameKey="name"
      >
        {formattedData?.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value, name) => {
          const item = formattedData.find((d) => d.value === value);
          return [`${item?.percentage.toFixed(2)}%`, name]; // Show percentage in tooltip
        }}
      />
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{ right: 10 }} // Moves legend closer to the chart
        formatter={(value) => {
          const item = formattedData.find((d) => d.name === value);
          if (!item) return value; // Fallback if no data found

          const formattedValue = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          }).format(item.originalValue);

          return `${item.name} - ${formattedValue} - ${item.percentage.toFixed(
            2
          )}%`;
        }}
      />
    </PieChart>
  );
};

export default StorePagePieChart;
