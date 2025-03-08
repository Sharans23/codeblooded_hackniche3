"use client";

import { useState } from "react";
import { AlertCircle, Edit, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProductManagement({ activeMethod, setActiveMethod }) {
  const [products, setProducts] = useState([
    {
      id: "P001",
      name: "Premium Laptop",
      sku: "TECH-LP-001",
      category: "Electronics",
      stockQuantity: 45,
      reorderLevel: 10,
      unitCost: 850.0,
      totalValue: 38250.0,
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
      sku: "TECH-WH-002",
      category: "Electronics",
      stockQuantity: 120,
      reorderLevel: 30,
      unitCost: 65.0,
      totalValue: 7800.0,
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
      sku: "FURN-CH-003",
      category: "Furniture",
      stockQuantity: 35,
      reorderLevel: 8,
      unitCost: 120.0,
      totalValue: 4200.0,
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
    {
      id: "P004",
      name: "Smartphone Case",
      sku: "ACCS-SC-004",
      category: "Accessories",
      stockQuantity: 250,
      reorderLevel: 50,
      unitCost: 12.5,
      totalValue: 3125.0,
      batches: [
        {
          id: "B1",
          date: "2023-02-05",
          quantity: 100,
          unitCost: 10.0,
          remaining: 50,
        },
        {
          id: "B2",
          date: "2023-04-10",
          quantity: 100,
          unitCost: 12.5,
          remaining: 100,
        },
        {
          id: "B3",
          date: "2023-06-15",
          quantity: 100,
          unitCost: 15.0,
          remaining: 100,
        },
      ],
    },
    {
      id: "P005",
      name: "LED Monitor",
      sku: "TECH-MN-005",
      category: "Electronics",
      stockQuantity: 60,
      reorderLevel: 15,
      unitCost: 175.0,
      totalValue: 10500.0,
      batches: [
        {
          id: "B1",
          date: "2023-01-25",
          quantity: 20,
          unitCost: 165.0,
          remaining: 10,
        },
        {
          id: "B2",
          date: "2023-03-30",
          quantity: 25,
          unitCost: 175.0,
          remaining: 25,
        },
        {
          id: "B3",
          date: "2023-06-05",
          quantity: 25,
          unitCost: 180.0,
          remaining: 25,
        },
      ],
    },
    {
      id: "P006",
      name: "Ergonomic Keyboard",
      sku: "TECH-KB-006",
      category: "Electronics",
      stockQuantity: 85,
      reorderLevel: 20,
      unitCost: 45.0,
      totalValue: 3825.0,
      batches: [
        {
          id: "B1",
          date: "2023-02-15",
          quantity: 30,
          unitCost: 40.0,
          remaining: 15,
        },
        {
          id: "B2",
          date: "2023-04-20",
          quantity: 35,
          unitCost: 45.0,
          remaining: 35,
        },
        {
          id: "B3",
          date: "2023-06-25",
          quantity: 35,
          unitCost: 50.0,
          remaining: 35,
        },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Electronics",
    stockQuantity: 0,
    reorderLevel: 0,
    unitCost: 0,
    batches: [],
  });
  const [newBatch, setNewBatch] = useState({
    quantity: 0,
    unitCost: 0,
  });

  const categories = [
    "Electronics",
    "Furniture",
    "Accessories",
    "Office Supplies",
    "Storage",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" &&
        product.stockQuantity <= product.reorderLevel) ||
      (stockFilter === "normal" &&
        product.stockQuantity > product.reorderLevel);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) return;

    const today = new Date().toISOString().split("T")[0];
    const newId = `P${(products.length + 1).toString().padStart(3, "0")}`;

    const productToAdd = {
      ...newProduct,
      id: newId,
      totalValue: newProduct.stockQuantity * newProduct.unitCost,
      batches:
        newProduct.stockQuantity > 0
          ? [
              {
                id: "B1",
                date: today,
                quantity: newProduct.stockQuantity,
                unitCost: newProduct.unitCost,
                remaining: newProduct.stockQuantity,
              },
            ]
          : [],
    };

    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      sku: "",
      category: "Electronics",
      stockQuantity: 0,
      reorderLevel: 0,
      unitCost: 0,
      batches: [],
    });
    setIsAddDialogOpen(false);
  };

  const handleAddBatch = () => {
    if (!selectedProduct || newBatch.quantity <= 0 || newBatch.unitCost <= 0)
      return;

    const today = new Date().toISOString().split("T")[0];
    const newBatchId = `B${(selectedProduct.batches.length + 1).toString()}`;

    const batchToAdd = {
      id: newBatchId,
      date: today,
      quantity: newBatch.quantity,
      unitCost: newBatch.unitCost,
      remaining: newBatch.quantity,
    };

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        const updatedBatches = [...product.batches, batchToAdd];
        const newStockQuantity = product.stockQuantity + newBatch.quantity;
        const newTotalValue = updatedBatches.reduce(
          (sum, batch) => sum + batch.remaining * batch.unitCost,
          0
        );

        return {
          ...product,
          batches: updatedBatches,
          stockQuantity: newStockQuantity,
          totalValue: newTotalValue,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setNewBatch({ quantity: 0, unitCost: 0 });

    // Update the selected product
    const updatedSelectedProduct = updatedProducts.find(
      (p) => p.id === selectedProduct.id
    );
    setSelectedProduct(updatedSelectedProduct);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="inventory-method" className="text-sm font-medium">
            Inventory Method:
          </Label>
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="initial-stock" className="text-right">
                  Initial Stock
                </Label>
                <Input
                  id="initial-stock"
                  type="number"
                  min="0"
                  value={newProduct.stockQuantity || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stockQuantity: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorder-level" className="text-right">
                  Reorder Level
                </Label>
                <Input
                  id="reorder-level"
                  type="number"
                  min="0"
                  value={newProduct.reorderLevel || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      reorderLevel: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit-cost" className="text-right">
                  Unit Cost ($)
                </Label>
                <Input
                  id="unit-cost"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newProduct.unitCost || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      unitCost: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddProduct}>
                Save Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stock Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="normal">Normal Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.name}
                      {product.stockQuantity <= product.reorderLevel && (
                        <Badge variant="destructive" className="ml-2">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {product.stockQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.unitCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.totalValue.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>
                            Manage Product: {product.name}
                          </DialogTitle>
                          <DialogDescription>
                            View inventory details and add new batches.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Product ID</Label>
                                <div className="font-medium">
                                  {selectedProduct.id}
                                </div>
                              </div>
                              <div>
                                <Label>SKU</Label>
                                <div className="font-medium">
                                  {selectedProduct.sku}
                                </div>
                              </div>
                              <div>
                                <Label>Category</Label>
                                <div className="font-medium">
                                  {selectedProduct.category}
                                </div>
                              </div>
                              <div>
                                <Label>Current Stock</Label>
                                <div className="font-medium">
                                  {selectedProduct.stockQuantity}
                                </div>
                              </div>
                              <div>
                                <Label>Reorder Level</Label>
                                <div className="font-medium">
                                  {selectedProduct.reorderLevel}
                                </div>
                              </div>
                              <div>
                                <Label>Total Value</Label>
                                <div className="font-medium">
                                  ${selectedProduct.totalValue.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {selectedProduct.stockQuantity <=
                              selectedProduct.reorderLevel && (
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Low Stock Alert</AlertTitle>
                                <AlertDescription>
                                  This product is below or at its reorder level.
                                  Consider restocking soon.
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="space-y-2">
                              <h3 className="font-medium">
                                Inventory Batches ({activeMethod.toUpperCase()})
                              </h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Batch ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">
                                      Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                      Remaining
                                    </TableHead>
                                    <TableHead className="text-right">
                                      Unit Cost
                                    </TableHead>
                                    <TableHead className="text-right">
                                      Batch Value
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedProduct.batches.map((batch) => (
                                    <TableRow key={batch.id}>
                                      <TableCell>{batch.id}</TableCell>
                                      <TableCell>{batch.date}</TableCell>
                                      <TableCell className="text-right">
                                        {batch.quantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {batch.remaining}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        ${batch.unitCost.toFixed(2)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        $
                                        {(
                                          batch.remaining * batch.unitCost
                                        ).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="space-y-2">
                              <h3 className="font-medium">Add New Batch</h3>
                              <div className="flex space-x-4">
                                <div className="space-y-2 flex-1">
                                  <Label htmlFor="batch-quantity">
                                    Quantity
                                  </Label>
                                  <Input
                                    id="batch-quantity"
                                    type="number"
                                    min="1"
                                    value={newBatch.quantity || ""}
                                    onChange={(e) =>
                                      setNewBatch({
                                        ...newBatch,
                                        quantity:
                                          Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2 flex-1">
                                  <Label htmlFor="batch-cost">
                                    Unit Cost ($)
                                  </Label>
                                  <Input
                                    id="batch-cost"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={newBatch.unitCost || ""}
                                    onChange={(e) =>
                                      setNewBatch({
                                        ...newBatch,
                                        unitCost:
                                          Number.parseFloat(e.target.value) ||
                                          0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex items-end">
                                  <Button onClick={handleAddBatch}>
                                    Add Batch
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
