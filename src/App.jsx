// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductList from "./pages/product/ProductList";
import ProductDetail from "./pages/product/ProductDetail";
import OrderList from "./pages/order/OrderList";
import OrderDetail from "./pages/order/OrderDetail";
import FinancialDashboard from "./pages/financial/FinancialDashboard";
import CMSDashboard from "./pages/cms/CMSDashboard";
import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import UserManagement from "./pages/user/UserManagement";
import NotFound from "./pages/NotFound";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      <Route element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/financial" element={<FinancialDashboard />} />
        <Route path="/cms" element={<CMSDashboard />} />
        <Route path="/marketing" element={<MarketingDashboard />} />
        <Route path="/users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
