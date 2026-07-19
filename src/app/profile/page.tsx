"use client";

import { useState } from "react";
import { currentUser, saveSession, SessionUser } from "../../lib/api";
import { ProtectedPage } from "../components/ProtectedPage";

export default function Profile() {
  const user = currentUser();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [success, setSuccess] = useState(false);

  const saveProfile = () => {
    if (user) {
      const updatedUser: SessionUser = { ...user, name, email };
      saveSession({ token: localStorage.getItem("devsprint_token")!, user: updatedUser });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <ProtectedPage>
      <main className="page-shell">
        <div className="page-heading">
          <div className="eyebrow">Your Profile</div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="form-page" style={{ marginTop: '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }}>
            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button className="button primary">Save changes</button>
            {success && <p style={{ color: 'var(--green)' }}>Profile updated successfully!</p>}
          </form>
        </div>
      </main>
    </ProtectedPage>
  );
}
