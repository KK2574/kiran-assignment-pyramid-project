"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  title?: string;
  username?: string;
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  loginAsGuest: () => void;
  loginWithGoogle: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loginAsGuest: () =>
        set({
          user: {
            name: "Guest",
            email: "guest@pyramid.app",
            isGuest: true,
          },
        }),
      loginWithGoogle: (name, email) =>
        set({ user: { name, email, isGuest: false } }),
      logout: () => set({ user: null }),
      updateProfile: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
    }),
    { name: "pyramid-auth" }
  )
);
