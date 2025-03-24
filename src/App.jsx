import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Stock from "./pages/stocks";
import ProductForm from "./pages/createProduct";
import Login from "./pages/login";
import ScanPage from "./pages/scan";
import Settings from "./pages/settings";
import CreateOrder from "./pages/createorder";
import ClientDashboard from "./pages/client-dashboard";
import SalesPrediction from "./lib/machineLearning";
import Loginpage from "./components/loginpage";
import InventoryAnalyzer from "./pages/inventory-analyzer";
import Analysis from "./pages/analysis";
import FifoLifo from "./pages/fifo-lifo-dashboard";
import Map from "./pages/map";

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
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="warehouse-dashboard" element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="createproduct" element={<ProductForm />} />
        <Route path="scanqr" element={<ScanPage />} />
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="createorder" element={<CreateOrder />} />
        <Route path="client-dashboard" element={<ClientDashboard />} />
        {/* <Route path="machineLearning" element={<SalesPrediction />} /> */}
        {/* <Route path="loginpage" element={<Loginpage />} /> */}
        <Route path="analysis" element={<Analysis />} />
        <Route path="map" element={<Map />} />
        <Route path="inventory-analysis" element={<InventoryAnalyzer />} />
        <Route path="fifo-lifo" element={<FifoLifo/>} />
        <Route
          path="inventory-analyzer"
          element={<InventoryAnalyzer apiKey={GEMINI_API_KEY} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
