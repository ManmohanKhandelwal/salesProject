"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const TrendCoverage = ({ TrendCoverageData }) => {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        width={500}
        height={300}
        data={TrendCoverageData}
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

        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="coverage"
          stroke={"var(--color-line-1)"}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendCoverage;
