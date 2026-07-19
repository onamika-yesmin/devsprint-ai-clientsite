"use client";
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveSession } from '../../../lib/api';
function CompleteAuth() { const params = useSearchParams(); const router = useRouter(); useEffect(() => { const token = params.get('token'); const email = params.get('email'); const name = params.get('name'); if (token && email && name) { saveSession({ token, user: { email, name } }); router.replace('/dashboard'); } else router.replace('/login?error=google_oauth_failed'); }, [params, router]); return <main className="auth"><p>Completing secure sign-in…</p></main>; }
export default function AuthCallback() { return <Suspense fallback={<main className="auth"><p>Completing secure sign-in…</p></main>}><CompleteAuth /></Suspense>; }
