"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle,
  Clock,
  Package,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function InventoryAlerts() {
  const [alertSettings, setAlertSettings] = useState({
    lowStock: true,
    priceChanges: true,
    expiryDates: true,
    inventoryMovements: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  const lowStockAlerts = [
    {
      id: "1",
      product: "Widget A",
      sku: "WID-001",
      currentStock: 45,
      reorderPoint: 50,
      reorderQuantity: 100,
      supplier: "ABC Suppliers",
      lastOrdered: "2023-03-15",
      status: "critical",
    },
    {
      id: "2",
      product: "Gadget B",
      sku: "GAD-002",
      currentStock: 25,
      reorderPoint: 30,
      reorderQuantity: 60,
      supplier: "Tech Distributors",
      lastOrdered: "2023-04-10",
      status: "critical",
    },
    {
      id: "3",
      product: "Component D",
      sku: "COMP-004",
      currentStock: 110,
      reorderPoint: 100,
      reorderQuantity: 200,
      supplier: "Tech Distributors",
      lastOrdered: "2023-02-20",
      status: "warning",
    },
    {
      id: "4",
      product: "Tool C",
      sku: "TOOL-003",
      currentStock: 45,
      reorderPoint: 40,
      reorderQuantity: 80,
      supplier: "ABC Suppliers",
      lastOrdered: "2023-05-05",
      status: "warning",
    },
  ];

  const expiryAlerts = [
    {
      id: "1",
      product: "Material E",
      sku: "MAT-005",
      batchNumber: "B2023-05-10",
      quantity: 150,
      expiryDate: "2023-08-10",
      daysRemaining: 15,
      location: "Warehouse D",
      status: "critical",
    },
    {
      id: "2",
      product: "Material E",
      sku: "MAT-005",
      batchNumber: "B2023-04-20",
      quantity: 75,
      expiryDate: "2023-09-20",
      daysRemaining: 56,
      location: "Warehouse D",
      status: "warning",
    },
  ];

  const priceAlerts = [
    {
      id: "1",
      product: "Widget A",
      sku: "WID-001",
      supplier: "ABC Suppliers",
      oldPrice: 10.0,
      newPrice: 12.5,
      percentChange: 25,
      effectiveDate: "2023-08-01",
      status: "critical",
    },
    {
      id: "2",
      product: "Gadget B",
      sku: "GAD-002",
      supplier: "Tech Distributors",
      oldPrice: 25.0,
      newPrice: 27.5,
      percentChange: 10,
      effectiveDate: "2023-09-01",
      status: "warning",
    },
  ];

  const handleToggleChange = (setting) => {
    setAlertSettings({
      ...alertSettings,
      [setting]: !alertSettings[setting],
    });
  };

  return (
    <Tabs defaultValue="low-stock" className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="low-stock" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Low Stock ({lowStockAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="expiry-dates" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Expiry Dates ({expiryAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="price-changes" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Price Changes ({priceAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Alert Settings
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="low-stock">
        <div className="grid gap-4 md:grid-cols-2">
          {lowStockAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.status === "critical"
                  ? "border-red-200"
                  : "border-amber-200"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{alert.product}</CardTitle>
                    <CardDescription>{alert.sku}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      alert.status === "critical" ? "destructive" : "outline"
                    }
                    className={
                      alert.status === "warning"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : ""
                    }
                  >
                    {alert.status === "critical" ? "Critical" : "Warning"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Current Stock:
                    </span>
                    <span className="font-medium">{alert.currentStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Reorder Point:
                    </span>
                    <span className="font-medium">{alert.reorderPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reorder Qty:</span>
                    <span className="font-medium">{alert.reorderQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Ordered:</span>
                    <span className="font-medium">{alert.lastOrdered}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Create Purchase Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="expiry-dates">
        <div className="grid gap-4 md:grid-cols-2">
          {expiryAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.status === "critical"
                  ? "border-red-200"
                  : "border-amber-200"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{alert.product}</CardTitle>
                    <CardDescription>
                      {alert.sku} - Batch {alert.batchNumber}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      alert.status === "critical" ? "destructive" : "outline"
                    }
                    className={
                      alert.status === "warning"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : ""
                    }
                  >
                    {alert.daysRemaining} days left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">{alert.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date:</span>
                    <span className="font-medium">{alert.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{alert.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Mark for Disposal
                </Button>
                <Button size="sm" className="flex-1">
                  Prioritize Usage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="price-changes">
        <div className="grid gap-4 md:grid-cols-2">
          {priceAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.status === "critical"
                  ? "border-red-200"
                  : "border-amber-200"
              }
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{alert.product}</CardTitle>
                    <CardDescription>
                      {alert.sku} - {alert.supplier}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      alert.status === "critical" ? "destructive" : "outline"
                    }
                    className={
                      alert.status === "warning"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : ""
                    }
                  >
                    +{alert.percentChange}% Price Increase
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Old Price:</span>
                    <span className="font-medium">
                      ${alert.oldPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Price:</span>
                    <span className="font-medium">
                      ${alert.newPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Effective Date:
                    </span>
                    <span className="font-medium">{alert.effectiveDate}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Review Alternatives
                </Button>
                <Button size="sm" className="flex-1">
                  Update Pricing
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
            <CardDescription>
              Configure which alerts you want to receive and how
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Alert Types</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <Label htmlFor="low-stock">Low Stock Alerts</Label>
                  </div>
                  <Switch
                    id="low-stock"
                    checked={alertSettings.lowStock}
                    onCheckedChange={() => handleToggleChange("lowStock")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="price-changes">Price Change Alerts</Label>
                  </div>
                  <Switch
                    id="price-changes"
                    checked={alertSettings.priceChanges}
                    onCheckedChange={() => handleToggleChange("priceChanges")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <Label htmlFor="expiry-dates">Expiry Date Alerts</Label>
                  </div>
                  <Switch
                    id="expiry-dates"
                    checked={alertSettings.expiryDates}
                    onCheckedChange={() => handleToggleChange("expiryDates")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-green-500" />
                    <Label htmlFor="inventory-movements">
                      Inventory Movement Alerts
                    </Label>
                  </div>
                  <Switch
                    id="inventory-movements"
                    checked={alertSettings.inventoryMovements}
                    onCheckedChange={() =>
                      handleToggleChange("inventoryMovements")
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Methods</h3>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <Switch
                    id="email-notifications"
                    checked={alertSettings.emailNotifications}
                    onCheckedChange={() =>
                      handleToggleChange("emailNotifications")
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={alertSettings.pushNotifications}
                    onCheckedChange={() =>
                      handleToggleChange("pushNotifications")
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
