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

// Labels like RetailChannelPieChart (Shows in Cr)
const renderCustomLabel =
  (formattedData) =>
  ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.25; // Match label positioning
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const originalValue = formattedData[index]?.originalValue;
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
        {originalValue?.toFixed(2)}
      </text>
    );
  };

const StorePagePieChart = ({ data, nameKey }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p>Loading chart...</p>;

  const formattedData = data?.map((item) => ({
    name: item[nameKey],
    originalValue: Number(item.total_retailing), // Store original value
    value: Math.abs(Number(item.total_retailing)),
  }));

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
          const originalValue = formattedData.find(
            (item) => item.value === value
          )?.originalValue;
          return [`${originalValue}`, name]; // Show actual negative/positive value
        }}
      />
    </PieChart>
  );
};

export default StorePagePieChart;
