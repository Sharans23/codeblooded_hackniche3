"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getStockData } from "@/lib/data";

export function StockLevelChart({ data, year, product }) {
  // Make sure data exists before trying to process it
  if (!data || !data[year]) {
    return <div>No data available for the selected year</div>;
  }

  const chartData = getStockData(data, year, product);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {product === "all" ? (
          <>
            <Area
              type="monotone"
              dataKey="laptop"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              name="Laptop Stock"
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="Mobile Stock"
            />
            <Area
              type="monotone"
              dataKey="tablet"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              name="Tablet Stock"
            />
          </>
        ) : (
          <Area
            type="monotone"
            dataKey={product}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            name={`${product.charAt(0).toUpperCase() + product.slice(1)} Stock`}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
