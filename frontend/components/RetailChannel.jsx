"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const channelData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 346 },
];

const brandData = [
  { name: "Brand A1", value: 250 },
  { name: "Brand A2", value: 150 },
  { name: "Brand B1", value: 200 },
  { name: "Brand B2", value: 100 },
  { name: "Brand C1", value: 90 },
  { name: "Brand C2", value: 110 },
  { name: "Brand C3", value: 100 },
  { name: "Brand D1", value: 100 },
  { name: "Brand D2", value: 100 },
  { name: "Brand E1", value: 178 },
  { name: "Brand E2", value: 100 },
  { name: "Brand F1", value: 146 },
  { name: "Brand F2", value: 100 },
  { name: "Brand F3", value: 100 },
];

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

const RetailChannel = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={400}>
        <Pie
          dataKey="value"
          data={channelData}
          cx="50%"
          cy="50%"
          outerRadius={60}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {channelData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          dataKey="value"
          data={brandData}
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
