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
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Filter,
  X,
  Info,
} from "lucide-react";
import { useAuth } from "../lib/auth-context";

export default function CreateOrder() {
  const { user } = useAuth();
  const warehouseLocation = user?.location || "north";

  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for order items
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availableCategories, setAvailableCategories] = useState([]);

  // State for product details
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize inventory items
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the sample data
    const items = sampleInventoryItems.map(item => ({
      ...item,
      lowStockThreshold: item.lowStockThreshold || 5,
    }));
    
    setInventoryItems(items);
    
    // Extract unique categories
    const categories = [...new Set(items.map(item => item.category))];
    setAvailableCategories(categories);
    
    setLoading(false);
  }, []);

  // Filter items by warehouse location, category, and search term
  const filteredItems = inventoryItems
    .filter(item => item.warehouse.toLowerCase() === warehouseLocation.toLowerCase())
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Functions for managing order items
  const addToOrder = (item, quantity = 1) => {
    // Check if item is already in order
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    
    if (existingItem) {
      // Update quantity if already in order
      setOrderItems(
        orderItems.map(orderItem =>
          orderItem.id === item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + quantity,
                total: (orderItem.quantity + quantity) * item.price
              }
            : orderItem
        )
      );
    } else {
      // Add new item to order
      setOrderItems([
        ...orderItems,
        {
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          price: item.price,
          quantity: quantity,
          total: quantity * item.price
        }
      ]);
    }
  };

  const removeFromOrder = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const updateOrderItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    
    const item = inventoryItems.find(item => item.id === itemId);
    const maxAvailable = item ? item.quantity : 0;
    
    // Don't allow ordering more than available
    const quantity = Math.min(newQuantity, maxAvailable);
    
    setOrderItems(
      orderItems.map(orderItem =>
        orderItem.id === itemId
          ? {
              ...orderItem,
              quantity: quantity,
              total: quantity * orderItem.price
            }
          : orderItem
      )
    );
  };

  // Calculate order totals
  const orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
          <p className="text-muted-foreground">
            Select products from {warehouseLocation.charAt(0).toUpperCase() + warehouseLocation.slice(1)} warehouse
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setShowOrderSummary(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {orderItems.length > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2" 
                    variant="destructive"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View order summary</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Selection</CardTitle>
          <CardDescription>
            Search and filter items to add to your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or SKU..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product listing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Available Products</CardTitle>
          <CardDescription>
            {filteredItems.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Loading products...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <p>No products found.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isInOrder = orderItems.some(orderItem => orderItem.id === item.id);
                  const orderQuantity = isInOrder 
                    ? orderItems.find(orderItem => orderItem.id === item.id).quantity 
                    : 0;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectedProduct(item);
                          setShowProductDetails(true);
                        }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        ${item.price.toFixed(2)}
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isInOrder ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => updateOrderItemQuantity(item.id, orderQuantity - 1)}
                                disabled={orderQuantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{orderQuantity}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => updateOrderItemQuantity(item.id, orderQuantity + 1)}
                                disabled={orderQuantity >= item.quantity}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => removeFromOrder(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToOrder(item)}
                              disabled={item.quantity === 0}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="font-medium">{selectedProduct.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Warehouse</p>
                    <p className="font-medium">{selectedProduct.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aisle</p>
                    <p className="font-medium">{selectedProduct.aisle}</p>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.quantity <= selectedProduct.lowStockThreshold 
                        ? "This item is low in stock." 
                        : "This item is available for order."}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      addToOrder(selectedProduct);
                      setShowProductDetails(false);
                    }}
                    disabled={selectedProduct.quantity === 0}
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Summary Dialog */}
      <Dialog open={showOrderSummary} onOpenChange={setShowOrderSummary}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Order Summary</DialogTitle>
            <DialogDescription>
              Review your order before submission
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {orderItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Your order is empty.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowOrderSummary(false)}
                >
                  Add Products
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                          <div className="text-xs text-muted-foreground">{item.sku}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => updateOrderItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => updateOrderItemQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= inventoryItems.find(i => i.id === item.id)?.quantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromOrder(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-2 border-t">
                    <span className="font-medium">Order Total:</span>
                    <span className="text-xl font-bold">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowOrderSummary(false)}
            >
              Continue Shopping
            </Button>
            <Button 
              disabled={orderItems.length === 0}
              onClick={() => {
                // Handle order submission
                alert("Order submitted successfully!");
                setOrderItems([]);
                setShowOrderSummary(false);
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample inventory data
const sampleInventoryItems = [
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
  {
    id: 8,
    name: "Bookshelf",
    sku: "FN-5432",
    category: "Furniture",
    quantity: 6,
    warehouse: "north",
    aisle: "B3",
    price: 179,
  },
  {
    id: 9,
    name: "Coffee Table",
    sku: "FN-8765",
    category: "Furniture",
    quantity: 4,
    warehouse: "north",
    aisle: "B2",
    price: 249,
  },
  {
    id: 10,
    name: "Bluetooth Speaker",
    sku: "EL-4321",
    category: "Electronics",
    quantity: 30,
    warehouse: "north",
    aisle: "A2",
    price: 79,
  },
  {
    id: 11,
    name: "Tablet Pro",
    sku: "EL-9876",
    category: "Electronics",
    quantity: 15,
    warehouse: "north",
    aisle: "A4",
    price: 599,
  },
  {
    id: 12,
    name: "Ergonomic Keyboard",
    sku: "CP-1122",
    category: "Computer Accessories",
    quantity: 22,
    warehouse: "north",
    aisle: "C1",
    price: 129,
  },
  {
    id: 13,
    name: "Wireless Mouse",
    sku: "CP-3344",
    category: "Computer Accessories",
    quantity: 35,
    warehouse: "north",
    aisle: "C1",
    price: 49,
  },
  {
    id: 14,
    name: "27\" Monitor",
    sku: "CP-5566",
    category: "Computer Accessories",
    quantity: 10,
    warehouse: "north",
    aisle: "C2",
    price: 299,
  }
];