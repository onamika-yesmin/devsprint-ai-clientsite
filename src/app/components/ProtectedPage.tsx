"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { sessionSnapshot, subscribeSession } from "../../lib/api";

const checkingSessionSnapshot = () => "__checking_session__";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authToken = useSyncExternalStore(subscribeSession, sessionSnapshot, checkingSessionSnapshot);
  const checkingSession = authToken === "__checking_session__";

  useEffect(() => {
    if (!checkingSession && !authToken) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [authToken, checkingSession, router]);

  if (checkingSession || !authToken) return <main className="page-shell"><div className="loading-card">Checking your session...</div></main>;
  return <>{children}</>;
}
