"use client";

import { useRouter } from "next/navigation";
import { Triangle } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsGuest, loginWithGoogle } = useAuthStore();

  const handleGuest = () => {
    loginAsGuest();
    router.push("/tasks");
  };

  const handleGoogle = () => {
    // Real OAuth would redirect to the backend's /auth/google endpoint.
    loginWithGoogle("Dexter", "dexter@gmail.com");
    router.push("/tasks");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center">
          <Triangle size={14} className="text-white fill-white" />
        </div>
        <span className="font-semibold">Pyramid</span>
      </div>

      <div className="w-full max-w-[480px] border rounded-2xl p-8" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-2xl font-semibold text-center mb-2">Let&apos;s get back on track</h1>
        <p className="text-center text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Enter your email below to login to your account.
        </p>

        <button
          onClick={handleGuest}
          className="w-full bg-black text-white rounded-full py-3 text-sm font-medium mb-3 hover:opacity-90 transition"
        >
          Continue as Guest
        </button>

        <button
          onClick={handleGoogle}
          className="w-full border rounded-full py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition"
          style={{ borderColor: "var(--border)" }}
        >
          <GoogleIcon /> Login with Google
        </button>
      </div>

      <p className="text-xs text-center mt-6 max-w-[380px]" style={{ color: "var(--text-muted)" }}>
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">Terms of Service</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.95l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
