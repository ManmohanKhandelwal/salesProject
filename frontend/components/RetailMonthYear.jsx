"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RetailMonthYear = ({ RetailMonthYearData }) => {
  console.log(RetailMonthYearData);

  const vibrantColors = ["#FF6F61", "#6B5B95"]; // Light mode vibrant colors
  
  // Mapping Month number to Month Name
  const monthNames = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  const previousYear1 = currentYear - 1;
  const previousYear2 = currentYear - 2;

  // Format the data for the LineChart
  const formattedRetailMonthYearData = RetailMonthYearData.reduce((acc, data) => {
    const month = monthNames[data.month] || data.month;
    const existingEntry = acc.find((entry) => entry.month === month);

    if (existingEntry) {
      existingEntry[data.year] = data.value / 10000000; // Convert value to millions
    } else {
      acc.push({
        month,
        [data.year]: data.value / 10000000,
      });
    }

    return acc;
  }, []);

  // Find the minimum value in the dataset for a better Y-axis start
  const minValue = Math.min(...formattedRetailMonthYearData.flatMap(entry => Object.values(entry).filter(value => typeof value === "number")));

  return (
    <ResponsiveContainer width={"100%"} height={600}>
      <LineChart
        width={500}
        height={300}
        data={formattedRetailMonthYearData}
        margin={{ top: 5, bottom: 5, left: 20, right: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
          unit="Cr" // Indicate values are in millions
          domain={[minValue * 0.9, "auto"]} // Start slightly below the minimum value
        />
        <Tooltip contentStyle={{ color: "#000" }} />
        <Legend />

        {/* Lines for the last two years */}
        <Line
          type="monotone"
          dataKey={previousYear2}
          stroke={`var(--color-line-1, ${vibrantColors[0]})`}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey={previousYear1}
          stroke={`var(--color-line-2, ${vibrantColors[1]})`}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RetailMonthYear;