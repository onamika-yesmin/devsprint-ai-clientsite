"use client";

/* eslint-disable @next/next/no-img-element */

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api, Project, ProjectsResponse } from "../../lib/api";

const priorities = ["", "High", "Medium", "Low"];
const techStacks = ["", "Next.js", "React", "Node.js", "TypeScript", "MongoDB", "Recharts"];
const sortOptions = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["priority", "Highest priority"],
];

function ProjectCard({ project }: { project: Project }) {
  const date = new Date(project.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  return <article className="project-card">
    <div className="card-art image-art">{project.imageUrl ? <img src={project.imageUrl} alt="" /> : <span>{project.title.slice(0, 1)}</span>}</div>
    <div className="card-copy">
      <div><em>{project.techStack?.[0] ?? "Product"}</em><i className={`pill ${project.priority.toLowerCase()}`}>{project.priority}</i></div>
      <h2>{project.title}</h2>
      <p>{project.shortDescription}</p>
      <small>{date} · {project.tasks?.length ?? 0} sprint tasks</small>
      <Link href={`/projects/${project.id}`}>View details <b>→</b></Link>
    </div>
  </article>;
}

export default function Explore() {
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [techStack, setTechStack] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "8", sort });
    if (q) params.set("search", q);
    if (priority) params.set("priority", priority);
    if (techStack) params.set("techStack", techStack);
    return params.toString();
  }, [page, priority, q, sort, techStack]);
  const { data, isLoading, error } = useQuery({ queryKey: ["projects", query], queryFn: () => api<ProjectsResponse>(`/projects?${query}`) });
  const resetPage = (action: () => void) => { action(); setPage(1); };

  return <main className="page-shell">
    <div className="page-heading"><div className="eyebrow">Project library</div><h1>Explore what teams are building.</h1><p>Find focused product plans, generated sprint backlogs, and ideas worth learning from.</p></div>
    <div className="filters">
      <input value={q} onChange={(e) => resetPage(() => setQ(e.target.value))} placeholder="Search projects, teams or tech..." />
      <select value={priority} onChange={(e) => resetPage(() => setPriority(e.target.value))}>{priorities.map((item) => <option key={item} value={item}>{item || "All priorities"}</option>)}</select>
      <select value={techStack} onChange={(e) => resetPage(() => setTechStack(e.target.value))}>{techStacks.map((item) => <option key={item} value={item}>{item || "All stacks"}</option>)}</select>
      <select value={sort} onChange={(e) => resetPage(() => setSort(e.target.value))}>{sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </div>
    {error ? <p className="form-error">{error instanceof Error ? error.message : "Could not load projects."}</p> : null}
    <p className="result-count">{data?.total ?? 0} projects found</p>
    <div className="project-grid">
      {isLoading ? Array.from({ length: 8 }).map((_, index) => <article className="project-card skeleton-card" key={index}><div /><span /><span /><span /></article>) : data?.data.map((project) => <ProjectCard project={project} key={project.id} />)}
    </div>
    {!isLoading && data && data.data.length === 0 ? <div className="empty-state">No projects match those filters. Try a broader search or add a new project from your workspace.</div> : null}
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>Previous</button>
      <span>Page {data?.page ?? page} of {data?.pages ?? 1}</span>
      <button disabled={!data || page >= data.pages} onClick={() => setPage((value) => value + 1)}>Next</button>
    </div>
  </main>;
}
