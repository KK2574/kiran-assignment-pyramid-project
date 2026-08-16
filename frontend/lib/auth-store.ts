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
  authError: string | null;
  loginAsGuest: () => Promise<void>;
  setSessionFromGoogle: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  dismissAuthError: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      authError: null,
      dismissAuthError: () => set({ authError: null }),
      loginAsGuest: async () => {
        try {
          // Free-tier hosts (e.g. Render) spin down when idle and can take
          // 30-60s to wake on the first request. Give it real room instead
          // of racing a short timeout and silently falling back.
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 70_000);
          const res = await fetch(`${API}/auth/guest`, { method: "POST", signal: controller.signal });
          clearTimeout(timeout);
          if (!res.ok) throw new Error(`guest login failed: ${res.status}`);
          const { user, token } = await res.json();
          set({ user, token, authError: null });
        } catch (err) {
          console.error("Pyramid: guest login could not reach the backend —", err);
          // Fall back to a client-only guest session so the UI is still
          // explorable, but say so plainly — nothing typed in this session
          // will actually be saved.
          set({
            user: { name: "Guest", email: "guest@pyramid.app", isGuest: true },
            token: null,
            authError:
              "Couldn't reach the server, so you're in offline demo mode — nothing you do will be saved.",
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