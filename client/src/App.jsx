import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home, Spareparts, SparepartDetails, Services, ServiceDetails, Booking, MyBookings, Cart } from "./pages";
import PaymentPage from "./pages/PaymentPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import { Navbar, Loader } from "./components";
import AdminRedirect from "./components/AdminRedirect";
import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ManageSpareparts from "./pages/Admin/ManageSpareparts";
import ManageServices from "./pages/Admin/ManageServices";
import ManageTechnicians from "./pages/admin/ManageTechnicians";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const App = () => {
  const isAdmin = useLocation().pathname.includes("admin");

  return (
    <div>
      {!isAdmin && <Navbar />}
      <AdminRedirect />
      <Toaster />
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Workshop Routes */}
        <Route path="/spareparts" element={<Spareparts />} />
        <Route path="/spareparts/:id" element={<SparepartDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Other Routes */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="spareparts" element={<ManageSpareparts />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="technicians" element={<ManageTechnicians />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
