import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.balance === "number") data.balance = body.balance;
  if (typeof body.name === "string" && body.name.length >= 2) data.name = body.name;
  if (typeof body.country === "string") data.country = body.country;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }

  // Log balance changes as transactions for a clean audit trail.
  if (typeof body.balance === "number") {
    const before = await prisma.user.findUnique({
      where: { id: params.id },
      select: { balance: true },
    });
    if (before) {
      const delta = body.balance - before.balance;
      if (delta !== 0) {
        await prisma.transaction.create({
          data: {
            userId: params.id,
            type: delta > 0 ? "DEPOSIT" : "WITHDRAW",
            amount: Math.abs(delta),
          },
        });
      }
    }
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, balance: true },
  });
  return NextResponse.json({ user });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
