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
export type Priority = 'High' | 'Medium' | 'Low';
export type ProjectTask = { title: string; status: 'todo' | 'in-progress' | 'done' | string; priority: Priority | string; sprint: number };
export type Project = { id: string; title: string; shortDescription: string; fullDescription?: string; deadline?: string; priority: Priority; techStack: string[]; createdAt: string; imageUrl?: string; aiBlueprint?: string; tasks?: ProjectTask[]; owner?: string };
export type ProjectsResponse = { data: Project[]; total: number; page: number; pages: number };
export type SessionUser = { id?: string; name: string; email: string; avatarUrl?: string };
export const token = () => typeof window === 'undefined' ? null : localStorage.getItem('devsprint_token');
export function subscribeSession(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onChange);
  window.addEventListener('devsprint-session', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('devsprint-session', onChange);
  };
}
export const sessionSnapshot = () => token();
export const serverSessionSnapshot = () => null;
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authToken = token();
  const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}), ...options.headers } });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.message ?? 'Something went wrong.');
  return body as T;
}
export function saveSession(data: { token: string; user: SessionUser }) {
  localStorage.setItem('devsprint_token', data.token);
  localStorage.setItem('devsprint_user', JSON.stringify(data.user));
  window.dispatchEvent(new Event('devsprint-session'));
}
export function clearSession() {
  localStorage.removeItem('devsprint_token');
  localStorage.removeItem('devsprint_user');
  window.dispatchEvent(new Event('devsprint-session'));
}
export function currentUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('devsprint_user') ?? 'null') as SessionUser | null; } catch { return null; }
}
