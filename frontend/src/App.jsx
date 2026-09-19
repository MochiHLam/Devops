import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import AddProduct from "./pages/seller/AddProduct";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Global Navbar */}
          <Navbar />

          <Routes>
            {/* ── Public ──────────────────────────────── */}
            <Route path="/"            element={<Home />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* ── Authenticated user ───────────────────── */}
            <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            {/* ── Seller ──────────────────────────────── */}
            <Route path="/seller"
              element={<ProtectedRoute roles={["seller","admin"]}><SellerDashboard /></ProtectedRoute>} />
            <Route path="/seller/products"
              element={<ProtectedRoute roles={["seller","admin"]}><SellerProducts /></ProtectedRoute>} />
            <Route path="/seller/products/add"
              element={<ProtectedRoute roles={["seller","admin"]}><AddProduct /></ProtectedRoute>} />

            {/* ── Admin ───────────────────────────────── */}
            <Route path="/admin"
              element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users"
              element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          </Routes>

          {/* Global toast notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: "!text-sm !font-sans",
              success: { iconTheme: { primary: "#27ae60", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#e74c3c", secondary: "#fff" } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
