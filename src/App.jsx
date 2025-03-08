import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Stock from "./pages/stocks";
import ProductForm from "./pages/createProduct";
import Login from "./pages/login";
import GeneratePage from "./pages/generate";
import ScanPage from "./pages/scan";

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
        <Route path="createproduct" element={<ProductForm />} />
        <Route path="scanqr" element={<ScanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
