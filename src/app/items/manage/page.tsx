"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api, Project } from "../../../lib/api";
import { ProtectedPage } from "../../components/ProtectedPage";

export default function Manage() {
  const queryClient = useQueryClient();
  const [remove, setRemove] = useState<Project | null>(null);
  const projectsQuery = useQuery({ queryKey: ["my-projects"], queryFn: () => api<{ data: Project[] }>("/projects/mine") });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api<void>(`/projects/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      setRemove(null);
      await queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  const projects = projectsQuery.data?.data ?? [];

  return <ProtectedPage><main className="page-shell">
    <div className="page-heading"><div className="eyebrow">Project management</div><h1>Keep your workspace tidy.</h1><p>Review projects you own, open the public details page, or remove work that is no longer active.</p></div>
    <div className="manage-head"><b>{projects.length} projects</b><Link className="button primary" href="/items/add">+ Add project</Link></div>
    {projectsQuery.isLoading ? <div className="table loading-table">{Array.from({ length: 4 }).map((_, index) => <div key={index}><span className="mini-art" /><b /><small /><em /></div>)}</div> : null}
    {!projectsQuery.isLoading && projects.length === 0 ? <div className="empty-state">No projects yet. Add your first project to generate an AI blueprint.</div> : null}
    {projects.length ? <div className="table">{projects.map((project, index) => <div key={project.id}>
      <span className={`mini-art art-${index % 6}`}>{project.title[0]}</span>
      <b>{project.title}</b>
      <small>{new Date(project.createdAt).toLocaleDateString()}</small>
      <em className={`pill ${project.priority.toLowerCase()}`}>{project.priority}</em>
      <Link href={`/projects/${project.id}`}>View</Link>
      <button onClick={() => setRemove(project)}>Delete</button>
    </div>)}</div> : null}
    {projectsQuery.error ? <p className="form-error">{projectsQuery.error.message}</p> : null}
    {remove ? <div className="modal-backdrop"><div className="modal"><h2>Delete {remove.title}?</h2><p>This removes it from your workspace and from the public project library.</p>{deleteMutation.error ? <p className="form-error">{deleteMutation.error.message}</p> : null}<div><button className="button ghost" onClick={() => setRemove(null)}>Cancel</button><button className="button danger" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(remove.id)}>{deleteMutation.isPending ? "Deleting..." : "Delete project"}</button></div></div></div> : null}
  </main></ProtectedPage>;
}
