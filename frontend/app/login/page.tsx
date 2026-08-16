"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore, GOOGLE_LOGIN_URL } from "@/lib/auth-store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { loginAsGuest } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  const authFailed = params.get("error") === "google_auth_failed";

  const handleGuest = async () => {
    setLoading(true);
    setSlow(false);
    // Free-tier backends often need 30-60s to wake up from a cold start —
    // surface that after a few seconds instead of leaving the button
    // looking frozen with no explanation.
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    await loginAsGuest();
    clearTimeout(slowTimer);
    router.push("/tasks");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-2xl bg-[#141414] flex items-center justify-center">
          <PyramidLogo size={19} />
        </div>
        <span className="font-semibold">Pyramid</span>
      </div>

      <div
        className="w-full max-w-[480px] border rounded-2xl p-8"
        style={{ borderColor: "var(--border)", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
      >
        <h1 className="text-2xl font-semibold text-center mb-1.5">Let&apos;s get back on track</h1>
        <p className="text-center text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Enter your email below to login to your account.
        </p>

        {authFailed && (
          <div
            className="text-xs rounded-lg px-3 py-2 mb-4 text-center"
            style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
          >
            Google sign-in was cancelled or denied. You can try again, or continue as a guest.
          </div>
        )}

        <button
          onClick={handleGuest}
          disabled={loading}
          className="w-full rounded-full py-3 text-sm font-medium mb-2.5 hover:opacity-90 transition disabled:opacity-50"
          style={{ background: "#18181b", color: "#fff" }}
        >
          {loading ? "Signing in…" : "Continue as Guest"}
        </button>
        {slow && (
          <p className="text-xs text-center -mt-1 mb-2.5" style={{ color: "var(--text-muted)" }}>
            Waking up the server — this can take up to a minute on a cold start.
          </p>
        )}

        {/* Real OAuth redirect — must be a full page navigation, not a fetch,
            since Google needs to show its own consent screen. */}
        <a
          href={GOOGLE_LOGIN_URL}
          className="w-full border rounded-full py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition"
          style={{ borderColor: "var(--border)" }}
        >
          <GoogleIcon /> Login with Google
        </a>
      </div>

      <p className="text-xs text-center mt-6 max-w-[380px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">Terms of Service</a> and{" "}
        <a href="#" className="underline">Privacy Policy</a>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function PyramidLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* outer silhouette */}
      <path
        d="M12 3.5L4.8 16.2L16.8 18.5L12 3.5Z"
        stroke="white"
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* inner edge: apex down to a point on the base, giving the left face */}
      <path
        d="M12 3.5L9 16.6"
        stroke="white"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.38a4.6 4.6 0 01-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.53z"
        fill="currentColor"
      />
      <path
        d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0012 22z"
        fill="currentColor"
      />
      <path
        d="M6.41 13.91a5.99 5.99 0 010-3.82V7.5H3.07a10 10 0 000 8.99l3.34-2.58z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0012 2a10 10 0 00-8.93 5.5l3.34 2.59C7.2 7.74 9.4 5.98 12 5.98z"
        fill="currentColor"
        fillOpacity="0.8"
      />
    </svg>
  );
}