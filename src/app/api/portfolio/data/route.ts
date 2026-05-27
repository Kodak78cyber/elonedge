import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      holdings: true,
      transactions: { orderBy: { date: "desc" }, take: 100 },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
      role: user.role,
      joinedAt: user.joinedAt.toISOString(),
    },
    balance: user.balance,
    holdings: user.holdings,
    transactions: user.transactions.map(t => ({
      ...t,
      date: t.date.toISOString(),
    })),
  });
}
