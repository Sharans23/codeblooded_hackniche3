"use client";

import { useState } from "react";
import { Clock, Download, Filter, Package, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InventoryTransactions() {
  const [transactions, setTransactions] = useState([
    {
      id: "TRX-001",
      date: "2023-04-15",
      type: "Purchase",
      product: "Premium Laptop",
      productId: "P001",
      quantity: 30,
      unitCost: 900.0,
      totalCost: 27000.0,
      method: "FIFO",
    },
    {
      id: "TRX-002",
      date: "2023-04-18",
      type: "Sale",
      product: "Premium Laptop",
      productId: "P001",
      quantity: 10,
      unitCost: 800.0,
      totalCost: 8000.0,
      method: "FIFO",
    },
    {
      id: "TRX-003",
      date: "2023-04-25",
      type: "Purchase",
      product: "Wireless Headphones",
      productId: "P002",
      quantity: 50,
      unitCost: 70.0,
      totalCost: 3500.0,
      method: "FIFO",
    },
    {
      id: "TRX-004",
      date: "2023-05-02",
      type: "Purchase",
      product: "Office Desk Chair",
      productId: "P003",
      quantity: 15,
      unitCost: 125.0,
      totalCost: 1875.0,
      method: "FIFO",
    },
    {
      id: "TRX-005",
      date: "2023-05-10",
      type: "Sale",
      product: "Wireless Headphones",
      productId: "P002",
      quantity: 30,
      unitCost: 60.0,
      totalCost: 1800.0,
      method: "FIFO",
    },
    {
      id: "TRX-006",
      date: "2023-05-15",
      type: "Sale",
      product: "Office Desk Chair",
      productId: "P003",
      quantity: 10,
      unitCost: 110.0,
      totalCost: 1100.0,
      method: "FIFO",
    },
    {
      id: "TRX-007",
      date: "2023-05-20",
      type: "Purchase",
      product: "Premium Laptop",
      productId: "P001",
      quantity: 25,
      unitCost: 850.0,
      totalCost: 21250.0,
      method: "FIFO",
    },
    {
      id: "TRX-008",
      date: "2023-05-28",
      type: "Sale",
      product: "Office Desk Chair",
      productId: "P003",
      quantity: 5,
      unitCost: 110.0,
      totalCost: 550.0,
      method: "FIFO",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProduct =
      productFilter === "all" || transaction.productId === productFilter;

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesProduct && matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Inventory Transactions</CardTitle>
            <CardDescription>
              View all inventory movements with cost calculations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="P001">Premium Laptop</SelectItem>
              <SelectItem value="P002">Wireless Headphones</SelectItem>
              <SelectItem value="P003">Office Desk Chair</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Purchase">Purchases</SelectItem>
              <SelectItem value="Sale">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.type === "Purchase"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {transaction.type === "Purchase" ? (
                        <Package className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.product}</TableCell>
                  <TableCell className="text-right">
                    {transaction.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    ${transaction.unitCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${transaction.totalCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-2">
                          {transaction.method}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            {transaction.method === "FIFO"
                              ? "First-In, First-Out: Oldest inventory sold first"
                              : "Last-In, First-Out: Newest inventory sold first"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
