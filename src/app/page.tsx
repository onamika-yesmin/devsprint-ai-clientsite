"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  ["What does DevSprint AI create?", "A clear, editable delivery plan: milestones, tasks, priorities and an initial sprint backlog."],
  ["Can I import a PRD?", "Yes. Paste a brief or attach a document when creating a project, then refine the generated scope."],
  ["Is my project private?", "Projects remain visible only to your workspace until you choose to share them."],
  ["Can I use my existing workflow?", "Yes. DevSprint works alongside your existing team rituals and turns the plan into practical tasks."],
  ["Who is it for?", "Product builders, agencies and engineering teams who want to start each sprint with more confidence."],
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pro, setPro] = useState(false);

  return <main>
    <section className="hero shell">
      <div className="eyebrow">AI-powered product delivery</div>
      <h1>Turn ambitious ideas into <span>shippable sprints.</span></h1>
      <p>DevSprint AI transforms your product brief into an intelligent roadmap, focused backlog, and a clear path to launch.</p>
      <div className="actions"><Link className="button primary" href="/register">Start building free <b>-&gt;</b></Link><Link className="button ghost" href="/explore">Explore projects</Link></div>
      <div className="hero-board" aria-label="Sprint preview">
        <div className="board-head"><span>Q3 Product launch</span><span className="live-dot">Live sprint</span></div>
        <div className="board-columns">
          <div><small>TO DO</small><article>Define onboarding flow <i>High</i></article><article>Set success metrics</article></div>
          <div><small>IN PROGRESS</small><article className="highlight">Build AI roadmap <em>3 tasks</em></article><article>Review technical scope</article></div>
          <div><small>DONE</small><article>Research customer needs <strong>Done</strong></article></div>
        </div>
      </div>
    </section>

    <section className="section shell">
      <div className="section-intro"><div className="eyebrow">A smarter starting point</div><h2>Everything you need to move from brief to build.</h2></div>
      <div className="feature-grid">
        {[
          ["AI", "AI Roadmaps", "Bring a rough idea and leave with a structured product plan that your team can believe in."],
          ["DOC", "Document intelligence", "Extract requirements, risks and delivery details from the documents you already have."],
          ["QA", "Performance analyzer", "Spot bottlenecks early with sprint health signals that make every stand-up more useful."],
        ].map(([icon, title, text]) => <article className="feature" key={title}><span>{icon}</span><h3>{title}</h3><p>{text}</p><a href="#how">Learn more -&gt;</a></article>)}
      </div>
    </section>

    <section id="how" className="section muted"><div className="shell"><div className="section-intro centered"><div className="eyebrow">How it works</div><h2>Your first sprint, in four clear moves.</h2></div><div className="steps">{[["01", "Share your idea", "Add a short brief, existing PRD or product notes."], ["02", "AI maps the work", "We identify requirements and build a delivery plan."], ["03", "Shape your backlog", "Prioritize tasks and organize them on your Kanban board."], ["04", "Learn as you ship", "Track momentum and make better decisions sprint by sprint."]].map(([n, t, d]) => <article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

    <section className="section shell stats"><div><div className="eyebrow">Built for momentum</div><h2>Progress your whole team can see.</h2><p>Bring clarity to the work, so the important things keep moving.</p><Link className="text-link" href="/dashboard">Open your dashboard -&gt;</Link></div><div className="chart-card"><div><span>Sprint completion</span><b>78%</b></div><div className="bars"><i /><i /><i /><i /><i /><i /><i /></div><small>MON&nbsp;&nbsp;&nbsp; TUE&nbsp;&nbsp;&nbsp; WED&nbsp;&nbsp;&nbsp; THU&nbsp;&nbsp;&nbsp; FRI&nbsp;&nbsp;&nbsp; SAT&nbsp;&nbsp;&nbsp; SUN</small></div><div className="numbers"><b>12.4k <small>tasks completed</small></b><b>94% <small>on-time delivery</small></b><b>2.8x <small>faster planning</small></b></div></section>

    <section className="section muted"><div className="shell pricing"><div className="section-intro"><div className="eyebrow">Simple, transparent pricing</div><h2>Start small. Scale your momentum.</h2></div><div className="toggle"><button className={!pro ? "active" : ""} onClick={() => setPro(false)}>Free</button><button className={pro ? "active" : ""} onClick={() => setPro(true)}>Pro</button></div><div className="price-card"><div><h3>{pro ? "Pro workspace" : "Free workspace"}</h3><p>{pro ? "For teams who ship together." : "Everything you need to try DevSprint."}</p></div><strong>{pro ? "$19" : "$0"}<small>/month</small></strong><Link className="button primary" href="/register">{pro ? "Start 14-day trial" : "Get started"}</Link></div></div></section>

    <section className="section shell"><div className="section-intro centered"><div className="eyebrow">From builders like you</div><h2>Clarity changes everything.</h2></div><div className="quotes">{[["DevSprint made our kickoff feel like day ten of a great project, not day one of a messy one.", "Maya Chen", "Product lead, Northstar"], ["The AI plan gave our team the shared language we needed to actually start building.", "Alex Morgan", "Founder, Fieldwork"], ["We now see risks before they derail a sprint. That alone has changed our pace.", "Priya Shah", "Engineering manager, Fable"]].map(([q, n, r]) => <article key={n}><div>5.0 rating</div><p>&quot;{q}&quot;</p><b>{n}</b><small>{r}</small></article>)}</div></section>

    <section className="section muted"><div className="shell faq"><div className="section-intro"><div className="eyebrow">Questions, answered</div><h2>Everything you need to know.</h2></div><div>{faqs.map(([q, a], i) => <button className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)} key={q}><span><b>{q}</b>{openFaq === i && <small>{a}</small>}</span><i>{openFaq === i ? "-" : "+"}</i></button>)}</div></div></section>

    <section className="newsletter shell"><div><div className="eyebrow">Stay in the loop</div><h2>Good ideas deserve a head start.</h2><p>Product notes, smart templates and updates, occasionally.</p></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="you@company.com" aria-label="Email address" /><button className="button primary">Subscribe</button></form></section>
  </main>;
}
