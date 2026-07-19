import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "./components/NavBar";
import { Providers } from "./providers";
import "./globals.css";
import "./pages.css";

export const metadata: Metadata = {
  title: "DevSprint AI | Plan. Build. Ship.",
  description: "AI-powered product delivery workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Providers><NavBar />{children}<footer>
    <div className="brand"><span>◆</span> DevSprint <i>AI</i></div>
    <p>Turn product thinking into confident delivery.<br />hello@devsprint.ai</p>
    <div>
      <Link href="/about">About</Link>
      <Link href="/support">Support</Link>
      <Link href="/explore">Explore</Link>
      <a href="mailto:hello@devsprint.ai">Email</a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
    </div>
    <small>© 2026 DevSprint AI. Made for teams that build.</small>
  </footer></Providers></body></html>;
}
