"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [actualSalesData, setActualSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Actual Sales
        const actualSalesResponse = await fetch(
          "http://localhost:5000/forecast/actual-sales"
        );
        const actualSales = await actualSalesResponse.json();
        console.log("🔵 Actual Sales API Response:", actualSales);

        // Fetch Forecast Data
        const forecastResponse = await fetch("http://localhost:5000/forecast");
        const forecast = await forecastResponse.json();
        console.log("🟢 Forecast API Response:", forecast);

        if (!Array.isArray(actualSales) || !Array.isArray(forecast)) {
          throw new Error("Invalid data format from backend");
        }

        setActualSalesData(actualSales); // Store actual sales separately

        // Map actual sales for lookup
        const actualSalesMap = actualSales.reduce((acc, row) => {
          const monthOnly = row.Month.trim(); // Ensure correct mapping
          acc[monthOnly] = {
            2023: parseFloat(row["Actual Sales 2023 (₹ Cr)"]) || 0,
            2024: parseFloat(row["Actual Sales 2024 (₹ Cr)"]) || 0,
          };
          return acc;
        }, {});

        console.log("🗺️ Mapped Actual Sales Data:", actualSalesMap);

        // Combine actual and forecasted data
        const combinedData = forecast.map((row) => {
          // Extract only the month name from "Jul 2025" → "Jul"
          const monthOnly = row.Month.split(" ")[0];

          const actual2023 = actualSalesMap[monthOnly]?.[2023] || 0;
          const actual2024 = actualSalesMap[monthOnly]?.[2024] || 0;
          const projected2025 = parseFloat(row["Projected Sales (₹ Cr)"]) || 0;

          console.log(
            `🔍 Month: ${row.Month}, Extracted Month: ${monthOnly}, Actual 2023: ${actual2023}, Actual 2024: ${actual2024}, Projected 2025: ${projected2025}`
          );

          // Fix Growth Rate Calculation
          const actualGrowthRate =
            actual2023 > 0 ? ((actual2024 - actual2023) / actual2023) * 100 : 0;
          const projectionGrowthRate =
            actual2024 > 0
              ? ((projected2025 - actual2024) / actual2024) * 100
              : 0;

          return {
            Month: row.Month,
            "Actual Sales 2023 (₹ Cr)": actual2023.toFixed(2),
            "Actual Sales 2024 (₹ Cr)": actual2024.toFixed(2),
            "Projected Sales (₹ Cr)": projected2025.toFixed(2),
            "Lower Estimate (₹ Cr)": parseFloat(
              row["Lower Estimate (₹ Cr)"]
            ).toFixed(2),
            "Upper Estimate (₹ Cr)": parseFloat(
              row["Upper Estimate (₹ Cr)"]
            ).toFixed(2),
            "Actual Growth Rate (%)": actualGrowthRate.toFixed(2),
            "Projection Growth Rate (%)": projectionGrowthRate.toFixed(2),
          };
        });

        console.log("✅ Final Combined Data:", combinedData);
        setForecastData(combinedData);
      } catch (err) {
        console.error("❌ Error fetching sales data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
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
                  <YAxis yAxisId="left" domain={["auto", "auto"]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value.toFixed(2)}%`}
                  />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* 🔵 Actual Sales 2024 */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Actual Sales 2024 (₹ Cr)"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />

                  {/* 🟢 Projected Sales 2025 */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Projected Sales (₹ Cr)"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />

                  {/* 🔴 Upper Estimate */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Upper Estimate (₹ Cr)"
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                  />

                  {/* 🟢 Lower Estimate */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="Lower Estimate (₹ Cr)"
                    stroke="#10B981"
                    strokeDasharray="5 5"
                  />

                  {/* 📊 Growth Rate as Bar Chart */}
                  <BarChart data={forecastData}>
                    <Bar
                      yAxisId="right"
                      dataKey="Projection Growth Rate (%)"
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
                      Actual Sales 2023 (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Actual Sales 2024 (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Projected Sales 2025 (₹ Cr)
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
                        {row["Actual Sales 2023 (₹ Cr)"]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Actual Sales 2024 (₹ Cr)"]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Projected Sales (₹ Cr)"]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Actual Growth Rate (%)"]}%
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Projection Growth Rate (%)"]}%
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
