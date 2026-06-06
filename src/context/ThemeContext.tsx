import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors, lightColors, ColorsType } from "@/constants/colors";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  tema: ThemeMode;
  colors: ColorsType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<ThemeMode>("dark");

  useEffect(() => {
    AsyncStorage.getItem("tema").then(t => {
      if (t === "light" || t === "dark") setTema(t);
    });
  }, []);

  function toggleTheme() {
    const novoTema = tema === "light" ? "dark" : "light";
    setTema(novoTema);
    AsyncStorage.setItem("tema", novoTema);
  }

  const colors = tema === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ tema, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
