"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19AF",
];

const RADIAN = Math.PI / 180;

// Label Function (Shows in Cr)
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      fontSize={12}
      fontWeight="semi-bold"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className=""
    >
      {value.toFixed(1)} Cr {/* Display in Cr */}
    </text>
  );
};

// Tooltip (Shows Exact Amount)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-md text-black">
        <p className="font-bold">{payload[0].name}</p>
        <p>
          Value: {Math.round(payload[0].value * 10000000).toString()}{" "}
          {/* Exact Amount */}
        </p>
      </div>
    );
  }
  return null;
};

const RetailChannelPieChart = ({ ChannelData }) => {
  const slicedChannelData = ChannelData.slice(0, 9).map((item) => ({
    ...item,
    value: item.value / 10000000, // Convert to Cr
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={400}>
        <Pie
          dataKey="value"
          data={slicedChannelData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={renderCustomizedLabel} // Show in Cr
        >
          {slicedChannelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RetailChannelPieChart;
