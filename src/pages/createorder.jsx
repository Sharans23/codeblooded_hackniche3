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
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../lib/auth-context";

export default function CreateOrder() {
  const { user } = useAuth();
  const warehouseLocation = user?.location || "north";
  const warehouseId = "67cc52504bf2e035730c0d48"; // You might want to make this dynamic based on the user

  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  // State for payment selection
  const [paymentModes, setPaymentModes] = useState([
    { id: "UPI", name: "UPI" },
    { id: "Card", name: "Card" },
    { id: "NetBanking", name: "Net Banking" },
    { id: "Cash", name: "Cash" },
  ]);
  
  // Default payment mode for all items
  const [defaultPaymentMode, setDefaultPaymentMode] = useState("UPI");
  
  // State for order submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for notifications
  const [notification, setNotification] = useState(null);

  // Fetch inventory items from API
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:5000/api/warehouseProducts/67cc52504bf2e035730c0d48`, {

        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API data into the format expected by the component
        const transformedItems = data.map(item => ({
          id: item.productId,
          name: item.product.name,
          code: item.product.code,
          category: item.product.category,
          type: item.product.type,
          brand: item.product.brand,
          price: item.product.price,
          unit: item.product.unit,
          quantity: parseInt(item.quantity, 10),
          warehouse: warehouseLocation,
          warehouseId: warehouseId, // Store warehouseId with each product
          lowStockThreshold: 5 // You might want to make this dynamic or get it from the product data
        }));
        
        setInventoryItems(transformedItems);
        
        // Extract unique categories
        const categories = [...new Set(transformedItems.map(item => item.category))];
        setAvailableCategories(categories);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch inventory items:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, [warehouseId, warehouseLocation]);

  // Custom notification function (replacing toast)
  const showNotification = (title, message, type = "info") => {
    setNotification({ title, message, type });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Filter items by warehouse location, category, and search term
  const filteredItems = inventoryItems
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
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
          code: item.code,
          category: item.category,
          price: item.price,
          quantity: quantity,
          total: quantity * item.price,
          paymentMode: defaultPaymentMode, // Set default payment mode
          warehouseId: warehouseId // Adding warehouseId to each order item
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

  // Update payment mode for a specific order item
  const updateOrderItemPaymentMode = (itemId, paymentMode) => {
    setOrderItems(
      orderItems.map(orderItem =>
        orderItem.id === itemId
          ? {
              ...orderItem,
              paymentMode: paymentMode
            }
          : orderItem
      )
    );
  };

  // Update payment mode for all order items
  const updateAllPaymentModes = (paymentMode) => {
    setDefaultPaymentMode(paymentMode);
    setOrderItems(
      orderItems.map(orderItem => ({
        ...orderItem,
        paymentMode: paymentMode
      }))
    );
  };

  // Submit order to API
  const submitOrder = async () => {
    if (orderItems.length === 0) return;

    try {
      setIsSubmitting(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Format the order data as expected by the API
      const products = orderItems.map(item => ({
        warehouseId: warehouseId,
        productId: item.id,
        paymentMode: item.paymentMode,
        quantity: item.quantity.toString() // API expects quantity as a string
      }));
      
      const orderData = {
        products: products
      };
      
      console.log("Submitting order:", orderData);
      
      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }
      
      console.log("Order result:", result);
      
      // Display success message
      showNotification(
        "Success", 
        `${result.message}. ${result.orders.count} products ordered.`,
        "success"
      );
      
      // Clear order items
      setOrderItems([]);
      setShowOrderSummary(false);
      
    } catch (err) {
      console.error("Failed to submit order:", err);
      
      // Display error message
      showNotification(
        "Error", 
        err.message || "Failed to submit order. Please try again.",
        "error"
      );
      
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md mb-4 ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
            {notification.type === 'success' && <Check className="h-5 w-5 mr-2" />}
            {notification.type === 'info' && <Info className="h-5 w-5 mr-2" />}
            <div>
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm">{notification.message}</p>
            </div>
            <button 
              className="ml-auto"
              onClick={() => setNotification(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
                placeholder="Search by name or code..."
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
          ) : error ? (
            <div className="h-64 flex items-center justify-center text-destructive">
              <p>{error}</p>
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
                  <TableHead>Code</TableHead>
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
                      <TableCell>{item.code}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={
                            item.quantity <= item.lowStockThreshold
                              ? "text-destructive"
                              : item.quantity <= item.lowStockThreshold * 2
                              ? "text-amber-500"
                              : "text-green-500"
                          }
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
                    <p className="text-sm text-muted-foreground">Code</p>
                    <p className="font-medium">{selectedProduct.code}</p>
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
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium">{selectedProduct.unit}</p>
                  </div>
                  {selectedProduct.brand && (
                    <div>
                      <p className="text-sm text-muted-foreground">Brand</p>
                      <p className="font-medium">{selectedProduct.brand}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedProduct.type}</p>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.quantity <= selectedProduct.lowStockThreshold 
                        ? "This product is low in stock." 
                        : "This product is available for order."}
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
                {/* Payment mode selection for all items */}
                <div className="mb-4 p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Set payment mode for all items</span>
                    </div>
                    <Select 
                      value={defaultPaymentMode} 
                      onValueChange={updateAllPaymentModes}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Payment Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentModes.map(mode => (
                          <SelectItem key={mode.id} value={mode.id}>
                            {mode.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Payment</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                          <div className="text-xs text-muted-foreground">{item.code}</div>
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
                        <TableCell className="text-center">
                          <Select 
                            value={item.paymentMode} 
                            onValueChange={(value) => updateOrderItemPaymentMode(item.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Payment" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentModes.map(mode => (
                                <SelectItem key={mode.id} value={mode.id}>
                                  {mode.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
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
              disabled={orderItems.length === 0 || isSubmitting}
              onClick={submitOrder}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}