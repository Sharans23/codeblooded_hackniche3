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
import { getMonthlyData } from "@/lib/data";

export function MonthlyOrdersChart({ data, year, product }) {
  // Make sure data exists before trying to process it
  if (!data || !data[year]) {
    return <div>No data available for the selected year</div>;
  }

  const chartData = getMonthlyData(data, year, product);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="hsl(var(--primary))" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
}
