import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.basePrice === "number")    data.basePrice    = body.basePrice;
  if (typeof body.changePct24h === "number") data.changePct24h = body.changePct24h;
  if (typeof body.annualReturn === "number") data.annualReturn = body.annualReturn;
  if (typeof body.marketCap === "string")    data.marketCap    = body.marketCap;
  if (typeof body.category === "string")     data.category     = body.category;
  if (typeof body.color === "string")        data.color        = body.color;
  if (typeof body.name === "string")         data.name         = body.name;
  if (typeof body.symbol === "string")       data.symbol       = body.symbol;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }
  const asset = await prisma.asset.update({ where: { id: params.id }, data });
  return NextResponse.json({ asset });
}
