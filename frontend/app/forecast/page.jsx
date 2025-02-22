"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        // Fetch Forecasted Sales Data
        const forecastResponse = await fetch("http://localhost:8000/forecast");
        if (!forecastResponse.ok)
          throw new Error("Failed to fetch forecast data");
        const forecast = await forecastResponse.json();

        // Fetch Actual Sales Data for Previous Years (2023 & 2024)
        const actualSalesResponse = await fetch(
          "http://localhost:5000/forecast/actual-sales"
        );
        if (!actualSalesResponse.ok)
          throw new Error("Failed to fetch actual sales data");
        const actualSales = await actualSalesResponse.json();

        // Map Actual Sales Data for Quick Lookup
        const actualSalesMap = actualSales.reduce((acc, row) => {
          acc[row.Month] = {
            2023: row["Actual Sales 2023 (₹ Cr)"]
              ? parseFloat(row["Actual Sales 2023 (₹ Cr)"])
              : null,
            2024: row["Actual Sales 2024 (₹ Cr)"]
              ? parseFloat(row["Actual Sales 2024 (₹ Cr)"])
              : null,
          };
          return acc;
        }, {});

        // Compute Correct Growth Rates
        const computedData = forecast.map((row) => {
          const prevYearSales = actualSalesMap[row.Month]?.[2024] || null;
          const twoYearOldSales = actualSalesMap[row.Month]?.[2023] || null;

          let projectionGrowthRate = 0;
          let actualGrowthRate = 0;

          if (prevYearSales) {
            projectionGrowthRate =
              ((row["Projected Sales (₹ Cr)"] - prevYearSales) /
                prevYearSales) *
              100;
          }

          if (twoYearOldSales && prevYearSales) {
            actualGrowthRate =
              ((prevYearSales - twoYearOldSales) / twoYearOldSales) * 100;
          }

          return {
            ...row,
            ProjectionGrowthRate: projectionGrowthRate,
            ActualGrowthRate: actualGrowthRate,
          };
        });

        setForecastData(computedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchForecast();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="flex items-center justify-center gap-4">
          <p className="text-lg font-semibold">Fetching Sales Forecast ...</p>
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 font-semibold">❌ {error}</div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">📊 Sales Forecast</h1>

          {/* ✅ Sales Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Sales Projection & Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastData}>
                  <XAxis dataKey="Month" />
                  <YAxis yAxisId="left" domain={[35, "auto"]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value.toFixed(2)}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* 🔵 Projected Sales */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Projected Sales (₹ Cr)"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />

                  {/* 🟢 Lower Estimate */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Lower Estimate (₹ Cr)"
                    stroke="#10B981"
                    strokeDasharray="5 5"
                  />

                  {/* 🔴 Upper Estimate */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Upper Estimate (₹ Cr)"
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                  />

                  {/* 📊 Growth Rate as Bar Chart */}
                  <BarChart data={forecastData}>
                    <Bar
                      yAxisId="right"
                      dataKey="ProjectionGrowthRate"
                      fill="#F59E0B"
                    />
                  </BarChart>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ✅ Forecast Table */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Detailed Forecast Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Month</TableHead>
                    <TableHead className="text-center">
                      Projected Sales (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Lower Estimate (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Upper Estimate (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Actual Growth Rate (%)
                    </TableHead>
                    <TableHead className="text-center">
                      Projection Growth Rate (%)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{row.Month}</TableCell>
                      <TableCell className="text-center">
                        {row["Projected Sales (₹ Cr)"].toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        {row["Lower Estimate (₹ Cr)"].toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        {row["Upper Estimate (₹ Cr)"].toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          row.ActualGrowthRate > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.ActualGrowthRate.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={`text-center ${
                          row.ProjectionGrowthRate > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.ProjectionGrowthRate.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
