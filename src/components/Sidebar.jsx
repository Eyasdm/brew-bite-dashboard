import {
  BarChart3,
  LayoutGrid,
  Settings,
  ShoppingCart,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

const navLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition text-text-strong ",
    "text-sidebar-muted hover:bg-sidebar-active hover:text-sidebar-text",
    isActive && "bg-sidebar-active text-sidebar-text font-medium",
  ]
    .filter(Boolean)
    .join(" ");

function Sidebar({ user }) {
  const { t } = useTranslation();

  return (
    <aside className="border-r border-sidebar-border text-sidebar-text flex flex-col">
      <div>
        <header className="py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-4">
            <Logo />

            <div className="flex gap-1 flex-col">
              <h2 className="text-lg font-medium leading-5">Brew-Bite</h2>
              <p className="text-sm text-sidebar-muted">
                {t("sidebar.subtitle")}
              </p>
            </div>
          </div>
        </header>

        <nav className="grid gap-2 pb-6 pt-4 px-4">
          <NavLink to="/order-panel" className={navLinkClass}>
            <LayoutGrid className="h-4 w-4" />
            {t("sidebar.orderPanel")}
          </NavLink>

          <NavLink to="/order-management" className={navLinkClass}>
            <ShoppingCart className="h-4 w-4" />
            {t("sidebar.orderManagement")}
          </NavLink>

          <NavLink to="/menu-management" className={navLinkClass}>
            <UtensilsCrossed className="h-4 w-4" />
            {t("sidebar.menuManagement")}
          </NavLink>

          {user?.role === "admin" && (
            <>
              <NavLink to="/user-management" className={navLinkClass}>
                <Users className="h-4 w-4" />
                {t("sidebar.userManagement")}
              </NavLink>

              <NavLink to="/reports-and-analytics" className={navLinkClass}>
                <BarChart3 className="h-4 w-4" />
                {t("sidebar.reports")}
              </NavLink>

              <NavLink to="/system-settings" className={navLinkClass}>
                <Settings className="h-4 w-4" />
                {t("sidebar.systemSettings")}
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={t("sidebar.userAvatar")}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}

          {/* User Info */}
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-sidebar-foreground">
              {user?.name || t("sidebar.defaultUser")}
            </span>
            <span className="text-xs text-sidebar-muted">
              {user?.email || "admin@smartcafe.com"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
