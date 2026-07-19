"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { ProtectedPage } from "../../components/ProtectedPage";

type CreatedProject = { data: { id: string } };

export default function AddProject() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api<CreatedProject>("/projects", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      router.push(`/projects/${response.data.id}`);
    },
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    mutation.mutate({
      title: form.get("title"),
      shortDescription: form.get("shortDescription"),
      fullDescription: form.get("fullDescription"),
      deadline: form.get("deadline"),
      priority: form.get("priority"),
      imageUrl: form.get("imageUrl"),
      techStack: String(form.get("techStack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      prdText: form.get("prdText"),
    });
  }

  return <ProtectedPage><main className="page-shell form-page">
    <div className="page-heading"><div className="eyebrow">New project</div><h1>Give your idea a running start.</h1><p>Add a few details and DevSprint will shape your first delivery plan with AI-generated tasks.</p></div>
    <form onSubmit={submit}>
      <label>Project title<input name="title" required placeholder="Customer feedback hub" /></label>
      <label>Short description<input name="shortDescription" required placeholder="A workspace that turns feedback into product decisions" /></label>
      <label>Full description<textarea name="fullDescription" required placeholder="Who is it for, what problem does it solve, and what outcome should the first release create?" /></label>
      <div className="form-row"><label>Deadline<input name="deadline" type="date" /></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label></div>
      <label>Tech stack<input name="techStack" placeholder="Next.js, Express, MongoDB" /></label>
      <label>Optional image URL<input name="imageUrl" type="url" placeholder="https://images.unsplash.com/..." /></label>
      <label>PRD or product brief<textarea name="prdText" placeholder="Paste requirements, user stories, risks, or acceptance criteria." /></label>
      {mutation.error ? <p className="form-error">{mutation.error.message}</p> : null}
      <button className="button primary" disabled={mutation.isPending}>{mutation.isPending ? "Generating blueprint..." : "Generate project blueprint →"}</button>
    </form>
  </main></ProtectedPage>;
}
