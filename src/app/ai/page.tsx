"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api, Project } from "../../lib/api";
import { ProtectedPage } from "../components/ProtectedPage";

type ContentResult = { data: { draft: string; provider: string } };
type RecommendationResult = { data: { summary: string; nextActions: string[]; recommendedProjectIds: string[]; provider: string; projects: Project[] } };

const suggestedGoals = ["Find the highest-impact project for this sprint", "Reduce delivery risk before launch", "Prioritize work for a two-week sprint"];

export default function AiStudio() {
  const [kind, setKind] = useState("launch brief");
  const [audience, setAudience] = useState("product stakeholders");
  const [tone, setTone] = useState("clear and confident");
  const [length, setLength] = useState("medium");
  const [context, setContext] = useState("");
  const [goals, setGoals] = useState("Find the project with the strongest delivery impact this week.");
  const [history, setHistory] = useState<string[]>([]);

  const contentMutation = useMutation({
    mutationFn: () => api<ContentResult>("/ai/content", { method: "POST", body: JSON.stringify({ kind, audience, tone, length, context }) }),
  });
  const recommendationMutation = useMutation({
    mutationFn: () => api<RecommendationResult>("/ai/recommendations", { method: "POST", body: JSON.stringify({ goals: `${goals}\nPrevious refinements: ${history.join("; ")}` }) }),
    onSuccess: () => setHistory((items) => [goals, ...items].slice(0, 5)),
  });

  return <ProtectedPage><main className="page-shell ai-page">
    <div className="page-heading max-w-3xl"><div className="eyebrow">Agentic AI Studio</div><h1>Generate, reason, and choose the next best move.</h1><p>Use your project context to create launch-ready content and get workspace-aware recommendations.</p></div>
    <div className="ai-grid">
      <section className="ai-panel">
        <div className="section-line"><h2>AI content generator</h2><span>{contentMutation.data?.data.provider ?? "ready"}</span></div>
        <div className="form-row"><label>Content type<select value={kind} onChange={(e) => setKind(e.target.value)}><option>launch brief</option><option>product description</option><option>sprint update</option><option>documentation outline</option><option>social media post</option></select></label><label>Output length<select value={length} onChange={(e) => setLength(e.target.value)}><option>short</option><option>medium</option><option>long</option></select></label></div>
        <label>Audience<input value={audience} onChange={(e) => setAudience(e.target.value)} /></label>
        <label>Tone<input value={tone} onChange={(e) => setTone(e.target.value)} /></label>
        <label>Structured context<textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Paste project goal, audience, features, risks, and call to action." /></label>
        {contentMutation.error ? <p className="form-error">{contentMutation.error.message}</p> : null}
        <div className="button-row"><button className="button primary" onClick={() => contentMutation.mutate()} disabled={contentMutation.isPending}>{contentMutation.isPending ? "Generating..." : "Generate draft"}</button><button className="button ghost" onClick={() => contentMutation.mutate()} disabled={contentMutation.isPending || !contentMutation.data}>Regenerate</button></div>
        {contentMutation.data ? <pre className="ai-output">{contentMutation.data.data.draft}</pre> : null}
      </section>

      <section className="ai-panel">
        <div className="section-line"><h2>Smart recommendation engine</h2><span>{recommendationMutation.data?.data.provider ?? "ready"}</span></div>
        <label>Recommendation goal<textarea value={goals} onChange={(e) => setGoals(e.target.value)} /></label>
        <div className="prompt-chips">{suggestedGoals.map((prompt) => <button key={prompt} onClick={() => setGoals(prompt)}>{prompt}</button>)}</div>
        {recommendationMutation.error ? <p className="form-error">{recommendationMutation.error.message}</p> : null}
        <button className="button primary" onClick={() => recommendationMutation.mutate()} disabled={recommendationMutation.isPending}>{recommendationMutation.isPending ? "Analyzing workspace..." : "Get recommendations"}</button>
        {recommendationMutation.data ? <div className="recommendation">
          <p>{recommendationMutation.data.data.summary}</p>
          <ol>{recommendationMutation.data.data.nextActions.map((action) => <li key={action}>{action}</li>)}</ol>
          <div className="related-grid">{recommendationMutation.data.data.projects.map((project) => <Link href={`/projects/${project.id}`} key={project.id}><b>{project.title}</b><span>{project.shortDescription}</span></Link>)}</div>
        </div> : null}
      </section>
    </div>
  </main></ProtectedPage>;
}
