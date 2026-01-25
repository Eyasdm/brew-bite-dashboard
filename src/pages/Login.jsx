import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDarkMode } from "../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";
import Logo from "../components/Logo";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();

  const { login, isAuthenticated, initLoading } = useAuth();
  const { isDark, toggleTheme } = useDarkMode();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initLoading && isAuthenticated) {
      navigate(location.state?.from || "/order-panel", { replace: true });
    }
  }, [isAuthenticated, initLoading, navigate, location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      toast.error(err.message || t("errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg px-4">
      {/* 🌙 Dark mode toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 h-9 w-9 grid place-items-center
                   rounded-lg border border-border bg-card
                   text-text-muted hover:bg-muted hover:text-text transition"
        aria-label={t("actions.toggleTheme")}
        title={t("actions.toggleTheme")}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* 🧾 Login Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-text">
          Brew-Bite
        </h1>
        <p className="text-sm text-center text-text-muted mt-1">
          {t("login.subtitle")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t("form.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm
                         text-text placeholder:text-text-muted
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t("form.password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm
                         text-text placeholder:text-text-muted
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:opacity-90
                       text-primary-foreground font-medium py-2.5 rounded-lg
                       transition disabled:opacity-60"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
