import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { assetId, assetName, assetSymbol, shares, pricePerShare } = await req.json();
  const proceeds = shares * pricePerShare;

  const holding = await prisma.holding.findUnique({
    where: { userId_assetId: { userId: session.userId, assetId } },
  });
  if (!holding || holding.shares < shares - 0.0001)
    return NextResponse.json({ error: "Insufficient shares" }, { status: 400 });

  await prisma.$transaction(async tx => {
    await tx.user.update({ where: { id: session.userId }, data: { balance: { increment: proceeds } } });

    const remaining = holding.shares - shares;
    if (remaining < 0.0001) {
      await tx.holding.delete({ where: { userId_assetId: { userId: session.userId, assetId } } });
    } else {
      const proportion = shares / holding.shares;
      await tx.holding.update({
        where: { userId_assetId: { userId: session.userId, assetId } },
        data: { shares: remaining, totalInvested: holding.totalInvested * (1 - proportion) },
      });
    }

    await tx.transaction.create({
      data: { userId: session.userId, type: "SELL", assetId, assetName, assetSymbol, shares, pricePerShare, amount: proceeds },
    });
  });

  return NextResponse.json({ ok: true });
}
