import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.balance < amount)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: session.userId }, data: { balance: { decrement: amount } } }),
    prisma.transaction.create({ data: { userId: session.userId, type: "WITHDRAW", amount } }),
  ]);

  return NextResponse.json({ ok: true });
}
