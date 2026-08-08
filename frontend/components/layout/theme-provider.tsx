"use client";

import { useEffect } from "react";
import { ACCENT_HEX, useThemeStore } from "@/lib/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.setProperty("--accent", ACCENT_HEX[accent]);
  }, [mode, accent]);

  return <>{children}</>;
}
