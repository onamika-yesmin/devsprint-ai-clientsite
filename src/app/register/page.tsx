"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, apiBaseUrl, saveSession } from "../../lib/api";
export default function Register() { const [form,setForm]=useState({name:'',email:'',password:''}); const [error,setError]=useState(''); const router=useRouter(); async function submit(e:React.FormEvent){ e.preventDefault(); try { const data=await api<{token:string;user:{name:string;email:string}}>('/auth/register',{method:'POST',body:JSON.stringify(form)}); saveSession(data); router.push('/dashboard'); } catch(e) { setError(e instanceof Error?e.message:'Registration failed'); } } return <main className="auth">
  <form className="auth-form" onSubmit={submit}>
    <Link className="brand" href="/"><span>◆</span> DevSprint <i>AI</i></Link>
    <div>
      <div className="eyebrow">Start for free</div>
      <h1>Build with more clarity.</h1>
      <p>Create your workspace and turn your first idea into a plan.</p>
    </div>
    <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label>
    <label>Work email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label>
    <label>Password<input required minLength={8} type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/></label>
    <label>Profile image <input type="file" accept="image/*"/></label>
    {error&&<p className="form-error">{error}</p>}
    <button className="button primary wide">Create workspace</button>
    <button type="button" className="social" onClick={() => window.location.assign(`${apiBaseUrl}/auth/google`)}>G&nbsp;&nbsp; Continue with Google</button>
    <small>Already have an account? <Link href="/login">Sign in</Link></small>
  </form>
</main> }
