"use client";
import { Badge } from "@/components/ui/badge";

export function StockOutageTimeline({ outages, year }) {
  // Add null check for outages
  if (!outages || outages.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No outage data available
      </div>
    );
  }

  // Create a timeline of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create a map of outages by month
  const outageMap = {};
  outages.forEach((outage) => {
    if (outage && outage.month && outage.products) {
      outageMap[outage.month] = outage.products;
    }
  });

  return (
    <div className="relative pb-2 overflow-x-auto">
      <div className="flex min-w-max">
        {months.map((month, index) => {
          const hasOutage = outageMap[month] !== undefined;
          const productCount = hasOutage ? outageMap[month].length : 0;

          return (
            <div key={month} className="flex flex-col items-center mx-1 w-20">
              <div className="text-xs font-medium text-center">
                {month.substring(0, 3)}
              </div>
              <div
                className={`h-16 w-full rounded-md flex items-center justify-center mt-1 ${
                  hasOutage
                    ? "bg-red-100 border border-red-300"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                {hasOutage ? (
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-red-600">
                      {productCount}
                    </span>
                    <span className="text-xs text-red-600">products</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">No issues</span>
                )}
              </div>
              {hasOutage && outageMap[month] && (
                <div className="flex mt-1 gap-1">
                  {outageMap[month].map((product) => (
                    <Badge
                      key={`${month}-${product}`}
                      variant="outline"
                      className={`text-[10px] px-1 ${
                        product === "laptop"
                          ? "border-blue-500 text-blue-600"
                          : product === "mobile"
                          ? "border-green-500 text-green-600"
                          : "border-amber-500 text-amber-600"
                      }`}
                    >
                      {product.substring(0, 1).toUpperCase()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-[52px]"></div> */}
    </div>
  );
}
