const configuredOrigin = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? (configuredOrigin ? `${configuredOrigin}/api` : 'https://devsprint-ai-serversite.vercel.app/api');
// Protect against an accidental endpoint value such as /api/auth/google.
// All frontend requests must begin at the API root, never at an individual route.
function apiRoot(value: string) {
  try {
    const url = new URL(value);
    const apiStart = url.pathname.indexOf('/api');
    return `${url.origin}${apiStart >= 0 ? url.pathname.slice(0, apiStart + 4) : '/api'}`.replace(/\/$/, '');
  } catch { return 'https://devsprint-ai-serversite.vercel.app/api'; }
}
export const apiBaseUrl = apiRoot(rawApiUrl);
export type Project = { id: string; title: string; shortDescription: string; fullDescription?: string; priority: 'High' | 'Medium' | 'Low'; techStack: string[]; createdAt: string; imageUrl?: string; aiBlueprint?: string; tasks?: { title: string; status: string; priority: string; sprint: number }[] };
export const token = () => typeof window === 'undefined' ? null : localStorage.getItem('devsprint_token');
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...options.headers } }); const body = response.status === 204 ? null : await response.json(); if (!response.ok) throw new Error(body?.message ?? 'Something went wrong.'); return body as T; }
export function saveSession(data: { token: string; user: { name: string; email: string } }) { localStorage.setItem('devsprint_token', data.token); localStorage.setItem('devsprint_user', JSON.stringify(data.user)); }
