"use client";

import { useState } from "react";
import { ArrowUp, Clock, Package, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function InventorySimulator({ activeMethod, setActiveMethod }) {
  const [selectedProduct, setSelectedProduct] = useState("P001");
  const [products, setProducts] = useState([
    {
      id: "P001",
      name: "Premium Laptop",
      batches: [
        {
          id: "B1",
          date: "2023-01-15",
          quantity: 20,
          unitCost: 800.0,
          remaining: 5,
        },
        {
          id: "B2",
          date: "2023-03-10",
          quantity: 25,
          unitCost: 850.0,
          remaining: 20,
        },
        {
          id: "B3",
          date: "2023-05-05",
          quantity: 30,
          unitCost: 900.0,
          remaining: 20,
        },
      ],
    },
    {
      id: "P002",
      name: "Wireless Headphones",
      batches: [
        {
          id: "B1",
          date: "2023-02-10",
          quantity: 50,
          unitCost: 60.0,
          remaining: 20,
        },
        {
          id: "B2",
          date: "2023-04-15",
          quantity: 70,
          unitCost: 65.0,
          remaining: 50,
        },
        {
          id: "B3",
          date: "2023-06-20",
          quantity: 50,
          unitCost: 70.0,
          remaining: 50,
        },
      ],
    },
    {
      id: "P003",
      name: "Office Desk Chair",
      batches: [
        {
          id: "B1",
          date: "2023-01-20",
          quantity: 15,
          unitCost: 110.0,
          remaining: 5,
        },
        {
          id: "B2",
          date: "2023-03-25",
          quantity: 20,
          unitCost: 120.0,
          remaining: 15,
        },
        {
          id: "B3",
          date: "2023-05-30",
          quantity: 15,
          unitCost: 125.0,
          remaining: 15,
        },
      ],
    },
  ]);

  const [newBatch, setNewBatch] = useState({
    quantity: 0,
    unitCost: 0,
  });

  const [withdrawQuantity, setWithdrawQuantity] = useState(0);
  const [withdrawalResult, setWithdrawalResult] = useState(null);

  const currentProduct = products.find((p) => p.id === selectedProduct);

  const totalInventoryValue = currentProduct
    ? currentProduct.batches.reduce(
        (sum, batch) => sum + batch.remaining * batch.unitCost,
        0
      )
    : 0;

  const totalInventoryQuantity = currentProduct
    ? currentProduct.batches.reduce((sum, batch) => sum + batch.remaining, 0)
    : 0;

  const addInventoryBatch = () => {
    if (!currentProduct || newBatch.quantity <= 0 || newBatch.unitCost <= 0)
      return;

    const today = new Date().toISOString().split("T")[0];
    const newBatchId = `B${(currentProduct.batches.length + 1).toString()}`;

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct) {
        return {
          ...product,
          batches: [
            ...product.batches,
            {
              id: newBatchId,
              date: today,
              quantity: newBatch.quantity,
              unitCost: newBatch.unitCost,
              remaining: newBatch.quantity,
            },
          ],
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setNewBatch({ quantity: 0, unitCost: 0 });
  };

  const withdrawInventory = () => {
    if (!currentProduct || withdrawQuantity <= 0) return;

    let remainingToWithdraw = withdrawQuantity;
    const itemsToWithdraw = [];
    let totalWithdrawalCost = 0;

    // Create a copy of the product to work with
    const productCopy = JSON.parse(JSON.stringify(currentProduct));

    if (activeMethod === "fifo") {
      // FIFO: Start from the oldest batches (beginning of the array)
      for (let i = 0; i < productCopy.batches.length; i++) {
        if (remainingToWithdraw <= 0) break;

        const batch = productCopy.batches[i];
        const quantityToWithdraw = Math.min(
          remainingToWithdraw,
          batch.remaining
        );

        if (quantityToWithdraw > 0) {
          // Add to withdrawal items
          itemsToWithdraw.push({
            id: batch.id,
            quantity: quantityToWithdraw,
            unitCost: batch.unitCost,
            totalCost: quantityToWithdraw * batch.unitCost,
          });

          totalWithdrawalCost += quantityToWithdraw * batch.unitCost;

          // Update batch
          batch.remaining -= quantityToWithdraw;

          remainingToWithdraw -= quantityToWithdraw;
        }
      }
    } else {
      // LIFO: Start from the newest batches (end of the array)
      for (let i = productCopy.batches.length - 1; i >= 0; i--) {
        if (remainingToWithdraw <= 0) break;

        const batch = productCopy.batches[i];
        const quantityToWithdraw = Math.min(
          remainingToWithdraw,
          batch.remaining
        );

        if (quantityToWithdraw > 0) {
          // Add to withdrawal items
          itemsToWithdraw.push({
            id: batch.id,
            quantity: quantityToWithdraw,
            unitCost: batch.unitCost,
            totalCost: quantityToWithdraw * batch.unitCost,
          });

          totalWithdrawalCost += quantityToWithdraw * batch.unitCost;

          // Update batch
          batch.remaining -= quantityToWithdraw;

          remainingToWithdraw -= quantityToWithdraw;
        }
      }
    }

    // Update products state with the modified batches
    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct) {
        return {
          ...product,
          batches: productCopy.batches.filter((batch) => batch.remaining > 0),
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setWithdrawalResult({
      items: itemsToWithdraw,
      totalCost: totalWithdrawalCost,
    });
    setWithdrawQuantity(0);
  };

  const resetSimulation = () => {
    setProducts([
      {
        id: "P001",
        name: "Premium Laptop",
        batches: [
          {
            id: "B1",
            date: "2023-01-15",
            quantity: 20,
            unitCost: 800.0,
            remaining: 5,
          },
          {
            id: "B2",
            date: "2023-03-10",
            quantity: 25,
            unitCost: 850.0,
            remaining: 20,
          },
          {
            id: "B3",
            date: "2023-05-05",
            quantity: 30,
            unitCost: 900.0,
            remaining: 20,
          },
        ],
      },
      {
        id: "P002",
        name: "Wireless Headphones",
        batches: [
          {
            id: "B1",
            date: "2023-02-10",
            quantity: 50,
            unitCost: 60.0,
            remaining: 20,
          },
          {
            id: "B2",
            date: "2023-04-15",
            quantity: 70,
            unitCost: 65.0,
            remaining: 50,
          },
          {
            id: "B3",
            date: "2023-06-20",
            quantity: 50,
            unitCost: 70.0,
            remaining: 50,
          },
        ],
      },
      {
        id: "P003",
        name: "Office Desk Chair",
        batches: [
          {
            id: "B1",
            date: "2023-01-20",
            quantity: 15,
            unitCost: 110.0,
            remaining: 5,
          },
          {
            id: "B2",
            date: "2023-03-25",
            quantity: 20,
            unitCost: 120.0,
            remaining: 15,
          },
          {
            id: "B3",
            date: "2023-05-30",
            quantity: 15,
            unitCost: 125.0,
            remaining: 15,
          },
        ],
      },
    ]);
    setWithdrawalResult(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Simulator</CardTitle>
              <CardDescription>
                See how {activeMethod.toUpperCase()} affects your inventory
                costs
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="method-toggle"
                className={activeMethod === "fifo" ? "font-bold" : ""}
              >
                FIFO
              </Label>
              <Switch
                id="method-toggle"
                checked={activeMethod === "lifo"}
                onCheckedChange={(checked) =>
                  setActiveMethod(checked ? "lifo" : "fifo")
                }
              />
              <Label
                htmlFor="method-toggle"
                className={activeMethod === "lifo" ? "font-bold" : ""}
              >
                LIFO
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-select">Select Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-value">Total Value</Label>
                <div id="total-value" className="text-2xl font-bold">
                  ${totalInventoryValue.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-quantity">Total Quantity</Label>
                <div id="total-quantity" className="text-2xl font-bold">
                  {totalInventoryQuantity}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Current Inventory Layers
                </h3>
                <Badge
                  variant={activeMethod === "fifo" ? "default" : "outline"}
                >
                  {activeMethod === "fifo" ? "Oldest First" : "Newest First"}
                </Badge>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-2 p-3 text-sm font-medium">
                  <div>Batch</div>
                  <div>Date</div>
                  <div>Quantity</div>
                  <div>Unit Cost</div>
                  <div>Total</div>
                </div>
                <Separator />
                <div className="max-h-[200px] overflow-auto">
                  {!currentProduct || currentProduct.batches.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No inventory batches available
                    </div>
                  ) : (
                    currentProduct.batches.map((batch) => (
                      <div
                        key={batch.id}
                        className="grid grid-cols-5 gap-2 p-3 text-sm"
                      >
                        <div>{batch.id}</div>
                        <div>{batch.date}</div>
                        <div>{batch.remaining}</div>
                        <div>${batch.unitCost.toFixed(2)}</div>
                        <div>
                          ${(batch.remaining * batch.unitCost).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Inventory</CardTitle>
            <CardDescription>
              Add a new batch of inventory at current market price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newBatch.quantity || ""}
                    onChange={(e) =>
                      setNewBatch({
                        ...newBatch,
                        quantity: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-cost">Unit Cost ($)</Label>
                  <Input
                    id="unit-cost"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={newBatch.unitCost || ""}
                    onChange={(e) =>
                      setNewBatch({
                        ...newBatch,
                        unitCost: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter unit cost"
                  />
                </div>
              </div>
              <Button onClick={addInventoryBatch} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Inventory Batch
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Inventory</CardTitle>
            <CardDescription>
              Withdraw inventory using {activeMethod.toUpperCase()} method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-quantity">Quantity to Withdraw</Label>
                <div className="flex space-x-2">
                  <Input
                    id="withdraw-quantity"
                    type="number"
                    min="1"
                    max={totalInventoryQuantity}
                    value={withdrawQuantity || ""}
                    onChange={(e) =>
                      setWithdrawQuantity(Number.parseInt(e.target.value) || 0)
                    }
                    placeholder="Enter quantity"
                  />
                  <Button onClick={withdrawInventory}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>

              {withdrawalResult && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Withdrawal Result ({activeMethod.toUpperCase()})
                    </h4>
                    <Badge variant="outline">Cost of Goods Sold</Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {withdrawalResult.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity} units from batch #{item.id} @ $
                          {item.unitCost.toFixed(2)}
                        </span>
                        <span className="font-medium">
                          ${item.totalCost.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total COGS:</span>
                      <span>${withdrawalResult.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={resetSimulation}
                className="w-full"
              >
                <Clock className="mr-2 h-4 w-4" />
                Reset Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
