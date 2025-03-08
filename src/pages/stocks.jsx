"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { motion } from "framer-motion";
import {
  Edit,
  History,
  Layers,
  PlusCircle,
  Search,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuth } from "../lib/auth-context";

export default function Stock() {
  const { user } = useAuth();
  const warehouseLocation = user?.location || "north";

  // State for inventory items
  const [enhancedInventoryItems, setEnhancedInventoryItems] = useState([]);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // State for batch details
  const [showBatchDetails, setShowBatchDetails] = useState(false);
  const [selectedItemBatches, setSelectedItemBatches] = useState(null);

  // State for stock movement history
  const [showMovementHistory, setShowMovementHistory] = useState(false);
  const [selectedItemMovements, setSelectedItemMovements] = useState(null);

  // Initialize enhanced inventory items
  useEffect(() => {
    // Add batch information and inventory method to each item
    const enhanced = inventoryItems.map((item) => ({
      ...item,
      inventoryMethod: item.inventoryMethod || "FIFO", // Default to FIFO
      lowStockThreshold: item.lowStockThreshold || 5,
      batches: item.batches || generateMockBatches(item),
      movements: item.movements || generateMockMovements(item),
    }));

    setEnhancedInventoryItems(enhanced);
  }, []);

  // Filter items by warehouse location and search term
  const filteredItems = enhancedInventoryItems
    .filter(
      (item) => item.warehouse.toLowerCase() === warehouseLocation.toLowerCase()
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Helper function to generate mock batch data
  function generateMockBatches(item) {
    const batches = [];
    let remainingQuantity = item.quantity;

    // Generate 1-3 batches
    const numBatches = Math.min(
      Math.floor(Math.random() * 3) + 1,
      Math.ceil(remainingQuantity / 2)
    );

    for (let i = 0; i < numBatches && remainingQuantity > 0; i++) {
      const batchQuantity =
        i === numBatches - 1
          ? remainingQuantity
          : Math.floor(remainingQuantity / (numBatches - i));

      const daysAgo = (i + 1) * 30; // Each batch is about a month apart
      const receivedDate = new Date();
      receivedDate.setDate(receivedDate.getDate() - daysAgo);

      const expiryDate = new Date(receivedDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year expiry

      batches.push({
        id: `batch-${item.id}-${i}`,
        receivedDate: receivedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        quantity: batchQuantity,
        cost: item.price * 0.6, // Estimate cost as 60% of price
      });

      remainingQuantity -= batchQuantity;
    }

    return batches;
  }

  // Helper function to generate mock movement history
  function generateMockMovements(item) {
    const movements = [];
    const numMovements = Math.floor(Math.random() * 5) + 2; // 2-6 movements

    const movementTypes = [
      "Received",
      "Shipped",
      "Transferred",
      "Adjustment",
      "Return",
    ];
    const sources = [
      "Supplier",
      "Customer Order",
      "Warehouse Transfer",
      "Inventory Count",
      "Customer Return",
    ];

    for (let i = 0; i < numMovements; i++) {
      const daysAgo = Math.floor(Math.random() * 60); // Up to 60 days ago
      const movementDate = new Date();
      movementDate.setDate(movementDate.getDate() - daysAgo);

      const typeIndex = Math.floor(Math.random() * movementTypes.length);
      const sourceIndex = Math.floor(Math.random() * sources.length);

      movements.push({
        id: `movement-${item.id}-${i}`,
        date: movementDate.toISOString(),
        type: movementTypes[typeIndex],
        quantity: Math.floor(Math.random() * 10) + 1,
        batchId: `batch-${item.id}-${Math.floor(Math.random() * 3)}`,
        source: sources[sourceIndex],
      });
    }

    // Sort by date (newest first)
    movements.sort((a, b) => new Date(b.date) - new Date(a.date));

    return movements;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Stock Management
          </h1>
          <p className="text-muted-foreground">
            {warehouseLocation.charAt(0).toUpperCase() +
              warehouseLocation.slice(1)}{" "}
            Warehouse Inventory
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="w-full pl-8 md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Warehouse Inventory</CardTitle>
              <CardDescription>
                Manage and track all inventory items in {warehouseLocation}{" "}
                warehouse.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Threshold</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No items found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="cursor-pointer">
                            {item.inventoryMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`${
                              item.quantity <= item.lowStockThreshold
                                ? "text-destructive"
                                : item.quantity <= item.lowStockThreshold * 2
                                ? "text-amber-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          {item.quantity <= item.lowStockThreshold && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Low
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="cursor-pointer">
                            {item.lowStockThreshold}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Adjust Quantity"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedItemBatches(item);
                                setShowBatchDetails(true);
                              }}
                              title="View Batches"
                            >
                              <Layers className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedItemMovements(item);
                                setShowMovementHistory(true);
                              }}
                              title="Movement History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} items
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="low" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
              <CardDescription>
                Items that need attention and possible reordering.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems
                  .filter((item) => item.quantity <= item.lowStockThreshold)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-md bg-destructive/10 p-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>SKU: {item.sku}</span>
                            <span className="mx-2">•</span>
                            <span className="text-destructive font-medium">
                              Only {item.quantity} left
                            </span>
                            <span className="mx-2">•</span>
                            <span>Threshold: {item.lowStockThreshold}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">Restock</Button>
                    </motion.div>
                  ))}

                {filteredItems.filter(
                  (item) => item.quantity <= item.lowStockThreshold
                ).length === 0 && (
                  <div className="flex h-[100px] items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      No low stock items found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Details Dialog */}
      <Dialog open={showBatchDetails} onOpenChange={setShowBatchDetails}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>
              {selectedItemBatches?.name} - Inventory Method:{" "}
              {selectedItemBatches?.inventoryMethod}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItemBatches?.batches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No batches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedItemBatches?.batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id}</TableCell>
                      <TableCell>
                        {new Date(batch.receivedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(batch.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>${batch.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        ${(batch.quantity * batch.cost).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4 rounded-md bg-muted p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Using {selectedItemBatches?.inventoryMethod} inventory
                    method
                  </p>
                </div>
                <div className="text-sm font-medium">
                  Total Value: $
                  {selectedItemBatches?.batches
                    .reduce(
                      (sum, batch) => sum + batch.quantity * batch.cost,
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBatchDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movement History Dialog */}
      <Dialog open={showMovementHistory} onOpenChange={setShowMovementHistory}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Stock Movement History</DialogTitle>
            <DialogDescription>
              {selectedItemMovements?.name} - Movement history and tracking
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItemMovements?.movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No movement history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedItemMovements?.movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            movement.type === "Received"
                              ? "default"
                              : movement.type === "Shipped"
                              ? "destructive"
                              : movement.type === "Transferred"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {movement.batchId}
                      </TableCell>
                      <TableCell>{movement.source}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMovementHistory(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample inventory data
const inventoryItems = [
  {
    id: 1,
    name: "Smartphone X",
    sku: "EL-1234",
    category: "Electronics",
    quantity: 25,
    warehouse: "north",
    aisle: "A3",
    price: 899,
  },
  {
    id: 2,
    name: "Laptop Pro",
    sku: "EL-5678",
    category: "Electronics",
    quantity: 12,
    warehouse: "north",
    aisle: "A4",
    price: 1299,
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    sku: "EL-9012",
    category: "Electronics",
    quantity: 50,
    warehouse: "north",
    aisle: "A2",
    price: 129,
  },
  {
    id: 4,
    name: "Smart Watch",
    sku: "EL-3456",
    category: "Electronics",
    quantity: 18,
    warehouse: "north",
    aisle: "A3",
    price: 249,
  },
  {
    id: 5,
    name: "Office Chair",
    sku: "FN-7890",
    category: "Furniture",
    quantity: 3,
    warehouse: "north",
    aisle: "B1",
    price: 199,
  },
  {
    id: 6,
    name: "Desk",
    sku: "FN-1234",
    category: "Furniture",
    quantity: 8,
    warehouse: "north",
    aisle: "B2",
    price: 349,
  },
  {
    id: 7,
    name: "Gaming Console",
    sku: "EL-1235",
    category: "Electronics",
    quantity: 2,
    warehouse: "north",
    aisle: "A1",
    price: 499,
  },
];
