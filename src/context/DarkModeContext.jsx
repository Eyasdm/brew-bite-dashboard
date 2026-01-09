import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DarkModeContext = createContext(null);

export function DarkModeProvider({
  children,
  storageKey = "bb_theme",
  defaultTheme = "light",
}) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved || defaultTheme;
  });

  // apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
