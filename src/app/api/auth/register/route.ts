import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { name, email, password, country } = await req.json();
  if (!name || !email || !password || !country)
    return NextResponse.json({ error: "All fields required." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing)
    return NextResponse.json({ error: "That email is already registered." }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      country,
      balance: 10_000,
      transactions: { create: [{ type: "DEPOSIT", amount: 10_000 }] },
    },
  });

  const token = await createSession(user.id);
  const res = NextResponse.json({ ok: true, token });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
