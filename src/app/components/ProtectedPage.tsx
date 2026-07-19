"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { serverSessionSnapshot, sessionSnapshot, subscribeSession } from "../../lib/api";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authToken = useSyncExternalStore(subscribeSession, sessionSnapshot, serverSessionSnapshot);

  useEffect(() => {
    if (!authToken) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authToken, router]);

  if (!authToken) return <main className="page-shell"><div className="loading-card">Checking your session...</div></main>;
  return <>{children}</>;
}
