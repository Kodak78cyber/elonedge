/* API-backed auth helpers — no JSX. React context lives in elon-context.tsx */

export interface ElonUser {
  id: string;
  name: string;
  email: string;
  country: string;
  role?: "USER" | "ADMIN";
  joinedAt: string;
}

export interface Holding {
  id?: string;
  userId?: string;
  assetId: string;
  shares: number;
  avgBuyPrice: number;
  totalInvested: number;
}

export interface Transaction {
  id: string;
  type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  assetId?: string | null;
  assetName?: string | null;
  assetSymbol?: string | null;
  shares?: number | null;
  pricePerShare?: number | null;
  amount: number;
  date: string;
}

export interface StoreCtxType {
  user: ElonUser | null;
  balance: number;
  holdings: Holding[];
  transactions: Transaction[];
  loading: boolean;
  refresh: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<boolean>;
  buy: (
    assetId: string,
    assetName: string,
    assetSymbol: string,
    usdAmount: number,
    pricePerShare: number,
  ) => Promise<boolean>;
  sell: (
    assetId: string,
    assetName: string,
    assetSymbol: string,
    shares: number,
    pricePerShare: number,
  ) => Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Token helpers — used as a fallback for iOS Safari, where HTTP cookies on
// local-network origins are often blocked. Server reads either the cookie OR
// the Authorization header.
// ---------------------------------------------------------------------------
const TOKEN_KEY = "elon_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setToken(token: string) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}
function clearToken() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

export function authHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = getToken();
  const base: Record<string, string> = { ...(extra as Record<string, string>) };
  if (token) base["Authorization"] = `Bearer ${token}`;
  return base;
}

export async function registerUser(fields: {
  name: string;
  email: string;
  password: string;
  country: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    if (data.token) setToken(data.token);
    return { ok: true };
  }
  return { ok: false, error: data.error ?? "Registration failed." };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    if (data.token) setToken(data.token);
    return { ok: true };
  }
  return { ok: false, error: data.error ?? "Login failed." };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
  });
  clearToken();
}
