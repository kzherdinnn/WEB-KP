import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home, Hotels, RoomDetails, MyBookings } from "./pages";
import CustomPaymentPage from "./pages/CustomPaymentPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import { Navbar, HotelRegister, Loader } from "./components";
import AdminRedirect from "./components/AdminRedirect";
import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import AddRoom from "./pages/Admin/AddRoom";
import ListRoom from "./pages/Admin/ListRoom";
import UserManagement from "./pages/Admin/UserManagement";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const App = () => {
  const isAdmin = useLocation().pathname.includes("admin");
  const { showHotelReg } = useAppContext();
  return (
    <div>
      {!isAdmin && <Navbar />}
      {showHotelReg && <HotelRegister />}
      <AdminRedirect />
      <Toaster />
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bengkel" element={<Hotels />} />
        <Route path="/bengkel/:id" element={<RoomDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/payment" element={<CustomPaymentPage />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-rooms" element={<ListRoom />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
