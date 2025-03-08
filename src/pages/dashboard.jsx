import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  AlertCircle,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
  AlertTriangle,
  Layers,
} from "lucide-react";
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
import { useAuth } from "../contexts/auth-context";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const warehouseLocation = user?.location || "north";

  const [lowStockAlerts, setLowStockAlerts] = useState([
    {
      id: 1,
      name: "Gaming Console",
      sku: "EL-1235",
      quantity: 2,
      threshold: 5,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Office Chair",
      sku: "FN-7890",
      quantity: 3,
      threshold: 5,
      category: "Furniture",
    },
    {
      id: 3,
      name: "Winter Jacket",
      sku: "CL-9012",
      quantity: 7,
      threshold: 10,
      category: "Clothing",
    },
  ]);

  const [inventoryMethods, setInventoryMethods] = useState({
    fifo: 8,
    lifo: 4,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Warehouse Dashboard
          </h1>
          <p className="text-muted-foreground">
            {warehouseLocation.charAt(0).toUpperCase() +
              warehouseLocation.slice(1)}{" "}
            Warehouse Overview
          </p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Scan Inventory
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,248</div>
            <p className="text-xs text-muted-foreground">
              +120 items since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Shipments
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              5 require immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transfer Requests
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 new requests today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Space Utilization
            </CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="inventory-methods">Inventory Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Live Stock Tracking</CardTitle>
                <CardDescription>
                  Current inventory levels by category
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="electronics"
                      stackId="1"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      name="Electronics"
                    />
                    <Area
                      type="monotone"
                      dataKey="furniture"
                      stackId="1"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      name="Furniture"
                    />
                    <Area
                      type="monotone"
                      dataKey="clothing"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Clothing"
                    />
                    <Area
                      type="monotone"
                      dataKey="other"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="Other"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Incoming Shipments</CardTitle>
                <CardDescription>Expected deliveries for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomingShipments.map((shipment) => (
                    <div key={shipment.id} className="flex items-center">
                      <div
                        className={`mr-4 flex h-8 w-8 items-center justify-center rounded-full ${
                          shipment.status === "on-time"
                            ? "bg-green-100 dark:bg-green-900"
                            : shipment.status === "delayed"
                            ? "bg-amber-100 dark:bg-amber-900"
                            : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {shipment.status === "on-time" && (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                        {shipment.status === "delayed" && (
                          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        )}
                        {shipment.status === "critical" && (
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {shipment.supplier}
                          <Badge variant="outline" className="ml-2">
                            {shipment.items} items
                          </Badge>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ETA: {shipment.eta}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>
                Items that have fallen below their threshold levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-md bg-destructive/10 p-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>SKU: {alert.sku}</span>
                          <span className="mx-2">•</span>
                          <span className="text-destructive font-medium">
                            {alert.quantity} / {alert.threshold}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{alert.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                      <Button size="sm">Adjust Threshold</Button>
                    </div>
                  </motion.div>
                ))}

                {lowStockAlerts.length === 0 && (
                  <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      No low stock alerts at this time.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory-methods">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Method Distribution</CardTitle>
                <CardDescription>
                  Products using FIFO vs LIFO inventory methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex flex-col items-center">
                    <div className="relative h-64 w-64">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="10"
                            strokeDasharray={`${
                              (inventoryMethods.fifo /
                                (inventoryMethods.fifo +
                                  inventoryMethods.lifo)) *
                              251.2
                            } 251.2`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {Math.round(
                            (inventoryMethods.fifo /
                              (inventoryMethods.fifo + inventoryMethods.lifo)) *
                              100
                          )}
                          %
                        </span>
                        <span className="text-sm text-muted-foreground">
                          FIFO
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm font-medium">FIFO</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {inventoryMethods.fifo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          products
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-muted mr-2"></div>
                          <span className="text-sm font-medium">LIFO</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {inventoryMethods.lifo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          products
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Batch Management</CardTitle>
                <CardDescription>
                  Products with multiple batches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batchProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          <Layers className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{product.method}</span>
                            <span className="mx-2">•</span>
                            <span>{product.batches} batches</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Batches
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const stockData = [
  { date: "Mon", electronics: 400, furniture: 300, clothing: 200, other: 100 },
  { date: "Tue", electronics: 420, furniture: 320, clothing: 220, other: 120 },
  { date: "Wed", electronics: 410, furniture: 310, clothing: 230, other: 110 },
  { date: "Thu", electronics: 430, furniture: 330, clothing: 240, other: 130 },
  { date: "Fri", electronics: 450, furniture: 340, clothing: 250, other: 140 },
  { date: "Sat", electronics: 440, furniture: 350, clothing: 260, other: 150 },
  { date: "Sun", electronics: 460, furniture: 360, clothing: 270, other: 160 },
];

const incomingShipments = [
  {
    id: 1,
    supplier: "Tech Supplies Inc.",
    items: 120,
    eta: "10:30 AM",
    status: "on-time",
  },
  {
    id: 2,
    supplier: "Furniture Depot",
    items: 45,
    eta: "12:15 PM",
    status: "delayed",
  },
  {
    id: 3,
    supplier: "Fashion Wholesale",
    items: 200,
    eta: "2:00 PM",
    status: "on-time",
  },
  {
    id: 4,
    supplier: "Electronics Hub",
    items: 75,
    eta: "4:30 PM",
    status: "critical",
  },
];

const batchProducts = [
  { id: 1, name: "Smartphone X", method: "FIFO", batches: 3 },
  { id: 2, name: "Laptop Pro", method: "FIFO", batches: 2 },
  { id: 3, name: "Office Chair", method: "LIFO", batches: 2 },
  { id: 4, name: "Wireless Earbuds", method: "FIFO", batches: 4 },
];
