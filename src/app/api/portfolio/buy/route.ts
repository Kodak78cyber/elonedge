import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { assetId, assetName, assetSymbol, usdAmount, pricePerShare } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.balance < usdAmount)
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  const shares = usdAmount / pricePerShare;

  await prisma.$transaction(async tx => {
    await tx.user.update({ where: { id: session.userId }, data: { balance: { decrement: usdAmount } } });

    const existing = await tx.holding.findUnique({
      where: { userId_assetId: { userId: session.userId, assetId } },
    });
    if (existing) {
      const newShares = existing.shares + shares;
      const newTotal = existing.totalInvested + usdAmount;
      await tx.holding.update({
        where: { userId_assetId: { userId: session.userId, assetId } },
        data: { shares: newShares, totalInvested: newTotal, avgBuyPrice: newTotal / newShares },
      });
    } else {
      await tx.holding.create({
        data: { userId: session.userId, assetId, shares, avgBuyPrice: pricePerShare, totalInvested: usdAmount },
      });
    }

    await tx.transaction.create({
      data: { userId: session.userId, type: "BUY", assetId, assetName, assetSymbol, shares, pricePerShare, amount: usdAmount },
    });
  });

  return NextResponse.json({ ok: true });
}
