"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

function CallbackHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSessionFromGoogle } = useAuthStore();

  useEffect(() => {
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token && email) {
      setSessionFromGoogle(
        { name: name ?? "Google User", email, isGuest: false },
        token
      );
      router.replace("/tasks");
    } else {
      // Missing params means the OAuth handshake didn't complete correctly
      router.replace("/login");
    }
  }, [params, router, setSessionFromGoogle]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Signing you in…
      </p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}
