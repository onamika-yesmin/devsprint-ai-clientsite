"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, apiBaseUrl, saveSession, SessionUser } from "../../lib/api";
import { fileToDataUrl, initials } from "../../lib/images";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", avatarUrl: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const avatarUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, avatarUrl }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setError("");
      const data = await api<{ token: string; user: SessionUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      saveSession(data);
      router.push("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed");
    }
  }

  return <main className="auth">
    <form className="auth-form" onSubmit={submit}>
      <Link className="brand" href="/"><span>◆</span> DevSprint <i>AI</i></Link>
      <div>
        <div className="eyebrow">Start for free</div>
        <h1>Build with more clarity.</h1>
        <p>Create your workspace and turn your first idea into a plan.</p>
      </div>
      <div className="image-picker">
        <div className="avatar-preview">{form.avatarUrl ? <img src={form.avatarUrl} alt="" /> : <span>{initials(form.name)}</span>}</div>
        <label>Profile image<input type="file" accept="image/*" onChange={chooseImage} /></label>
      </div>
      <label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
      <label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label>
      <label>Password<input required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary wide">Create workspace</button>
      <button type="button" className="social" onClick={() => window.location.assign(`${apiBaseUrl}/auth/google`)}>G&nbsp;&nbsp; Continue with Google</button>
      <small>Already have an account? <Link href="/login">Sign in</Link></small>
    </form>
  </main>;
}
