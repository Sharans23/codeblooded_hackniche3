"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getProductDistribution } from "@/lib/data";

export function ProductPerformance({ data, year }) {
  // Make sure data exists before trying to process it
  if (!data || !data[year]) {
    return <div>No data available for the selected year</div>;
  }

  const chartData = getProductDistribution(data, year);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} orders`, "Volume"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
