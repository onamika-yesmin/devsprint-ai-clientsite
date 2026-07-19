"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../lib/api";
import { fileToDataUrl } from "../../../lib/images";
import { ProtectedPage } from "../../components/ProtectedPage";

type CreatedProject = { data: { id: string } };

export default function AddProject() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [imageError, setImageError] = useState("");
  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api<CreatedProject>("/projects", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      router.push(`/projects/${response.data.id}`);
    },
  });

  async function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setImageError("");
      setUploadedImage(await fileToDataUrl(file));
    } catch (uploadError) {
      setImageError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      title: form.get("title"),
      shortDescription: form.get("shortDescription"),
      fullDescription: form.get("fullDescription"),
      deadline: form.get("deadline"),
      priority: form.get("priority"),
      imageUrl: uploadedImage || imageUrl,
      techStack: String(form.get("techStack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      prdText: form.get("prdText"),
    });
  }

  const previewImage = uploadedImage || imageUrl;

  return <ProtectedPage><main className="page-shell form-page">
    <div className="page-heading"><div className="eyebrow">New project</div><h1>Give your idea a running start.</h1><p>Add a few details and DevSprint will shape your first delivery plan with AI-generated tasks.</p></div>
    <form onSubmit={submit}>
      <label>Project title<input name="title" required placeholder="Customer feedback hub" /></label>
      <label>Short description<input name="shortDescription" required placeholder="A workspace that turns feedback into product decisions" /></label>
      <label>Full description<textarea name="fullDescription" required placeholder="Who is it for, what problem does it solve, and what outcome should the first release create?" /></label>
      <div className="form-row"><label>Deadline<input name="deadline" type="date" /></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label></div>
      <label>Tech stack<input name="techStack" placeholder="Next.js, Express, MongoDB" /></label>
      <div className="project-image-field">
        <div className="project-image-preview">{previewImage ? <img src={previewImage} alt="" /> : <span>Project image</span>}</div>
        <div>
          <label>Image URL<input name="imageUrl" type="url" value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); setUploadedImage(""); }} placeholder="https://images.unsplash.com/..." /></label>
          <label>Or upload image<input type="file" accept="image/*" onChange={chooseImage} /></label>
        </div>
      </div>
      <label>PRD or product brief<textarea name="prdText" placeholder="Paste requirements, user stories, risks, or acceptance criteria." /></label>
      {imageError ? <p className="form-error">{imageError}</p> : null}
      {mutation.error ? <p className="form-error">{mutation.error.message}</p> : null}
      <button className="button primary" disabled={mutation.isPending}>{mutation.isPending ? "Generating blueprint..." : "Generate project blueprint ->"}</button>
    </form>
  </main></ProtectedPage>;
}
