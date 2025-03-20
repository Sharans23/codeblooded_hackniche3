import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  Box,
  FileText,
  Home,
  LogOut,
  Package,
  Settings,
  Truck,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";
import { useEffect, useState } from "react";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const userRole = localStorage.getItem("userRole") || "client";

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const adminNavigation = [
    { name: "Dashboard", href: "/warehouse-dashboard", icon: Home },
    { name: "Stock", href: "/stock", icon: Package },
    { name: "Create Product", href: "/createproduct", icon: Settings },
    { name: "Scan QR", href: "/scanqr", icon: FileText },
    { name: "Fifo-Lifo", href: "/fifo-lifo", icon: Box },
  ];

  const clientNavigation = [
    { name: "Dashboard", href: "/client-dashboard", icon: Home },
    { name: "Orders", href: "/createorder", icon: Box },
    { name: "Analysis", href: "/analysis", icon: BarChart2 },
    { name: "Map", href: "/map", icon: Truck },
 
  ];

  const navigation = userRole === "admin" ? adminNavigation : clientNavigation;

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } relative flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out`}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div
          className={`flex items-center ${!open && "justify-center w-full"}`}
        >
          <Package className="h-6 w-6 text-primary" />
          {open && (
            <span className="ml-2 text-lg font-semibold">Inventory</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center rounded-md px-3 py-2 text-sm font-medium
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  ${!open && "justify-center px-2"}
                `}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {open && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4 mt-auto flex flex-col space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
          {open && (
            <span className="ml-2">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          size={open ? "default" : "icon"}
          className="w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
