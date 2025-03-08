"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Client Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Place New Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products Available
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +56 new since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Returns
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Processing 2 returns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Order Forecast
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              Projected increase next month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Your order volume over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={orderHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#4f46e5"
                  activeDot={{ r: 8 }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  name="AI Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your most recent purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div
                    className={`mr-4 flex h-8 w-8 items-center justify-center rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 dark:bg-green-900"
                        : order.status === "processing"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-amber-100 dark:bg-amber-900"
                    }`}
                  >
                    {order.status === "delivered" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {order.status === "processing" && (
                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    {order.status === "pending" && (
                      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Order #{order.number}
                      <Badge variant="outline" className="ml-2">
                        {order.items} items
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.date} • ${order.amount}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>AI Stock Recommendations</CardTitle>
            <CardDescription>Based on your order history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockRecommendations.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <Box className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <Badge>{item.confidence}% match</Badge>
                  </div>
                  <Progress value={item.confidence} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Recommendations
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Trending items in your category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                    <Box className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      ${product.price}
                    </p>
                    <div className="mt-1 flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < product.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Browse Catalog
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Returns & Refurbishment</CardTitle>
            <CardDescription>
              Process returns or request replacements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Start a Return</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Request a return for items purchased within the last 30 days
                </p>
                <Button className="mt-3 w-full" variant="outline">
                  Initiate Return
                </Button>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Request Refurbishment</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule maintenance or repair for eligible products
                </p>
                <Button className="mt-3 w-full" variant="outline">
                  Schedule Service
                </Button>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-medium">Return Status</h4>
                <div className="mt-3 space-y-2">
                  {returns.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>Return #{item.id}</span>
                      <Badge
                        variant={
                          item.status === "approved"
                            ? "success"
                            : item.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const orderHistoryData = [
  { month: "Jan", orders: 40, forecast: 42 },
  { month: "Feb", orders: 30, forecast: 31 },
  { month: "Mar", orders: 20, forecast: 22 },
  { month: "Apr", orders: 27, forecast: 28 },
  { month: "May", orders: 18, forecast: 21 },
  { month: "Jun", orders: 23, forecast: 25 },
];

const recentOrders = [
  {
    id: 1,
    number: "ORD-5523",
    items: 12,
    amount: "1,245.00",
    date: "Today",
    status: "processing",
  },
  {
    id: 2,
    number: "ORD-5489",
    items: 5,
    amount: "645.20",
    date: "Yesterday",
    status: "delivered",
  },
  {
    id: 3,
    number: "ORD-5412",
    items: 8,
    amount: "842.50",
    date: "Mar 15, 2023",
    status: "delivered",
  },
  {
    id: 4,
    number: "ORD-5387",
    items: 3,
    amount: "329.99",
    date: "Mar 10, 2023",
    status: "pending",
  },
];

const stockRecommendations = [
  { id: 1, name: "Smartphone X", category: "Electronics", confidence: 95 },
  { id: 2, name: "Office Chair", category: "Furniture", confidence: 82 },
  { id: 3, name: "Winter Jacket", category: "Clothing", confidence: 78 },
];

const popularProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: "129.99",
    rating: 4,
    reviews: 256,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: "249.99",
    rating: 5,
    reviews: 189,
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: "79.99",
    rating: 3,
    reviews: 124,
  },
];

const returns = [
  { id: "RT-1234", status: "approved" },
  { id: "RT-1235", status: "pending" },
  { id: "RT-1236", status: "rejected" },
];
