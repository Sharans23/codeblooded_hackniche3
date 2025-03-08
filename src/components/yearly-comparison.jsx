"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getYearlyComparison } from "@/lib/data";

export function YearlyComparison({ data, product }) {
  // Make sure data exists before trying to process it
  if (!data || !data["2022"] || !data["2023"]) {
    return <div>No data available for comparison</div>;
  }

  const chartData = getYearlyComparison(data, product);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="2022" fill="#8884d8" name="2022" />
        <Bar dataKey="2023" fill="#82ca9d" name="2023" />
      </BarChart>
    </ResponsiveContainer>
  );
}
