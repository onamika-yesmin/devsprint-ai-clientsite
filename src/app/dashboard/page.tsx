"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, currentUser, Project } from "../../lib/api";
import { ProtectedPage } from "../components/ProtectedPage";

export default function Dashboard() {
  const projectsQuery = useQuery({ queryKey: ["my-projects"], queryFn: () => api<{ data: Project[] }>("/projects/mine") });
  const projects = projectsQuery.data?.data ?? [];
  const tasks = projects.flatMap((project) => project.tasks ?? []);
  const done = tasks.filter((task) => task.status === "done").length;
  const open = tasks.filter((task) => task.status !== "done").length;
  const health = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const chartData = projects.slice(0, 6).map((project) => {
    const projectTasks = project.tasks ?? [];
    return {
      name: project.title.split(" ")[0],
      Done: projectTasks.filter((task) => task.status === "done").length,
      Open: projectTasks.filter((task) => task.status !== "done").length,
    };
  });
  const user = currentUser();

  return <ProtectedPage><main className="page-shell">
    <div className="page-heading"><div className="eyebrow">Your workspace</div><h1>Good morning, {user?.name?.split(" ")[0] ?? "Builder"}.</h1><p>Here is where your projects, AI blueprints, and sprint signals come together.</p></div>
    <div className="dash-actions"><Link className="button ghost" href="/ai">Open AI Studio</Link><Link className="button primary" href="/items/add">+ New project</Link></div>
    <div className="dash-stats">
      <article><small>ACTIVE PROJECTS</small><b>{projects.length.toString().padStart(2, "0")}</b><span>{projects.filter((project) => project.priority === "High").length} high priority</span></article>
      <article><small>OPEN TASKS</small><b>{open}</b><span>{done} completed</span></article>
      <article><small>SPRINT HEALTH</small><b>{health}%</b><span>{health >= 70 ? "On track" : "Needs focus"}</span></article>
    </div>
    <section className="dashboard-section">
      <div className="section-line"><h2>Sprint workload</h2><Link href="/items/manage">Manage projects</Link></div>
      {projectsQuery.isLoading ? <div className="loading-card">Loading workspace...</div> : null}
      {chartData.length ? <div className="chart-panel"><ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="Done" stackId="a" fill="#10b981" /><Bar dataKey="Open" stackId="a" fill="#6366f1" /></BarChart></ResponsiveContainer></div> : <div className="empty-state">Add a project to see sprint analytics.</div>}
    </section>
    <section className="dashboard-section">
      <h2>Active projects</h2>
      <div className="project-list">{projects.slice(0, 4).map((project) => {
        const projectTasks = project.tasks ?? [];
        const progress = projectTasks.length ? Math.round((projectTasks.filter((task) => task.status === "done").length / projectTasks.length) * 100) : 0;
        return <article key={project.id}><b>{project.title}</b><span>{progress}% complete · {project.shortDescription}</span><i><em style={{ width: `${progress}%` }} /></i><Link href={`/projects/${project.id}`}>Open</Link></article>;
      })}</div>
    </section>
  </main></ProtectedPage>;
}
