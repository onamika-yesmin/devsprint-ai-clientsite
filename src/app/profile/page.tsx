"use client";

import { useState } from "react";
import { api, currentUser, saveSession, SessionUser, token } from "../../lib/api";
import { fileToDataUrl, initials } from "../../lib/images";
import { ProtectedPage } from "../components/ProtectedPage";

export default function Profile() {
  const user = currentUser();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      setAvatarUrl(await fileToDataUrl(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    }
  }

  async function saveProfile() {
    if (!user) return;
    try {
      setError("");
      const updatedUser = await api<{ user: SessionUser }>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ name, email, avatarUrl }),
      }).then((response) => response.user).catch(() => ({ ...user, name, email, avatarUrl }));
      saveSession({ token: token()!, user: updatedUser });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Profile update failed");
    }
  }

  return (
    <ProtectedPage>
      <main className="page-shell profile-page">
        <div className="profile-hero">
          <div className="avatar-preview large">{avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{initials(name || user?.name)}</span>}</div>
          <div>
            <div className="eyebrow">Your profile</div>
            <h1>{name || user?.name}</h1>
            <p>{email || user?.email}</p>
          </div>
        </div>
        <div className="form-page">
          <form onSubmit={(event) => { event.preventDefault(); saveProfile(); }}>
            <div className="image-picker inline">
              <div className="avatar-preview">{avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{initials(name)}</span>}</div>
              <label>Profile image<input type="file" accept="image/*" onChange={chooseImage} /></label>
              {avatarUrl ? <button className="button ghost" type="button" onClick={() => setAvatarUrl("")}>Remove</button> : null}
            </div>
            <label>
              Full name
              <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {success ? <p className="success-text">Profile updated successfully.</p> : null}
            <button className="button primary">Save changes</button>
          </form>
        </div>
      </main>
    </ProtectedPage>
  );
}
