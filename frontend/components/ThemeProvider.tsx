"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export default function ThemeProvider({
  children,
  initialTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] =
    useState<Theme>(initialTheme);

  useEffect(() => {
    const savedTheme =
      document.cookie
        .split("; ")
        .find((row) =>
          row.startsWith("theme=")
        )
        ?.split("=")[1];

    if (
      savedTheme === "dark" ||
      savedTheme === "light"
    ) {
      setThemeState(savedTheme);

      document.documentElement.dataset.theme =
        savedTheme;
    } else {
      document.documentElement.dataset.theme =
        initialTheme;
    }
  }, [initialTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    document.documentElement.dataset.theme =
      newTheme;

    document.cookie =
      `theme=${newTheme}; max-age=31536000; path=/; SameSite=Lax`;
  };

  const toggleTheme = () => {
    setTheme(
      theme === "light"
        ? "dark"
        : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}