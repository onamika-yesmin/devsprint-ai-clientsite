"use client";

import { currentUser } from "../../lib/api";
import { ProtectedPage } from "../components/ProtectedPage";

export default function Profile() {
  const user = currentUser();

  return (
    <ProtectedPage>
      <main className="page-shell">
        <div className="page-heading">
          <div className="eyebrow">Your Profile</div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="dash-stats">
            <article><small>Total Projects</small><b>0</b></article>
            <article><small>Total Tasks</small><b>0</b></article>
            <article><small>Completed Tasks</small><b>0</b></article>
        </div>
      </main>
    </ProtectedPage>
  );
}
