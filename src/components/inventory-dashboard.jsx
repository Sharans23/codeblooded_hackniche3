"use client";

import { useState } from "react";
import {
  ArrowDownUp,
  BarChart3,
  Box,
  Clock,
  DollarSign,
  Package,
  Truck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InventorySimulator from "./inventory-simulator";
import InventoryComparison from "./inventory-comparison";
import InventoryTransactions from "./inventory-transactions";
import ProductManagement from "./product-management";
import InventoryAnalytics from "./inventory-analytics";

export default function InventoryDashboard() {
  const [activeMethod, setActiveMethod] = useState("fifo");
  const [inventorySummary, setInventorySummary] = useState({
    totalValue: 45231.89,
    totalItems: 2345,
    turnoverRate: 12.5,
    pendingOrders: 43,
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Inventory Management System
        </h1>
        <p className="text-muted-foreground">
          Track and manage your inventory with advanced FIFO and LIFO valuation
          methods
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {inventorySummary.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Items in Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventorySummary.totalItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +180 new items this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Turnover Rate
            </CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventorySummary.turnoverRate} days
            </div>
            <p className="text-xs text-muted-foreground">
              -2.3 days from previous quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventorySummary.pendingOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              12 require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-auto">
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4 hidden sm:inline" />
            Products
          </TabsTrigger>
          <TabsTrigger value="simulator">
            <Clock className="mr-2 h-4 w-4 hidden sm:inline" />
            Inventory Simulator
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Box className="mr-2 h-4 w-4 hidden sm:inline" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4 hidden sm:inline" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <ArrowDownUp className="mr-2 h-4 w-4 hidden sm:inline" />
            FIFO vs LIFO
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <ProductManagement
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />
        </TabsContent>
        <TabsContent value="simulator" className="space-y-4">
          <InventorySimulator
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <InventoryTransactions />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <InventoryAnalytics />
        </TabsContent>
        <TabsContent value="comparison" className="space-y-4">
          <InventoryComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
}
