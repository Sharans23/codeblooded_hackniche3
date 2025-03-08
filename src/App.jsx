import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Stock from "./pages/stocks";
import ProductForm from "./pages/createProduct";
import Login from "./pages/login";
import GeneratePage from "./pages/generate";
import ScanPage from "./pages/scan";
import Settings from "./pages/settings";
import CreateOrder from "./pages/createorder";
import ClientDashboard from "./pages/client-dashboard";
import OrderForm from "./components/whatsapp";
import SalesPrediction from "./lib/machineLearning";
import Loginpage from "./components/loginpage";
import InventoryAnalyzer from "./pages/inventory-analyzer";
import Analysis from "./pages/analysis";

function App() {
  const GEMINI_API_KEY = "AIzaSyDeeVJKQRiSrxUwRqXJ3zCbEVd9e5gSSHM";
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
        <Route path="warehouse-dashboard" element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="createproduct" element={<ProductForm />} />
        <Route path="scanqr" element={<ScanPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="createorder" element={<CreateOrder />} />
        <Route path="client-dashboard" element={<ClientDashboard />} />
        <Route path="order-form" element={<OrderForm />} />
        <Route path="machineLearning" element={<SalesPrediction />} />
        <Route path="login" element={<Login />} />
        <Route path="loginpage" element={<Loginpage />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="inventory-analysis" element={<InventoryAnalyzer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="inventory-analyzer"
          element={<InventoryAnalyzer apiKey={GEMINI_API_KEY} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
