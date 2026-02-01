import React, { createContext, useContext, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  colorScheme: ThemeMode;
  toggleColorScheme: () => void;
  setColorScheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useSystemColorScheme() as ThemeMode;
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme || "light");

  const toggleColorScheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{ colorScheme: mode, toggleColorScheme, setColorScheme: setMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
