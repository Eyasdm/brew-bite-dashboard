import { useEffect, useState } from "react";
import { Globe, Palette } from "lucide-react";
import SelectMenu from "../components/SelectMenu";

import {
  getLanguageOptions,
  getCurrencyOptions,
  getTimezoneOptions,
  getThemeOptions,
} from "../constants/settings.constants";

import { useDarkMode } from "../context/DarkModeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useTranslation } from "react-i18next";

export default function SystemSettings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useDarkMode();
  const { currency, setCurrency } = useCurrency();

  const [language, setLanguage] = useState(i18n.language || "en");
  const [timezone, setTimezone] = useState("et");

  /* ------------------ language ------------------ */
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
  }, [language, i18n]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold">
          {t("settings.title", "System Settings")}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {t("settings.subtitle", "Manage basic system preferences")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Language & Region */}
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
              <Globe className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold">
              {t("settings.languageRegion", "Language & Region")}
            </h2>
          </div>

          <div className="space-y-4">
            <SettingField label={t("settings.language", "Language")}>
              <SelectMenu
                value={language}
                onChange={setLanguage}
                options={getLanguageOptions(t)}
              />
            </SettingField>

            <SettingField label={t("settings.currency", "Currency")}>
              <SelectMenu
                value={currency}
                onChange={setCurrency}
                options={getCurrencyOptions(t)}
              />
            </SettingField>

            <SettingField label={t("settings.timezone", "Timezone")}>
              <SelectMenu
                value={timezone}
                onChange={setTimezone}
                options={getTimezoneOptions(t)}
              />
            </SettingField>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
              <Palette className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold">
              {t("settings.appearance", "Appearance")}
            </h2>
          </div>

          <SettingField label={t("settings.theme", "Theme")}>
            <SelectMenu
              value={theme}
              onChange={setTheme}
              options={getThemeOptions(t)}
            />
          </SettingField>
        </section>
      </div>
    </div>
  );
}

/* helper */
function SettingField({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
