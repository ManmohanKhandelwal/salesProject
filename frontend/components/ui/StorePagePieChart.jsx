"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";

const generateColors = (size) => {
  return Array.from(
    { length: size },
    (_, i) => `hsl(${(i * 360) / size}, 80%, 50%)`
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

const StorePagePieChart = ({ data, nameKey }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p>Loading chart...</p>;

  // Sum the absolute values of retailing
  const totalRetailing = data?.reduce((sum, item) => sum + Math.abs(Number(item.total_retailing)), 0);

  const formattedData = data?.map((item) => {
    const originalValue = Number(item.total_retailing);
    const absoluteValue = Math.abs(originalValue); // Always positive for pie chart slices
    return {
      name: item[nameKey],
      originalValue,
      value: absoluteValue, // Used for rendering PieChart
      percentage: (absoluteValue / totalRetailing) * 100, // Always positive percentage
    };
  });

  const COLORS = generateColors(formattedData?.length);

  return (
    <PieChart width={500} height={350}>
      <Pie
        data={formattedData}
        cx="50%"
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
        formatter={(value, name, props) => {
          const percentage = formattedData.find((item) => item.value === value)?.percentage.toFixed(2);
          return [`${percentage}%`, name]; // Show percentage in tooltip
        }}
      />
    </PieChart>
  );
};

export default StorePagePieChart;


