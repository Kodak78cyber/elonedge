/**
 * Admin auth — completely separate from user accounts.
 * Credentials live in environment variables (ADMIN_EMAIL / ADMIN_PASSWORD).
 * Sessions use a dedicated cookie + JWT so admin and user sessions never mix.
 */
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

export const ADMIN_COOKIE = "elon_admin_session";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fallback-dev-secret-32-chars-ok!",
);

export async function createAdminSession(email: string): Promise<string> {
  return new SignJWT({ admin: true, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);
}

async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return Boolean(payload.admin);
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  // Cookie path
  const cookieToken = cookies().get(ADMIN_COOKIE)?.value;
  if (await isValidAdminToken(cookieToken)) return true;
  // Authorization header path (iOS Safari + LAN fallback)
  const auth = headers().get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return isValidAdminToken(auth.slice(7).trim());
  }
  return false;
}

export function checkAdminCredentials(email: string, password: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminEmail || !adminPassword) return false;
  return (
    email.trim().toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  );
}

/**
 * For API routes: returns NextResponse to short-circuit, or null to continue.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminRequest()) return null;
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
