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

const TrendRetail = ({ TrendRetailData }) => {
  // Process data: Sum up yearly totals and divide by 1 crore (10 million)
  const formattedData = TrendRetailData.reduce((acc, curr) => {
    const { year, value } = curr;
    let yearIndex = acc.findIndex((item) => item.year === year);

    if (yearIndex === -1) {
      acc.push({ year, total: value / 1_00_00_000 }); // Convert to Crore
    } else {
      acc[yearIndex].total += value / 1_00_00_000; // Convert to Crore
    }
    return acc;
  }, []);

  console.log(formattedData); // Debugging output

  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        width={500}
        height={300}
        data={formattedData}
        margin={{ top: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          padding={{ left: 30, right: 30 }}
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          dataKey="total"
          label={{ value: "Total (Cr)", angle: -90, position: "insideLeft" }} // Label in Crore
        />
        <Tooltip formatter={(value) => `${value.toFixed(2)} Cr`} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="total"
          name="Retailing Total (Cr)"
          stroke={"var(--color-line-2)"}
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendRetail;
