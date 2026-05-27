import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      balance: true,
      joinedAt: true,
      _count: { select: { holdings: true, transactions: true } },
    },
    orderBy: { joinedAt: "desc" },
  });
  return NextResponse.json({ users });
}
