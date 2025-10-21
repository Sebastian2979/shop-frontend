import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import EditProductForm from "./myComponents/EditProductForm";
import ProtectedRoute from "./myComponents/ProtectedRoute";
import NewProductForm from "./myComponents/NewProductForm";
// Pages
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./pages/Layout";
import NotAllowed from "./pages/NotAllowed";
import Home from "./pages/Home";
import Products from "./pages/products/Products";
import Cart from "./pages/Cart";
import ProductPage from "./pages/products/ProductPage";
import StripeSuccessPage from "./pages/StripeSuccessPage";
import OrderPage from "./pages/orders/OrderPage";
import CategoryPage from "./pages/CategoryPage";

function App() {

  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout/success" element={<StripeSuccessPage />} />
        { /* Produkte-Seite mit verschachtelten Routen */}
        <Route path="products" element={<Outlet />}>
          <Route path=":id" element={<ProductPage />} />
        </Route>

        {/* Admin-Bereich geschützt */}
        <Route
          path="admin"
          element={
            <ProtectedRoute
              redirectPath="/login"
              isAllowed={!!user && user.role === "admin"}
              isLoading={loading}
            >
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="new" element={<NewProductForm />} />
            <Route path=":id" element={<EditProductForm />} />
          </Route>
          <Route path="orders" element={<OrderPage />} />
          <Route path="category" element={<CategoryPage />} />
        </Route>

        <Route path="notAllowed" element={<NotAllowed />} />
        <Route path="*" element={<h1>404 Seite nicht gefunden!</h1>} />
      </Route>

      {/* Seite ohne Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
