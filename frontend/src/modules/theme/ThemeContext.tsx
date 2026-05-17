import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDarkState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("theme-dark", dark);
    document.body.classList.toggle("theme-light", !dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  function toggle() {
    setDarkState((d) => !d);
  }

  function setDark(v: boolean) {
    setDarkState(v);
  }

  return <ThemeContext.Provider value={{ dark, toggle, setDark }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
