"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react";

// Import the client data
import { clientData } from "@/lib/data";
import { InventoryStatus } from "@/components/inventory-status";
import { MonthlyOrdersChart } from "@/components/monthly-orders-chart";
import { StockLevelChart } from "@/components/stock-level-chart";
import { AiInsights } from "@/components/ai-insights";
import { ProductPerformance } from "@/components/product-performance";
import { YearlyComparison } from "@/components/yearly-comparison";
import { StockOutageTimeline } from "@/components/stock-outage-timeline";

export default function Analysis() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [showOutageDetails, setShowOutageDetails] = useState(false);

  // Calculate total orders for the selected year
  const calculateTotalOrders = (
    year = selectedYear,
    product = selectedProduct
  ) => {
    let total = 0;
    const yearData = clientData.client1[year];

    Object.keys(yearData).forEach((month) => {
      Object.keys(yearData[month]).forEach((week) => {
        if (product === "all") {
          total +=
            yearData[month][week].orders.laptop +
            yearData[month][week].orders.mobile +
            yearData[month][week].orders.tablet;
        } else {
          total += yearData[month][week].orders[product];
        }
      });
    });

    return total;
  };

  // Calculate year-over-year growth
  const calculateYoYGrowth = () => {
    if (selectedYear === "2022") return null;

    const currentYearTotal = calculateTotalOrders(
      selectedYear,
      selectedProduct
    );
    const previousYearTotal = calculateTotalOrders("2022", selectedProduct);

    return ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
  };

  const totalOrders = calculateTotalOrders();
  const yoyGrowth = calculateYoYGrowth();

  // Find months with stock outages
  const findStockOutages = () => {
    const outages = [];
    const yearData = clientData.client1[selectedYear];

    Object.keys(yearData).forEach((month) => {
      const lastWeek = Object.keys(yearData[month]).pop();
      const stock = yearData[month][lastWeek].remaining_stock;

      if (selectedProduct === "all") {
        if (stock.laptop === 0 || stock.mobile === 0 || stock.tablet === 0) {
          outages.push({
            month,
            products: Object.entries(stock)
              .filter(([_, value]) => value === 0)
              .map(([key]) => key),
          });
        }
      } else if (stock[selectedProduct] === 0) {
        outages.push({ month, products: [selectedProduct] });
      }
    });

    return outages;
  };

  const stockOutages = findStockOutages();

  // Fix the outagesByProduct function to ensure it always returns valid data
  // Group outages by product
  const outagesByProduct = () => {
    const result = { laptop: [], mobile: [], tablet: [] };

    if (!stockOutages || stockOutages.length === 0) {
      return result;
    }

    stockOutages.forEach((outage) => {
      if (outage && outage.products) {
        outage.products.forEach((product) => {
          if (product && result[product]) {
            result[product].push(outage.month);
          }
        });
      }
    });

    return result;
  };

  const groupedOutages = outagesByProduct();

  // Calculate outage statistics
  const outageStats = {
    total: stockOutages.length,
    byProduct: {
      laptop: groupedOutages.laptop ? groupedOutages.laptop.length : 0,
      mobile: groupedOutages.mobile ? groupedOutages.mobile.length : 0,
      tablet: groupedOutages.tablet ? groupedOutages.tablet.length : 0,
    },
    mostAffected:
      Object.entries(groupedOutages)
        .filter(([_, months]) => months && months.length > 0)
        .sort((a, b) => b[1].length - a[1].length).length > 0
        ? Object.entries(groupedOutages)
            .filter(([_, months]) => months && months.length > 0)
            .sort((a, b) => b[1].length - a[1].length)[0][0]
        : "none",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 py-4">
          <h1 className="text-2xl font-bold">Client Sales Dashboard</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
                <SelectItem value="mobile">Mobiles</SelectItem>
                <SelectItem value="tablet">Tablets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              {yoyGrowth !== null && (
                <p className="flex items-center text-xs text-muted-foreground">
                  {yoyGrowth >= 0 ? (
                    <>
                      <ArrowUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-green-500">
                        {yoyGrowth.toFixed(1)}% from 2022
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4 mr-1 text-red-500" />
                      <span className="text-red-500">
                        {Math.abs(yoyGrowth).toFixed(1)}% from 2022
                      </span>
                    </>
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Laptop Orders
              </CardTitle>
              <Laptop className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProduct === "all" || selectedProduct === "laptop"
                  ? clientData.client1[selectedYear].January.week1.orders
                      .laptop * 48 // Approximation for demo
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProduct === "laptop" ? "33% of total orders" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Mobile Orders
              </CardTitle>
              <Smartphone className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProduct === "all" || selectedProduct === "mobile"
                  ? clientData.client1[selectedYear].January.week1.orders
                      .mobile * 48 // Approximation for demo
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProduct === "mobile" ? "45% of total orders" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tablet Orders
              </CardTitle>
              <Tablet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProduct === "all" || selectedProduct === "tablet"
                  ? clientData.client1[selectedYear].January.week1.orders
                      .tablet * 48 // Approximation for demo
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProduct === "tablet" ? "22% of total orders" : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {stockOutages.length > 0 && (
          <Card className="mt-6 border-red-600/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  <CardTitle>Stock Outages Detected</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOutageDetails(!showOutageDetails)}
                >
                  {showOutageDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>
              <CardDescription className="mt-2">
                {stockOutages.length} outages detected in {selectedYear}. Most
                affected product:{" "}
                <span className="font-medium">{outageStats.mostAffected}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Laptop className="w-8 h-8 mb-2 text-blue-500" />
                  <span className="text-sm font-medium">Laptops</span>
                  <span className="text-2xl font-bold">
                    {outageStats.byProduct.laptop}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    months with outages
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Smartphone className="w-8 h-8 mb-2 text-green-500" />
                  <span className="text-sm font-medium">Mobiles</span>
                  <span className="text-2xl font-bold">
                    {outageStats.byProduct.mobile}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    months with outages
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Tablet className="w-8 h-8 mb-2 text-amber-500" />
                  <span className="text-sm font-medium">Tablets</span>
                  <span className="text-2xl font-bold">
                    {outageStats.byProduct.tablet}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    months with outages
                  </span>
                </div>
              </div>

              {showOutageDetails && stockOutages.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium">Outage Timeline</h4>
                  <StockOutageTimeline
                    outages={stockOutages}
                    year={selectedYear}
                  />

                  <h4 className="mt-4 mb-2 text-sm font-medium">
                    Detailed Outage Report
                  </h4>
                  <div className="p-3 border rounded-md">
                    <div className="grid gap-2 md:grid-cols-3">
                      {Object.entries(groupedOutages).map(([product, months]) =>
                        months && months.length > 0 ? (
                          <div key={product} className="space-y-1">
                            <h5 className="text-sm font-medium capitalize">
                              {product}
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {months.map((month) => (
                                <Badge
                                  key={`${product}-${month}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {month}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="orders" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Monthly Orders</TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders Trend</CardTitle>
                <CardDescription>
                  Order volume by month for {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <MonthlyOrdersChart
                  data={clientData.client1}
                  year={selectedYear}
                  product={selectedProduct}
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    Distribution of orders by product type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductPerformance
                    data={clientData.client1}
                    year={selectedYear}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Year-over-Year Comparison</CardTitle>
                  <CardDescription>2022 vs 2023 monthly orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <YearlyComparison
                    data={clientData.client1}
                    product={selectedProduct}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Level Trends</CardTitle>
                <CardDescription>
                  Remaining inventory by month for {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <StockLevelChart
                  data={clientData.client1}
                  year={selectedYear}
                  product={selectedProduct}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>
                  Current stock levels and reorder recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryStatus
                  data={clientData.client1}
                  year={selectedYear}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <AiInsights
              data={clientData.client1}
              year={selectedYear}
              product={selectedProduct}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
