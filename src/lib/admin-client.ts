/**
 * Client-side helpers for the admin section. Lives in lib/ so any admin page
 * can import without crossing Next.js layout-file boundaries.
 */
export const ADMIN_TOKEN_KEY = "elon_admin_token";

export function adminAuthHeaders(extra: HeadersInit = {}): HeadersInit {
  const base: Record<string, string> = { ...(extra as Record<string, string>) };
  if (typeof window !== "undefined") {
    try {
      const t = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (t) base["Authorization"] = `Bearer ${t}`;
    } catch {}
  }
  return base;
}
