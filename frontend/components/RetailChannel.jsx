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
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const RetailChannel = ({ ChannelData, BrandData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={400}>
        <Pie
          dataKey="value"
          data={ChannelData}
          cx="50%"
          cy="50%"
          outerRadius={60}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {ChannelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          dataKey="value"
          data={BrandData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          label
        ></Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RetailChannel;
