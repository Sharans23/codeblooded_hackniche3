import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { useAuth } from "../contexts/auth-context";

export default function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-y-hidden" style={{height: '375vh'}}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col overflow-y-hidden">
        <main className="flex-1 overflow-y-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
