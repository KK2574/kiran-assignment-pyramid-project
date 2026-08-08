"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";
export type AccentColor = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

interface ThemeState {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

export const ACCENT_HEX: Record<AccentColor, string> = {
  amber: "#f59e0b",
  blue: "#7c3aed", // matches figma "Blue" swatch shown as purple-ish
  pink: "#ec4899",
  rose: "#f43f5e",
  emerald: "#10b981",
  black: "#171717",
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      accent: "blue",
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
    }),
    { name: "pyramid-theme" }
  )
);
