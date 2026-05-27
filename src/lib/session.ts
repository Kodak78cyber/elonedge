import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fallback-dev-secret-32-chars-ok!",
);

export const SESSION_COOKIE = "elon_session";

export async function createSession(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function getSession(): Promise<{ userId: string } | null> {
  // Try cookie first (works on desktop browsers).
  let token = cookies().get(SESSION_COOKIE)?.value;
  // Fallback: Authorization header (used by iOS Safari over HTTP where
  // cookies are restricted on local-network origins).
  if (!token) {
    const auth = headers().get("authorization") ?? "";
    if (auth.toLowerCase().startsWith("bearer ")) token = auth.slice(7).trim();
  }
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}
