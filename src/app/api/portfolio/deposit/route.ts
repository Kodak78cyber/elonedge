import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.userId }, data: { balance: { increment: amount } } }),
    prisma.transaction.create({ data: { userId: session.userId, type: "DEPOSIT", amount } }),
  ]);

  return NextResponse.json({ ok: true });
}
