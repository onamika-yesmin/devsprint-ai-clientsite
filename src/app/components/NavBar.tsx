"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { clearSession, currentUser, serverSessionSnapshot, sessionSnapshot, subscribeSession } from "../../lib/api";
import { initials } from "../../lib/images";

export function NavBar() {
  const router = useRouter();
  const authToken = useSyncExternalStore(subscribeSession, sessionSnapshot, serverSessionSnapshot);

  const signedIn = Boolean(authToken);
  const user = signedIn ? currentUser() : null;
  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return <header>
    <Link href="/" className="brand"><span>◆</span> DevSprint <i>AI</i></Link>
    <nav>
      {signedIn ? <>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/explore">Explore</Link>
        <Link href="/ai">AI Studio</Link>
        <Link href="/items/add">Add</Link>
        <Link href="/items/manage">Manage</Link>
        <Link href="/support">Support</Link>
      </> : <>
        <Link href="/explore">Explore</Link>
        <Link href="/about">About</Link>
        <Link href="/support">Support</Link>
      </>}
    </nav>
    <div className="nav-actions">
      {signedIn ? <>
        <Link className="nav-profile" href="/profile">
          <span className="nav-avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : initials(user?.name)}</span>
          <span>{user?.name?.split(" ")[0] ?? "Profile"}</span>
        </Link>
        <button className="nav-button" onClick={logout}>Sign out</button>
      </> : <>
        <Link href="/login">Sign in</Link>
        <Link className="button primary compact" href="/register">Get started</Link>
      </>}
    </div>
  </header>;
}
