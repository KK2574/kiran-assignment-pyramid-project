"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  title?: string;
  username?: string;
  avatarUrl?: string;
  isGuest: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loginAsGuest: () => Promise<void>;
  setSessionFromGoogle: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loginAsGuest: async () => {
        try {
          const res = await fetch(`${API}/auth/guest`, { method: "POST" });
          if (!res.ok) throw new Error("guest login failed");
          const { user, token } = await res.json();
          set({ user, token });
        } catch {
          // Backend unreachable (e.g. static preview) — fall back to a
          // client-only guest session so the UI is still explorable.
          set({
            user: { name: "Guest", email: "guest@pyramid.app", isGuest: true },
            token: null,
          });
        }
      },
      setSessionFromGoogle: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateProfile: (patch) =>
        set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
    }),
    { name: "pyramid-auth" }
  )
);

export const GOOGLE_LOGIN_URL = `${API}/auth/google`;
