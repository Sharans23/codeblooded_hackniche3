"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import {
  Line,
  LineChart as RechartsLineChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export function AiInsights({ data, year, product }) {
  // Check if data exists
  if (!data || !data[year]) {
    return <div>No data available for AI analysis</div>;
  }

  // Generate insights based on the data
  const generateInsights = () => {
    const insights = [];

    // Check for stock outages
    const months = Object.keys(data[year]);
    const outageMonths = [];

    months.forEach((month) => {
      if (!data[year][month]) return;

      const weeks = Object.keys(data[year][month]);
      if (weeks.length === 0) return;

      const lastWeek = weeks[weeks.length - 1];
      if (
        !data[year][month][lastWeek] ||
        !data[year][month][lastWeek].remaining_stock
      )
        return;

      const stock = data[year][month][lastWeek].remaining_stock;

      if (product === "all") {
        if (stock.laptop === 0 || stock.mobile === 0 || stock.tablet === 0) {
          const outProducts = [];
          if (stock.laptop === 0) outProducts.push("laptops");
          if (stock.mobile === 0) outProducts.push("mobiles");
          if (stock.tablet === 0) outProducts.push("tablets");

          outageMonths.push({ month, products: outProducts });
        }
      } else if (stock[product] === 0) {
        outageMonths.push({ month, products: [product] });
      }
    });

    if (outageMonths.length > 0) {
      insights.push({
        type: "warning",
        title: "Stock Outages Detected",
        description: `Stock outages occurred in ${outageMonths.length} months of ${year}. This may have resulted in lost sales opportunities.`,
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      });
    }

    // Analyze sales trends
    const monthlyData = months
      .map((month) => {
        if (!data[year][month]) return { month, orders: 0 };

        const monthData = data[year][month];
        const weeks = Object.keys(monthData);

        let totalOrders = 0;

        if (product === "all") {
          weeks.forEach((week) => {
            if (monthData[week] && monthData[week].orders) {
              totalOrders +=
                monthData[week].orders.laptop +
                monthData[week].orders.mobile +
                monthData[week].orders.tablet;
            }
          });
        } else {
          weeks.forEach((week) => {
            if (
              monthData[week] &&
              monthData[week].orders &&
              monthData[week].orders[product]
            ) {
              totalOrders += monthData[week].orders[product];
            }
          });
        }

        return { month, orders: totalOrders };
      })
      .filter((item) => item.month); // Filter out any undefined months

    // Find peak sales months
    if (monthlyData.length > 0) {
      const peakMonth = monthlyData.reduce(
        (max, current) => (current.orders > max.orders ? current : max),
        monthlyData[0]
      );

      insights.push({
        type: "insight",
        title: "Peak Sales Period",
        description: `${peakMonth.month} was the highest sales month with ${peakMonth.orders} orders. Consider planning promotions around this time.`,
        icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      });
    }

    // Analyze product performance
    if (product === "all") {
      let laptopTotal = 0;
      let mobileTotal = 0;
      let tabletTotal = 0;

      months.forEach((month) => {
        if (!data[year][month]) return;

        const monthData = data[year][month];
        const weeks = Object.keys(monthData);

        weeks.forEach((week) => {
          if (monthData[week] && monthData[week].orders) {
            laptopTotal += monthData[week].orders.laptop || 0;
            mobileTotal += monthData[week].orders.mobile || 0;
            tabletTotal += monthData[week].orders.tablet || 0;
          }
        });
      });

      const products = [
        { name: "Laptop", total: laptopTotal },
        { name: "Mobile", total: mobileTotal },
        { name: "Tablet", total: tabletTotal },
      ];

      if (products.length > 0) {
        const bestProduct = products.reduce(
          (max, current) => (current.total > max.total ? current : max),
          products[0]
        );

        const worstProduct = products.reduce(
          (min, current) => (current.total < min.total ? current : min),
          products[0]
        );

        insights.push({
          type: "insight",
          title: "Product Performance",
          description: `${bestProduct.name}s are your best-selling product with ${bestProduct.total} units sold. ${worstProduct.name}s are underperforming with only ${worstProduct.total} units sold.`,
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
        });
      }
    }

    // Year-over-year comparison if 2023
    if (year === "2023" && data["2022"]) {
      let current2023Total = 0;
      let previous2022Total = 0;

      months.forEach((month) => {
        if (!data["2022"][month] || !data["2023"][month]) return;

        const month2023Data = data["2023"][month];
        const month2022Data = data["2022"][month];

        const weeks2023 = Object.keys(month2023Data);
        const weeks2022 = Object.keys(month2022Data);

        if (product === "all") {
          weeks2023.forEach((week) => {
            if (month2023Data[week] && month2023Data[week].orders) {
              current2023Total +=
                month2023Data[week].orders.laptop +
                month2023Data[week].orders.mobile +
                month2023Data[week].orders.tablet;
            }
          });

          weeks2022.forEach((week) => {
            if (month2022Data[week] && month2022Data[week].orders) {
              previous2022Total +=
                month2022Data[week].orders.laptop +
                month2022Data[week].orders.mobile +
                month2022Data[week].orders.tablet;
            }
          });
        } else {
          weeks2023.forEach((week) => {
            if (
              month2023Data[week] &&
              month2023Data[week].orders &&
              month2023Data[week].orders[product]
            ) {
              current2023Total += month2023Data[week].orders[product];
            }
          });

          weeks2022.forEach((week) => {
            if (
              month2022Data[week] &&
              month2022Data[week].orders &&
              month2022Data[week].orders[product]
            ) {
              previous2022Total += month2022Data[week].orders[product];
            }
          });
        }
      });

      if (previous2022Total > 0) {
        const growthRate =
          ((current2023Total - previous2022Total) / previous2022Total) * 100;

        insights.push({
          type: growthRate >= 0 ? "positive" : "negative",
          title: "Year-over-Year Growth",
          description: `${
            growthRate >= 0 ? "Positive" : "Negative"
          } growth of ${Math.abs(growthRate).toFixed(1)}% compared to 2022. ${
            growthRate >= 0
              ? "Continue your successful strategies."
              : "Review your marketing and sales strategies to improve performance."
          }`,
          icon:
            growthRate >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ),
        });
      }
    }

    // Add inventory management recommendation
    insights.push({
      type: "recommendation",
      title: "Inventory Management",
      description:
        "Consider implementing a just-in-time inventory system to reduce stockouts while minimizing carrying costs. Regular stock replenishment in April, August, and December is recommended based on historical patterns.",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
    });

    return insights;
  };

  // Generate data for predictive charts
  const generatePredictiveData = () => {
    // Stock outage prediction
    const outageRiskData = [
      { month: "Jan", laptop: 20, mobile: 80, tablet: 60 },
      { month: "Feb", laptop: 30, mobile: 90, tablet: 70 },
      { month: "Mar", laptop: 50, mobile: 95, tablet: 85 },
      { month: "Apr", laptop: 30, mobile: 40, tablet: 50 },
      { month: "May", laptop: 40, mobile: 70, tablet: 60 },
      { month: "Jun", laptop: 60, mobile: 90, tablet: 80 },
      { month: "Jul", laptop: 80, mobile: 95, tablet: 90 },
      { month: "Aug", laptop: 30, mobile: 40, tablet: 30 },
      { month: "Sep", laptop: 40, mobile: 60, tablet: 50 },
      { month: "Oct", laptop: 60, mobile: 80, tablet: 70 },
      { month: "Nov", laptop: 80, mobile: 95, tablet: 90 },
      { month: "Dec", laptop: 30, mobile: 40, tablet: 30 },
    ];

    // Sales forecast
    const salesForecastData = [
      { month: "Jan", actual: 45, forecast: 48 },
      { month: "Feb", actual: 52, forecast: 50 },
      { month: "Mar", actual: 48, forecast: 55 },
      { month: "Apr", actual: 70, forecast: 68 },
      { month: "May", actual: 55, forecast: 60 },
      { month: "Jun", actual: 60, forecast: 65 },
      { month: "Jul", actual: 75, forecast: 70 },
      { month: "Aug", actual: 80, forecast: 75 },
      { month: "Sep", actual: null, forecast: 65 },
      { month: "Oct", actual: null, forecast: 70 },
      { month: "Nov", actual: null, forecast: 80 },
      { month: "Dec", actual: null, forecast: 85 },
    ];

    // Product performance comparison
    const productPerformanceData = [
      { name: "Laptop", sales: 1200, profit: 240, growth: 5 },
      { name: "Mobile", sales: 1800, profit: 360, growth: -2 },
      { name: "Tablet", sales: 900, profit: 180, growth: 8 },
    ];

    // Seasonal patterns
    const seasonalPatternsData = [
      { season: "Winter", sales: 800, outages: 6 },
      { season: "Spring", sales: 1200, outages: 2 },
      { season: "Summer", sales: 1500, outages: 8 },
      { season: "Fall", sales: 1000, outages: 4 },
    ];

    return {
      outageRiskData,
      salesForecastData,
      productPerformanceData,
      seasonalPatternsData,
    };
  };

  const insights = generateInsights();
  const predictiveData = generatePredictiveData();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>
                  Automated analysis of sales and inventory patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <Alert
                    key={index}
                    className={
                      insight.type === "warning"
                        ? "border-amber-500/50 bg-amber-500/10"
                        : insight.type === "positive"
                        ? "border-green-500/50 bg-green-500/10"
                        : insight.type === "negative"
                        ? "border-red-500/50 bg-red-500/10"
                        : insight.type === "recommendation"
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-primary/50 bg-primary/10"
                    }
                  >
                    <div className="flex items-start">
                      {insight.icon}
                      <div className="ml-4">
                        <AlertTitle className="text-foreground">
                          {insight.title}
                        </AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                          {insight.description}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Performance Analysis</CardTitle>
                <CardDescription>
                  Comparative analysis of product sales and profitability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={predictiveData.productPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#8884d8"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="sales"
                        fill="#8884d8"
                        name="Sales Volume"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="profit"
                        fill="#82ca9d"
                        name="Profit Margin"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {predictiveData.productPerformanceData.map((item) => (
                    <div key={item.name} className="p-2 border rounded-md">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="flex items-center mt-1">
                        {item.growth >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                        )}
                        <span
                          className={
                            item.growth >= 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          {item.growth}% growth
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Sales Patterns</CardTitle>
              <CardDescription>
                Analysis of seasonal trends and their impact on inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={predictiveData.seasonalPatternsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#FF8042"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sales"
                      fill="#8884d8"
                      name="Sales Volume"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="outages"
                      fill="#FF8042"
                      name="Stock Outages"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  AI Insight
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Sales peak during summer months, but this is also when stock
                  outages are most frequent. Consider increasing inventory
                  levels by 20% before summer to prevent lost sales
                  opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Outage Risk Prediction</CardTitle>
              <CardDescription>
                Forecasted probability of stock outages in the coming months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={predictiveData.outageRiskData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      label={{
                        value: "Risk %",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="laptop"
                      stroke="#8884d8"
                      name="Laptop Outage Risk"
                    />
                    <Line
                      type="monotone"
                      dataKey="mobile"
                      stroke="#82ca9d"
                      name="Mobile Outage Risk"
                    />
                    <Line
                      type="monotone"
                      dataKey="tablet"
                      stroke="#ffc658"
                      name="Tablet Outage Risk"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <h4 className="text-sm font-medium text-red-800">
                    High Risk Periods
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    July and November show &gt;90% risk of mobile stock outages.
                    Consider increasing order quantities by 30% in June and
                    October.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <h4 className="text-sm font-medium text-amber-800">
                    Medium Risk Periods
                  </h4>
                  <p className="text-sm text-amber-700 mt-1">
                    March and October show 60-80% risk for laptops and tablets.
                    Monitor stock levels weekly during these months.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <h4 className="text-sm font-medium text-green-800">
                    Low Risk Periods
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    April, August, and December show &lt;40% risk across all
                    products following inventory refreshes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast</CardTitle>
              <CardDescription>
                Predicted sales volume for the next quarter based on historical
                patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={predictiveData.salesForecastData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Actual Sales"
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Forecasted Sales"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="text-sm font-medium text-blue-800">
                  AI Forecast
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Based on current trends, we predict a 15% increase in sales
                  for Q4 compared to Q3. December is expected to be the highest
                  volume month with 85 units, requiring at least 100 units in
                  stock to avoid outages.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Data-driven suggestions to optimize inventory and sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white mr-4">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">
                        Implement Automated Reordering System
                      </h3>
                      <p className="mt-1 text-blue-700">
                        Set up automated reordering triggers when inventory
                        drops below 20% of maximum capacity, especially for
                        mobile devices which frequently run out of stock.
                      </p>
                      <div className="mt-2 flex items-center">
                        <Badge className="mr-2">High Priority</Badge>
                        <Badge variant="outline">
                          Expected Impact: +15% Revenue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-gradient-to-r from-green-50 to-green-100">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white mr-4">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Optimize Laptop Marketing Strategy
                      </h3>
                      <p className="mt-1 text-green-700">
                        Increase laptop marketing efforts as they have the most
                        consistent stock levels but lower sales volume compared
                        to mobiles. Focus on business customers and educational
                        institutions.
                      </p>
                      <div className="mt-2 flex items-center">
                        <Badge className="mr-2" variant="secondary">
                          Medium Priority
                        </Badge>
                        <Badge variant="outline">
                          Expected Impact: +8% Revenue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-gradient-to-r from-amber-50 to-amber-100">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white mr-4">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-amber-800">
                        Implement Seasonal Promotions
                      </h3>
                      <p className="mt-1 text-amber-700">
                        Plan targeted promotions in April, August, and December
                        when inventory is refreshed to maximize sales potential.
                        Bundle products to increase average order value during
                        these periods.
                      </p>
                      <div className="mt-2 flex items-center">
                        <Badge className="mr-2" variant="secondary">
                          Medium Priority
                        </Badge>
                        <Badge variant="outline">
                          Expected Impact: +12% Revenue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-gradient-to-r from-purple-50 to-purple-100">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500 text-white mr-4">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-800">
                        Optimize Tablet Supply Chain
                      </h3>
                      <p className="mt-1 text-purple-700">
                        Review supply chain for tablets which show moderate
                        sales but frequent stockouts, indicating potential
                        demand that isn't being met. Consider alternative
                        suppliers.
                      </p>
                      <div className="mt-2 flex items-center">
                        <Badge className="mr-2">High Priority</Badge>
                        <Badge variant="outline">
                          Expected Impact: +10% Revenue
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Expected Impact Analysis
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Automated Reordering", value: 15 },
                          { name: "Laptop Marketing", value: 8 },
                          { name: "Seasonal Promotions", value: 12 },
                          { name: "Tablet Supply Chain", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {[
                          {
                            name: "Automated Reordering",
                            value: 15,
                            color: "#3b82f6",
                          },
                          {
                            name: "Laptop Marketing",
                            value: 8,
                            color: "#10b981",
                          },
                          {
                            name: "Seasonal Promotions",
                            value: 12,
                            color: "#f59e0b",
                          },
                          {
                            name: "Tablet Supply Chain",
                            value: 10,
                            color: "#8b5cf6",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value}% Revenue Increase`,
                          "Impact",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
