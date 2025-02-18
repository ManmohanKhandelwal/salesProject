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
        const response = await fetch("http://localhost:8000/forecast");
        if (!response.ok) throw new Error("Failed to fetch forecast data");
        const data = await response.json();
        setForecastData(data);
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
          {/* ✅ Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Sales Projection (₹ Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <XAxis
                    dataKey="Month"
                    tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    domain={[45, "auto"]}
                    tick={{ fill: "var(--color-tick)", fontWeight: "bold" }}
                  />{" "}
                  {/* ✅ Start axis from 35 Cr */}
                  <Tooltip />
                  <Legend />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="Projected Sales (₹ Cr)"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Lower Estimate (₹ Cr)"
                    stroke="#10B981"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="Upper Estimate (₹ Cr)"
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                  />
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
