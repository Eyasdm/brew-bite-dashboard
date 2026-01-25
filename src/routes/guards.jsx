// src/routes/guards.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthProvider";

export function ProtectedRoute() {
  const { isAuthenticated, initLoading } = useAuth();
  const location = useLocation();

  if (initLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RoleGuard({ allow }) {
  const { role, initLoading, profileLoading } = useAuth();

  if (initLoading || profileLoading) return null;

  if (!role || !allow.includes(role)) {
    return <Navigate to="/order-panel" replace />;
  }

  return <Outlet />;
}
