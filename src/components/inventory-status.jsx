"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function InventoryStatus({ data, year }) {
  // Check if data exists
  if (!data || !data[year]) {
    return <div>No data available for the selected year</div>;
  }

  // Get the most recent month with data
  const months = Object.keys(data[year]);
  if (months.length === 0) {
    return <div>No monthly data available</div>;
  }

  const latestMonth = months[months.length - 1];

  // Get the last week of the month
  const weeks = Object.keys(data[year][latestMonth]);
  if (weeks.length === 0) {
    return <div>No weekly data available</div>;
  }

  const latestWeek = weeks[weeks.length - 1];

  // Get the stock data
  if (
    !data[year][latestMonth][latestWeek] ||
    !data[year][latestMonth][latestWeek].remaining_stock
  ) {
    return <div>No stock data available</div>;
  }

  const stockData = data[year][latestMonth][latestWeek].remaining_stock;

  // Define stock status thresholds
  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "Out of Stock", color: "destructive" };
    if (stock < 20) return { status: "Low Stock", color: "warning" };
    if (stock < 50) return { status: "Medium Stock", color: "secondary" };
    return { status: "Good Stock", color: "success" };
  };

  // Calculate reorder recommendation
  const getReorderRecommendation = (stock, product) => {
    if (stock === 0) return "Immediate reorder required";
    if (stock < 20) return "Reorder soon";
    if (stock < 50) return "Monitor stock levels";
    return "Stock levels healthy";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Recommendation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Laptops</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span>{stockData.laptop}</span>
              <Progress value={stockData.laptop} max={100} className="w-20" />
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={getStockStatus(stockData.laptop).color}>
              {getStockStatus(stockData.laptop).status}
            </Badge>
          </TableCell>
          <TableCell>
            {getReorderRecommendation(stockData.laptop, "laptop")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Mobiles</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span>{stockData.mobile}</span>
              <Progress value={stockData.mobile} max={100} className="w-20" />
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={getStockStatus(stockData.mobile).color}>
              {getStockStatus(stockData.mobile).status}
            </Badge>
          </TableCell>
          <TableCell>
            {getReorderRecommendation(stockData.mobile, "mobile")}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Tablets</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <span>{stockData.tablet}</span>
              <Progress value={stockData.tablet} max={100} className="w-20" />
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={getStockStatus(stockData.tablet).color}>
              {getStockStatus(stockData.tablet).status}
            </Badge>
          </TableCell>
          <TableCell>
            {getReorderRecommendation(stockData.tablet, "tablet")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
