import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface DarkModeContextValue {
  theme: string;
  isDark: boolean;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

interface DarkModeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: string;
}

export function DarkModeProvider({
  children,
  storageKey = "bb_theme",
  defaultTheme = "light",
}: DarkModeProviderProps) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved || defaultTheme;
  });

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

export function useDarkMode(): DarkModeContextValue {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
