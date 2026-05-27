import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminCredentials, createAdminSession } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }
  if (!checkAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }
  const token = await createAdminSession(email);
  const res = NextResponse.json({ ok: true, token });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
  });
  return res;
}
