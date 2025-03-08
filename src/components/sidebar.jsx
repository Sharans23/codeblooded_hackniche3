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
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Stock", href: "/stock", icon: Package },
    { name: "Transfers", href: "/transfers", icon: Box },
    { name: "Shipping", href: "/shipping", icon: Truck },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className={!open ? "hidden" : ""}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
      </div>

      {!open && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      )}

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

      <div className="border-t p-4">
        <div className={`flex items-center ${!open && "justify-center"}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          {open && (
            <div className="ml-3">
              <p className="text-sm font-medium">
                {user?.name || "Warehouse Manager"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.location || "North"} Warehouse
              </p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size={open ? "default" : "icon"}
          className="mt-4 w-full"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
