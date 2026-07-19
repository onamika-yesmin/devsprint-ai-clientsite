"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, apiBaseUrl, saveSession } from "../../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const nextPath = () => new URLSearchParams(window.location.search).get("next") || "/dashboard";

  const signIn = async (demo = false) => {
    try {
      setError("");
      const data = await api<{ token: string; user: { name: string; email: string } }>(demo ? "/auth/demo" : "/auth/login", { method: "POST", body: JSON.stringify(demo ? {} : { email, password }) });
      saveSession(data);
      router.push(nextPath());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    }
  };

  const useDemo = () => {
    setEmail("demo@devsprint.ai");
    setPassword("demo12345");
    signIn(true);
  };

  return <main className="auth"><form onSubmit={(e) => { e.preventDefault(); signIn(); }}>
    <Link className="brand" href="/"><span>◆</span> DevSprint <i>AI</i></Link>
    <div><div className="eyebrow">Welcome back</div><h1>Sign in to your workspace.</h1><p>Pick up exactly where your last sprint left off.</p></div>
    <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" /></label>
    <label>Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></label>
    {error ? <p className="form-error">{error}</p> : null}
    <button className="button primary wide">Sign in</button>
    <button type="button" className="social" onClick={() => window.location.assign(`${apiBaseUrl}/auth/google`)}>G&nbsp;&nbsp; Continue with Google</button>
    <button type="button" className="demo" onClick={useDemo}>Use demo account</button>
    <small>New to DevSprint? <Link href="/register">Create an account</Link></small>
  </form></main>;
}
