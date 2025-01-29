"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "January", 2023: 4000, 2024: 2400, amt: 2400 },
  { name: "February", 2023: 3000, 2024: 1398, amt: 2210 },
  { name: "March", 2023: 2000, 2024: 5800, amt: 2290 },
  { name: "April", 2023: 2780, 2024: 3908, amt: 2000 },
  { name: "May", 2023: 1890, 2024: 4800, amt: 2181 },
  { name: "June", 2023: 2390, 2024: 3800, amt: 2500 },
  { name: "July", 2023: 3490, 2024: 4300, amt: 2100 },
  { name: "August", 2023: 5490, 2024: 4600, amt: 2100 },
  { name: "September", 2023: 3990, 2024: 4100, amt: 2100 },
  { name: "October", 2023: 3460, 2024: 4305, amt: 2100 },
  { name: "November", 2023: 3690, 2024: 4370, amt: 2100 },
  { name: "December", 2023: 3190, 2024: 4800, amt: 2100 },
];

const RetailMonthYear = () => {
  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors
  const darkColors = ["#00FFFF", "#FF8C00"]; // Contrasting dark mode colors

  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />
        <Bar dataKey="2023" fill={`var(--color-bar-1, ${vibrantColors[0]})`} />
        <Bar dataKey="2024" fill={`var(--color-bar-2, ${vibrantColors[1]})`} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RetailMonthYear;
