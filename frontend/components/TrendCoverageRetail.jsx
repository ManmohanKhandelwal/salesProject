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
import { useEffect, useState } from "react";

const data = [
  { name: "2017-18", coverage: 4000, retail: 2400, amt: 2400 },
  { name: "2018-19", coverage: 3000, retail: 1398, amt: 2210 },
  { name: "2019-20", coverage: 2000, retail: 9800, amt: 2290 },
  { name: "2020-21", coverage: 2780, retail: 3908, amt: 2000 },
  { name: "2021-22", coverage: 1890, retail: 4800, amt: 2181 },
  { name: "2022-23", coverage: 2390, retail: 3800, amt: 2500 },
  { name: "2023-24", coverage: 3490, retail: 4300, amt: 2100 },
];

const TrendCoverageRetail = () => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="coverage"
          stroke={"var(--color-line-1)"}
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="retail"
          stroke={"var(--color-line-2)"}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendCoverageRetail;
