import { LogOut, Moon, PanelLeft, Sun } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../state/auth";
import Sidebar from "../components/Sidebar";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function DashboardLayout() {
  const { t } = useTranslation();

  const { user, profile, role, logout } = useAuth();
  const { isDark, toggleTheme } = useDarkMode();

  const sidebarUser = user
    ? {
        email: user.email,
        name: profile?.full_name || t("defaultAdminName"),
        avatar: profile?.avatar_url || null,
        role: role,
      }
    : null;

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`grid min-h-screen bg-bg text-text ${
        sidebarOpen ? "grid-cols-[260px_1fr]" : "grid-cols-[0px_1fr]"
      }`}
    >
      <Sidebar user={sidebarUser} />

      <div className="grid grid-rows-[60px_1fr]">
        <header className="flex items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen((s) => !s)}
              className="h-9 w-9 grid place-items-center rounded-lg bg-card text-text-muted hover:bg-muted hover:text-text transition"
              aria-label={t("toggleSidebar")}
              title={t("toggleSidebar")}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card text-text-muted hover:bg-muted hover:text-text transition"
              aria-label={t("toggleTheme")}
              title={t("toggleTheme")}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card text-text-muted hover:bg-muted hover:text-text transition"
              aria-label={t("logout")}
              title={t("logout")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="p-4 bg-card">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
