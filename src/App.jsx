import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import Login from "./pages/Login";
import OrderPanel from "./pages/OrderPanel";
import OrderManagement from "./pages/OrderManagement";
import MenuManagement from "./pages/MenuManagement";
import UserManagement from "./pages/UserManagement";
import ReportsAndAnalytics from "./pages/ReportsAndAnalytics";
import SystemSettings from "./pages/SystemSettings";
import PageNotFound from "./pages/PageNotFound";

import DashboardLayout from "./pages/DashboardLayout";
import { AuthProvider } from "./state/AuthProvider";
import { ProtectedRoute, RoleGuard } from "./routes/guards";
import DashboardToaster from "./components/DashboardToaster";
import Spinner from "./components/Spinner";
import { CurrencyProvider } from "./context/CurrencyContext";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen grid place-items-center bg-bg">
            <Spinner size={56} />
          </div>
        }
      >
        <AuthProvider>
          <CurrencyProvider>
            <Routes>
              {/* Public */}

              <Route path="/login" element={<Login />} />

              {/* Protected area */}
              <Route element={<ProtectedRoute />}>
                {/* Dashboard layout wrapper */}
                <Route element={<DashboardLayout />}>
                  {/* default route */}
                  <Route
                    index
                    element={<Navigate to="/order-panel" replace />}
                  />

                  {/* Cashier/Admin allowed */}
                  <Route path="/order-panel" element={<OrderPanel />} />
                  <Route
                    path="/order-management"
                    element={<OrderManagement />}
                  />
                  <Route path="/menu-management" element={<MenuManagement />} />

                  {/* Admin-only */}
                  <Route element={<RoleGuard allow={["admin"]} />}>
                    <Route
                      path="/user-management"
                      element={<UserManagement />}
                    />
                    <Route
                      path="/reports-and-analytics"
                      element={<ReportsAndAnalytics />}
                    />
                    <Route
                      path="/system-settings"
                      element={<SystemSettings />}
                    />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <DashboardToaster />
          </CurrencyProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}
