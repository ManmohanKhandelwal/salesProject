"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "2017-18", retail: 2400, amt: 2400 },
  { name: "2018-19", retail: 1398, amt: 2210 },
  { name: "2019-20", retail: 9800, amt: 2290 },
  { name: "2020-21", retail: 3908, amt: 2000 },
  { name: "2021-22", retail: 4800, amt: 2181 },
  { name: "2022-23", retail: 3800, amt: 2500 },
  { name: "2023-24", retail: 4300, amt: 2100 },
];

const TrendRetail = () => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          padding={{ left: 30, right: 30 }}
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
        />

        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="retail"
          stroke={"var(--color-line-2)"}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendRetail;
