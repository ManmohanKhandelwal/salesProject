"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";

const generateColors = (size) => {
  return Array.from(
    { length: size },
    (_, i) => `hsl(${(i * 360) / size}, 70%, 50%)`
  );
};

const RADIAN = Math.PI / 180;

// Labels like RetailChannelPieChart (Shows in Cr)
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.25; // Match label positioning
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
      {value.toFixed(1)} Cr {/* Display in Cr */}
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
    value: Number(item.total_retailing) / 10000000, // Convert to Cr
  }));

  const COLORS = generateColors(formattedData?.length);

  return (
    <PieChart width={350} height={250}>
      <Pie
        data={formattedData}
        cx="50%"
        cy="50%"
        labelLine
        label={renderCustomLabel}
        outerRadius={85}
        dataKey="value"
        nameKey="name"
      >
        {formattedData?.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default StorePagePieChart;
