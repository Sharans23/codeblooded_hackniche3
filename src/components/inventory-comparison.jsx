"use client";

import { ArrowDown, ArrowUp, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function InventoryComparison() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>FIFO vs LIFO Comparison</CardTitle>
          <CardDescription>
            Understanding the key differences between inventory valuation
            methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">
                  FIFO (First-In, First-Out)
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        FIFO assumes that the oldest inventory items are sold
                        first, which often aligns with actual physical inventory
                        flow.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Higher ending inventory value</strong> during
                    inflation as newer, more expensive items remain in stock
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowDown className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Lower COGS</strong> as older, typically less
                    expensive items are expensed first
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Higher reported profits</strong> during inflation
                    due to lower COGS
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Higher tax liability</strong> due to higher reported
                    profits
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Better matches current market value</strong> of
                    inventory on balance sheet
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">
                  LIFO (Last-In, First-Out)
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        LIFO assumes that the newest inventory items are sold
                        first, which may not match physical flow but can have
                        tax advantages.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <ArrowDown className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Lower ending inventory value</strong> during
                    inflation as older, less expensive items remain in stock
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Higher COGS</strong> as newer, typically more
                    expensive items are expensed first
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowDown className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Lower reported profits</strong> during inflation due
                    to higher COGS
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowDown className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Lower tax liability</strong> due to lower reported
                    profits
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span>
                    <strong>Better matches current replacement cost</strong> in
                    income statement
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Practical Example: Rising Prices Scenario</CardTitle>
          <CardDescription>
            How FIFO and LIFO methods affect financial statements during price
            inflation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jan 5</TableCell>
                <TableCell>Purchase</TableCell>
                <TableCell>100</TableCell>
                <TableCell>$10.00</TableCell>
                <TableCell>$1,000.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Feb 10</TableCell>
                <TableCell>Purchase</TableCell>
                <TableCell>150</TableCell>
                <TableCell>$12.00</TableCell>
                <TableCell>$1,800.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mar 15</TableCell>
                <TableCell>Purchase</TableCell>
                <TableCell>200</TableCell>
                <TableCell>$15.00</TableCell>
                <TableCell>$3,000.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mar 20</TableCell>
                <TableCell>Sale</TableCell>
                <TableCell>300</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">FIFO Calculation</h3>
              <div className="rounded-md border p-4 space-y-2 text-sm">
                <p>
                  <strong>Cost of Goods Sold (COGS):</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>100 units @ $10.00 = $1,000.00</li>
                  <li>150 units @ $12.00 = $1,800.00</li>
                  <li>50 units @ $15.00 = $750.00</li>
                </ul>
                <p>
                  <strong>Total COGS: $3,550.00</strong>
                </p>
                <p className="pt-2">
                  <strong>Ending Inventory:</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>150 units @ $15.00 = $2,250.00</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">LIFO Calculation</h3>
              <div className="rounded-md border p-4 space-y-2 text-sm">
                <p>
                  <strong>Cost of Goods Sold (COGS):</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>200 units @ $15.00 = $3,000.00</li>
                  <li>100 units @ $12.00 = $1,200.00</li>
                </ul>
                <p>
                  <strong>Total COGS: $4,200.00</strong>
                </p>
                <p className="pt-2">
                  <strong>Ending Inventory:</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>50 units @ $12.00 = $600.00</li>
                  <li>100 units @ $10.00 = $1,000.00</li>
                </ul>
                <p>
                  <strong>Total Ending Inventory: $1,600.00</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Financial Impact:</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>FIFO:</strong> Lower COGS ($3,550) leads to higher gross
                profit and higher income taxes.
              </li>
              <li>
                <strong>LIFO:</strong> Higher COGS ($4,200) leads to lower gross
                profit and lower income taxes.
              </li>
              <li>
                <strong>Difference:</strong> $650 in COGS impacts both profit
                reporting and tax liability.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
