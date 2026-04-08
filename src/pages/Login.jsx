import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useDarkMode } from "../context/DarkModeContext";
import { Moon, Sun, Coffee, Eye, EyeOff, Zap } from "lucide-react";
import Logo from "../components/Logo";
import { useTranslation } from "react-i18next";

// ─── Demo credentials ────────────────────────────────────────────────────────
const DEMO_EMAIL = "demo@brewbite.app";
const DEMO_PASSWORD = "demo1234";
// ─────────────────────────────────────────────────────────────────────────────

export default function Login() {
  const { t } = useTranslation();

  const { login, isAuthenticated, initLoading } = useAuth();
  const { isDark, toggleTheme } = useDarkMode();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  function fillDemo() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bg px-4">
      {/* ── Dark mode toggle ── */}
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

      {/* ── Login card ── */}
      <div className="w-full max-w-md space-y-3">
        {/* Demo access banner */}
        <div className="rounded-xl border border-primary/30 bg-primary-soft px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Coffee className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary">
                  Demo Access
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  <span className="font-mono">{DEMO_EMAIL}</span>
                  {" · "}
                  <span className="font-mono">{DEMO_PASSWORD}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium
                         bg-primary text-primary-foreground
                         px-3 py-1.5 rounded-lg hover:opacity-90 transition"
            >
              <Zap className="h-3 w-3" />
              Use Demo
            </button>
          </div>
        </div>

        {/* Main card */}
        <div className="w-full rounded-2xl border border-border bg-card shadow-lg p-8">
          {/* Logo + title */}
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
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
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm
                           text-text placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {t("form.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 pr-10 text-sm
                             text-text placeholder:text-text-muted
                             focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted
                             hover:text-text transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90
                         text-primary-foreground font-medium py-2.5 rounded-lg
                         transition disabled:opacity-60 mt-1"
            >
              {loading ? t("login.loading") : t("login.submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
