"use client";

/* eslint-disable @next/next/no-img-element */

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, Project, ProjectsResponse } from "../../../lib/api";

export default function ProjectDetails() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const projectQuery = useQuery({ queryKey: ["project", projectId], queryFn: () => api<{ data: Project }>(`/projects/${projectId}`), enabled: Boolean(projectId) });
  const project = projectQuery.data?.data;
  const relatedQuery = useQuery({
    queryKey: ["related-projects", project?.priority],
    queryFn: () => api<ProjectsResponse>(`/projects?priority=${project?.priority ?? ""}&limit=4`),
    enabled: Boolean(project),
  });

  if (projectQuery.isLoading) return <main className="page-shell"><div className="loading-card">Loading project blueprint...</div></main>;
  if (projectQuery.error || !project) return <main className="page-shell"><div className="empty-state">Project not found. <Link href="/explore">Browse the project library</Link>.</div></main>;

  const date = new Date(project.createdAt).toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
  const done = project.tasks?.filter((task) => task.status === "done").length ?? 0;
  const total = project.tasks?.length ?? 0;
  const confidence = total ? Math.round((done / total) * 100) : 76;
  const related = relatedQuery.data?.data.filter((item) => item.id !== project.id).slice(0, 3) ?? [];

  return <main className="page-shell details">
    <div className="breadcrumb"><Link href="/explore">Explore</Link> / {project.title}</div>
    <div className="detail-hero">
      <div>
        <div className="eyebrow">Public blueprint</div>
        <h1>{project.title}</h1>
        <p>{project.shortDescription}</p>
        <span className={`pill ${project.priority.toLowerCase()}`}>{project.priority} priority</span>
      </div>
      <div className="detail-art image-art">{project.imageUrl ? <img src={project.imageUrl} alt="" /> : project.title.slice(0, 1)}</div>
    </div>

    <section>
      <h2>Description</h2>
      <p>{project.fullDescription || project.shortDescription}</p>
      <div className="media-strip">
        <article><b>{confidence}%</b><span>Delivery confidence</span></article>
        <article><b>{total}</b><span>AI-generated sprint tasks</span></article>
        <article><b>{project.techStack?.length ?? 0}</b><span>Core technologies</span></article>
      </div>
    </section>

    <section>
      <h2>Key information</h2>
      <div className="blueprint">
        <b>Created</b><span>{date}</span>
        <b>Tech stack</b><span>{project.techStack?.join(" · ") || "Product strategy"}</span>
        <b>Deadline</b><span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Flexible sprint schedule"}</span>
        <b>Rating</b><span>{confidence >= 70 ? "Strong delivery fit" : "Needs scope refinement"}</span>
      </div>
    </section>

    <section>
      <h2>AI blueprint</h2>
      <pre className="blueprint-text">{project.aiBlueprint || "Generate a blueprint from the add-project workflow to see AI planning here."}</pre>
    </section>

    <section>
      <h2>Sprint backlog</h2>
      <div className="kanban">
        {["todo", "in-progress", "done"].map((status) => <div key={status}><small>{status.replace("-", " ").toUpperCase()}</small>{project.tasks?.filter((task) => task.status === status).map((task) => <article key={`${status}-${task.title}`}>{task.title}<i>{task.priority}</i></article>)}</div>)}
      </div>
    </section>

    {related.length ? <section>
      <h2>Related projects</h2>
      <div className="related-grid">{related.map((item) => <Link href={`/projects/${item.id}`} key={item.id}><b>{item.title}</b><span>{item.shortDescription}</span></Link>)}</div>
    </section> : null}
  </main>;
}
