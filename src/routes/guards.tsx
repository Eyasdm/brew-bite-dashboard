import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthProvider";
import Spinner from "../components/Spinner";
import type { UserRole } from "../types";

export function ProtectedRoute() {
  const { isAuthenticated, initLoading } = useAuth();
  const location = useLocation();

  if (initLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

interface RoleGuardProps {
  allow: UserRole[];
}

export function RoleGuard({ allow }: RoleGuardProps) {
  const { role, initLoading, profileLoading } = useAuth();

  if (initLoading || profileLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-bg">
        <Spinner size={40} />
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/order-panel" replace />;
  }

  return <Outlet />;
}
