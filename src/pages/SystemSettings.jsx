// Add the curancy change for the indonesian prices

import { useEffect, useState } from "react";
import { Globe, Palette, Save } from "lucide-react";
import SelectMenu from "../components/SelectMenu";

import {
  getLanguageOptions,
  getCurrencyOptions,
  getTimezoneOptions,
  getThemeOptions,
} from "../constants/settings.constants";
import { useDarkMode } from "../context/DarkModeContext";
import { useTranslation } from "react-i18next";

export default function SystemSettings() {
  const [currency, setCurrency] = useState("usd");
  const [timezone, setTimezone] = useState("et");
  const { theme, setTheme } = useDarkMode();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
  }, [language, i18n]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">System Settings</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage basic system preferences
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Region */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-muted  grid place-items-center">
              <Globe className="h-5 w-5 text-text" />
            </div>
            <h2 className="text-sm font-semibold text-text">
              Language & Region
            </h2>
          </div>

          <div className="space-y-4">
            <SettingField label="Language">
              <SelectMenu
                value={language}
                onChange={setLanguage}
                options={getLanguageOptions(t)}
                className="w-full"
              />
            </SettingField>

            <SettingField label="Currency">
              <SelectMenu
                value={currency}
                onChange={setCurrency}
                options={getCurrencyOptions(t)}
                className="w-full"
              />
            </SettingField>

            <SettingField label="Timezone">
              <SelectMenu
                value={timezone}
                onChange={setTimezone}
                options={getTimezoneOptions(t)}
                className="w-full"
              />
            </SettingField>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center">
              <Palette className="h-5 w-5 text-text" />
            </div>
            <h2 className="text-sm font-semibold text-text">Appearance</h2>
          </div>

          <SettingField label="Theme">
            <SelectMenu
              value={theme}
              onChange={setTheme}
              options={getThemeOptions(t)}
              className="w-full"
            />
          </SettingField>
        </section>
      </div>
    </div>
  );
}

/* Small helper for consistent spacing */
function SettingField({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
