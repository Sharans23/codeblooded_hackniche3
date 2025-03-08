"use client";

import { useState } from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryAnalytics() {
  const [timeRange, setTimeRange] = useState("year");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // FIFO vs LIFO Value Comparison
  const valueComparisonData = {
    labels: months,
    datasets: [
      {
        label: "FIFO Inventory Value",
        data: [
          25000, 27500, 30000, 32500, 35000, 37500, 40000, 42500, 45000, 47500,
          50000, 52500,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "LIFO Inventory Value",
        data: [
          25000, 26000, 27000, 29000, 30500, 32000, 34000, 35500, 37000, 39000,
          41000, 43000,
        ],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Inventory by Category
  const inventoryByCategoryData = {
    labels: [
      "Electronics",
      "Furniture",
      "Accessories",
      "Office Supplies",
      "Storage",
    ],
    datasets: [
      {
        label: "Inventory Value",
        data: [58000, 12000, 8000, 5000, 3000],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Monthly Inventory Turnover
  const inventoryTurnoverData = {
    labels: months,
    datasets: [
      {
        label: "Inventory Turnover Rate",
        data: [2.1, 2.3, 2.0, 2.5, 2.7, 2.4, 2.2, 2.6, 2.8, 2.5, 2.3, 2.4],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value Comparison</CardTitle>
            <CardDescription>
              FIFO vs LIFO inventory valuation over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line options={options} data={valueComparisonData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>
              Distribution of inventory value across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Pie options={pieOptions} data={inventoryByCategoryData} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="turnover" className="space-y-4">
        <TabsList>
          <TabsTrigger value="turnover">
            <BarChart className="mr-2 h-4 w-4" />
            Inventory Turnover
          </TabsTrigger>
          <TabsTrigger value="cost-impact">
            <LineChart className="mr-2 h-4 w-4" />
            Cost Impact Analysis
          </TabsTrigger>
          <TabsTrigger value="product-performance">
            <PieChart className="mr-2 h-4 w-4" />
            Product Performance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="turnover">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Inventory Turnover</CardTitle>
              <CardDescription>
                How quickly inventory is sold and replaced over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar options={options} data={inventoryTurnoverData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cost-impact">
          <Card>
            <CardHeader>
              <CardTitle>Cost Impact Analysis</CardTitle>
              <CardDescription>
                How inventory valuation methods affect financial metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">FIFO Method</h3>
                    <ul className="text-sm space-y-1">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ending Inventory:
                        </span>
                        <span className="font-medium">$52,450.00</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">COGS:</span>
                        <span className="font-medium">$112,781.89</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gross Profit:
                        </span>
                        <span className="font-medium">$64,350.45</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tax Impact:
                        </span>
                        <span className="font-medium text-green-600">
                          -$12,145.00
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">LIFO Method</h3>
                    <ul className="text-sm space-y-1">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ending Inventory:
                        </span>
                        <span className="font-medium">$43,875.00</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">COGS:</span>
                        <span className="font-medium">$121,356.89</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gross Profit:
                        </span>
                        <span className="font-medium">$55,775.45</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tax Impact:
                        </span>
                        <span className="font-medium text-amber-600">
                          +$8,890.00
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">
                    Financial Impact Analysis:
                  </h3>
                  <p className="text-sm">
                    Using LIFO during periods of inflation results in a tax
                    savings of approximately $21,035.00 compared to FIFO.
                    However, FIFO provides a more accurate representation of
                    current inventory value on the balance sheet. The choice
                    between methods should consider both tax implications and
                    financial reporting objectives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="product-performance">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analysis</CardTitle>
              <CardDescription>
                Inventory turnover and profitability by product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-right">Turnover Rate</th>
                      <th className="p-3 text-right">Avg. Days in Stock</th>
                      <th className="p-3 text-right">Profit Margin</th>
                      <th className="p-3 text-right">FIFO Impact</th>
                      <th className="p-3 text-right">LIFO Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Premium Laptop</td>
                      <td className="p-3 text-right">3.2</td>
                      <td className="p-3 text-right">114</td>
                      <td className="p-3 text-right">32%</td>
                      <td className="p-3 text-right text-green-600">+$5,200</td>
                      <td className="p-3 text-right text-amber-600">-$3,800</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Wireless Headphones</td>
                      <td className="p-3 text-right">5.8</td>
                      <td className="p-3 text-right">63</td>
                      <td className="p-3 text-right">45%</td>
                      <td className="p-3 text-right text-green-600">+$2,100</td>
                      <td className="p-3 text-right text-amber-600">-$1,500</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Office Desk Chair</td>
                      <td className="p-3 text-right">2.1</td>
                      <td className="p-3 text-right">174</td>
                      <td className="p-3 text-right">28%</td>
                      <td className="p-3 text-right text-green-600">+$1,800</td>
                      <td className="p-3 text-right text-amber-600">-$1,200</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Smartphone Case</td>
                      <td className="p-3 text-right">8.4</td>
                      <td className="p-3 text-right">43</td>
                      <td className="p-3 text-right">60%</td>
                      <td className="p-3 text-right text-green-600">+$950</td>
                      <td className="p-3 text-right text-amber-600">-$750</td>
                    </tr>
                    <tr>
                      <td className="p-3">LED Monitor</td>
                      <td className="p-3 text-right">3.5</td>
                      <td className="p-3 text-right">104</td>
                      <td className="p-3 text-right">35%</td>
                      <td className="p-3 text-right text-green-600">+$2,800</td>
                      <td className="p-3 text-right text-amber-600">-$2,100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
