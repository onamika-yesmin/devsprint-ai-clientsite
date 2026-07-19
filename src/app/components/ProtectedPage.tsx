"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { serverSessionSnapshot, sessionSnapshot, subscribeSession } from "../../lib/api";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authToken = useSyncExternalStore(subscribeSession, sessionSnapshot, serverSessionSnapshot);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !authToken) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authToken, router, loading]);

  if (loading || !authToken) return <main className="page-shell"><div className="loading-card">Checking your session...</div></main>;
  return <>{children}</>;
}
