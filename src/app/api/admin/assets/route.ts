import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const assets = await prisma.asset.findMany({ orderBy: { symbol: "asc" } });
  return NextResponse.json({ assets });
}
