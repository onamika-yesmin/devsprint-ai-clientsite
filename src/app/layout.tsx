import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./pages.css";

export const metadata: Metadata = { title: "DevSprint AI | Plan. Build. Ship.", description: "AI-powered product delivery workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body><header><Link href="/" className="brand"><span>◆</span> DevSprint <i>AI</i></Link><nav><Link href="/explore">Explore</Link><Link href="/about">About</Link><Link href="/support">Support</Link></nav><div className="nav-actions"><Link href="/login">Sign in</Link><Link className="button primary compact" href="/register">Get started</Link></div></header>{children}<footer><div className="brand"><span>◆</span> DevSprint <i>AI</i></div><p>Turn product thinking into confident delivery.</p><div><Link href="/about">About</Link><Link href="/support">Support</Link><Link href="/explore">Explore</Link></div><small>© 2026 DevSprint AI. Made for teams that build.</small></footer></body></html>;
}
