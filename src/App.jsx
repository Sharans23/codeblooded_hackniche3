import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Stock from "./pages/stocks";
import Login from "./pages/login";
import Settings from "./pages/settings";
import CreateOrder from "./pages/createorder";
import ClientDashboard from "./pages/client-dashboard";
import SalesPrediction from "./lib/machineLearning";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="settings" element={<Settings />} />
        <Route path="createorder" element={<CreateOrder />} />
        <Route path="client-dashboard" element={<ClientDashboard />} />
        <Route path="machineLearning" element={<SalesPrediction />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
