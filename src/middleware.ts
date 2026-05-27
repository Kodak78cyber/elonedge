import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "elon_session";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "fallback-dev-secret-32-chars-ok!",
);

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin is now gated by its own auth system (env-var credentials → admin
  // cookie). The admin layout handles redirecting unauthenticated users to
  // /admin/login. Middleware skips /admin entirely so the login page itself
  // can render without a user session.
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Only /dashboard remains user-protected here.
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Cookie path (desktop browsers).
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifyToken(cookieToken)) return NextResponse.next();

  // For HTML page loads, let client layout do its own check (the dashboard
  // layout already handles redirect-to-login on auth failure). This keeps
  // iOS Safari working when cookies are blocked on LAN/HTTP origins.
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/html")) return NextResponse.next();

  // For API/fetch-style requests, also try the Authorization header.
  const auth = req.headers.get("authorization") ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    if (await verifyToken(auth.slice(7).trim())) return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
