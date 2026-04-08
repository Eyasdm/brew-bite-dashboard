import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-text gap-4">
      <span className="text-6xl">☕</span>
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-text-muted text-sm">{t("errors.pageNotFound")}</p>
      <button
        onClick={() => navigate("/order-panel")}
        className="mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        {t("actions.goHome") || "Go to Dashboard"}
      </button>
    </div>
  );
}
