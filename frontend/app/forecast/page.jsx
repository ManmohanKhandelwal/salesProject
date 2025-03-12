"use client";

import { useEffect, useState } from "react";
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
import { backEndURL } from "@/lib/utils";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  const salesYearMinus1 = currentYear - 1; // Previous Year
  const salesYearMinus2 = currentYear - 2; // Two Years Ago
  const forecastYear = currentYear; // Forecast Year

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Actual Sales Data
        const actualSalesResponse = await fetch(
          backEndURL("/forecast/actual-sales")
        );
        const actualSales = await actualSalesResponse.json();

        // Fetch Forecast Data
        const forecastResponse = await fetch(backEndURL("/forecast"));
        const forecast = await forecastResponse.json();

        if (!Array.isArray(actualSales) || !Array.isArray(forecast)) {
          throw new Error("Invalid data format from backend");
        }

        // Map actual sales for quick lookup
        const actualSalesMap = actualSales.reduce((acc, row) => {
          const monthOnly = row.Month.trim();
          acc[monthOnly] = {
            [salesYearMinus2]:
              parseFloat(row[`Actual Sales ${salesYearMinus2} (₹ Cr)`]) || 0,
            [salesYearMinus1]:
              parseFloat(row[`Actual Sales ${salesYearMinus1} (₹ Cr)`]) || 0,
          };
          return acc;
        }, {});

        // Combine actual and forecasted data
        const combinedData = forecast.map((row) => {
          const monthOnly = row.Month.split(" ")[0]; // e.g., "Jul"
          const actualSalesMinus2 =
            actualSalesMap[monthOnly]?.[salesYearMinus2] || 0;
          const actualSalesMinus1 =
            actualSalesMap[monthOnly]?.[salesYearMinus1] || 0;
          const projectedSales = parseFloat(row[`Projected Sales (₹ Cr)`]) || 0;
          const lowerEstimate = parseFloat(row["Lower Estimate (₹ Cr)"]) || 0;
          const upperEstimate = parseFloat(row["Upper Estimate (₹ Cr)"]) || 0;

          // Calculate growth rates
          const actualGrowthRate =
            actualSalesMinus2 > 0
              ? ((actualSalesMinus1 - actualSalesMinus2) / actualSalesMinus2) *
                100
              : 0;
          const projectionGrowthRate =
            actualSalesMinus1 > 0
              ? ((projectedSales - actualSalesMinus1) / actualSalesMinus1) * 100
              : 0;

          return {
            Month: row.Month,
            [`Actual Sales (${salesYearMinus2} - ₹ Cr)`]:
              actualSalesMinus2.toFixed(2),
            [`Actual Sales (${salesYearMinus1} - ₹ Cr)`]:
              actualSalesMinus1.toFixed(2),
            "Actual Growth Rate (%)": actualGrowthRate.toFixed(2),
            [`Projected Sales (${forecastYear} - ₹ Cr)`]:
              projectedSales.toFixed(2),
            "Lower Estimate (₹ Cr)": lowerEstimate.toFixed(2),
            "Upper Estimate (₹ Cr)": upperEstimate.toFixed(2),
            "Projection Growth Rate (%)": projectionGrowthRate.toFixed(2),
          };
        });

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

          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Sales Forecast Over Months</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" padding={{ left: 20, right: 20 }} />
                  <YAxis domain={["auto", "auto"]} />

                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={`Projected Sales (${forecastYear} - ₹ Cr)`}
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lower Estimate (₹ Cr)"
                    stroke="#8884d8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="Upper Estimate (₹ Cr)"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Forecast Table */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Detailed Forecast Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Month</TableHead>
                    <TableHead className="text-center">{`Actual Sales (${salesYearMinus2} - ₹ Cr)`}</TableHead>
                    <TableHead className="text-center">{`Actual Sales (${salesYearMinus1} - ₹ Cr)`}</TableHead>
                    <TableHead className="text-center">
                      Actual Growth Rate (%)
                    </TableHead>
                    <TableHead className="text-center">{`Projected Sales (${forecastYear} - ₹ Cr)`}</TableHead>
                    <TableHead className="text-center">
                      Lower Estimate (₹ Cr)
                    </TableHead>
                    <TableHead className="text-center">
                      Upper Estimate (₹ Cr)
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
                        {row[`Actual Sales (${salesYearMinus2} - ₹ Cr)`]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row[`Actual Sales (${salesYearMinus1} - ₹ Cr)`]}
                      </TableCell>
                      <TableCell
                        className={`text-center font-semibold ${
                          parseFloat(row["Actual Growth Rate (%)"]) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {row["Actual Growth Rate (%)"]}%
                      </TableCell>
                      <TableCell className="text-center">
                        {row[`Projected Sales (${forecastYear} - ₹ Cr)`]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Lower Estimate (₹ Cr)"]}
                      </TableCell>
                      <TableCell className="text-center">
                        {row["Upper Estimate (₹ Cr)"]}
                      </TableCell>
                      <TableCell className="text-center text-blue-600">
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
