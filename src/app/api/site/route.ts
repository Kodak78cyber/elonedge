import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ELON_ASSETS } from "@/lib/elon-assets";

// Always render this route at request time — it hits the DB, which isn't
// reachable during the Next.js build step.
export const dynamic = "force-dynamic";

const DEFAULT_CONFIG: Record<string, string> = {
  "stats.activeInvestors": "14,832+",
  "stats.aum":             "$2.4B",
  "stats.avgReturn":       "34.7%",
  "stats.ventures":        "7",
  "hero.tagline":          "Live markets · 7 assets · $2.4B AUM",
};

let seedAttempted = false;

/**
 * Idempotent first-run seeder. If the Asset or SiteConfig tables are empty,
 * fill them from the in-code defaults. Safe to call on every request — after
 * the first successful seed, subsequent calls short-circuit.
 */
async function ensureSeeded() {
  if (seedAttempted) return;
  seedAttempted = true;
  try {
    const [assetCount, configCount] = await Promise.all([
      prisma.asset.count(),
      prisma.siteConfig.count(),
    ]);
    if (assetCount === 0) {
      await prisma.asset.createMany({
        data: ELON_ASSETS.map(a => ({
          id: a.id,
          symbol: a.symbol,
          name: a.name,
          category: a.category,
          basePrice: a.basePrice,
          changePct24h: a.changePct24h,
          annualReturn: a.annualReturn,
          marketCap: a.marketCap,
          color: a.color,
        })),
        skipDuplicates: true,
      });
    }
    if (configCount === 0) {
      await prisma.siteConfig.createMany({
        data: Object.entries(DEFAULT_CONFIG).map(([key, value]) => ({ key, value })),
        skipDuplicates: true,
      });
    }
  } catch {
    // If seeding fails (e.g. transient DB issue), allow another attempt next request.
    seedAttempted = false;
  }
}

// Public — used by the marketing homepage to render editable stats/copy.
export async function GET() {
  await ensureSeeded();
  const [rows, assets] = await Promise.all([
    prisma.siteConfig.findMany(),
    prisma.asset.findMany({ orderBy: { symbol: "asc" } }),
  ]);
  const config: Record<string, string> = {};
  for (const r of rows) config[r.key] = r.value;
  return NextResponse.json({ config, assets });
}
