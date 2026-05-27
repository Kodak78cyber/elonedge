import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { requireAdmin } from "@/lib/admin";

/**
 * One-time seed for Asset and SiteConfig tables. Admin-only. Idempotent —
 * calling it again will re-upsert from the in-code defaults, so it can also
 * be used as a "reset to defaults" button.
 */
export async function POST() {
  const guard = await requireAdmin();
  if (guard) return guard;

  // Seed assets from ELON_ASSETS
  for (const a of ELON_ASSETS) {
    await prisma.asset.upsert({
      where: { id: a.id },
      update: {
        symbol: a.symbol,
        name: a.name,
        category: a.category,
        basePrice: a.basePrice,
        changePct24h: a.changePct24h,
        annualReturn: a.annualReturn,
        marketCap: a.marketCap,
        color: a.color,
      },
      create: {
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        category: a.category,
        basePrice: a.basePrice,
        changePct24h: a.changePct24h,
        annualReturn: a.annualReturn,
        marketCap: a.marketCap,
        color: a.color,
      },
    });
  }

  // Seed default site config
  const defaults: Record<string, string> = {
    "stats.activeInvestors": "14,832+",
    "stats.aum": "$2.4B",
    "stats.avgReturn": "34.7%",
    "stats.ventures": "7",
    "hero.tagline": "Live markets · 7 assets · $2.4B AUM",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: {},                 // only set on create
      create: { key, value },
    });
  }

  return NextResponse.json({ ok: true, assets: ELON_ASSETS.length, config: Object.keys(defaults).length });
}
