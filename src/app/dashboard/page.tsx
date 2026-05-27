"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet, Briefcase,
} from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssetCard } from "@/components/dashboard/asset-card";
import { InvestModal } from "@/components/dashboard/invest-modal";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { useElonStore } from "@/lib/elon-context";
import { formatUsd, timeAgo } from "@/lib/utils";

/* Recharts for portfolio performance chart */
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

/* Generate 30-day portfolio history based on holdings */
function buildPerformanceData(totalValue: number) {
  const now = Date.now();
  const days = 30;
  const data = [];
  let v = totalValue * 0.78;
  for (let i = days; i >= 0; i--) {
    const rand = Math.sin(i * 1.3) * 0.022 + Math.cos(i * 0.7) * 0.018;
    v = Math.max(0, v * (1 + rand));
    data.push({
      date: new Date(now - i * 86_400_000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(v.toFixed(2)),
    });
  }
  data[data.length - 1].value = totalValue;
  return data;
}

const PIE_COLORS = ["#D4AF37", "#4F8EF7", "#22D3EE", "#A855F7", "#E31937", "#F59E0B", "#92400E"];

export default function DashboardPage() {
  const { user, balance, holdings, transactions } = useElonStore();
  const [modalOpen, setModalOpen]         = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | undefined>();

  /* Compute portfolio metrics */
  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = ELON_ASSETS.find(a => a.id === h.assetId);
    return sum + (asset ? h.shares * asset.basePrice : 0);
  }, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
  const pnl           = portfolioValue - totalInvested;
  const pnlPct        = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
  const totalAssets   = holdings.length;

  /* Allocation pie data */
  const allocationData = holdings.map(h => {
    const asset = ELON_ASSETS.find(a => a.id === h.assetId);
    return { name: asset?.symbol ?? h.assetId, value: Number((h.shares * (asset?.basePrice ?? 0)).toFixed(2)) };
  });

  const perfData = buildPerformanceData(portfolioValue > 0 ? portfolioValue : 12000);

  function openInvest(assetId: string) {
    setSelectedAsset(assetId);
    setModalOpen(true);
  }

  const recentTx = transactions.slice(0, 6);

  return (
    <>
      <InvestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedId={selectedAsset}
      />

      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge tone="accent" className="mb-2">Overview</Badge>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Investor"}
            </h1>
            <p className="text-sm text-muted">Your ElonEdge portfolio at a glance.</p>
          </div>
          <button
            onClick={() => { setSelectedAsset(undefined); setModalOpen(true); }}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-accent text-accent-fg text-sm font-semibold hover:brightness-110 transition shadow-gold"
          >
            Quick Invest <ArrowUpRight className="size-4" />
          </button>
        </header>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Portfolio Value"
            value={formatUsd(portfolioValue)}
            sub={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}% all-time`}
            positive={pnlPct >= 0}
            icon={<DollarSign className="size-4" />}
          />
          <StatCard
            label="Wallet Balance"
            value={formatUsd(balance)}
            sub="Available to invest"
            icon={<Wallet className="size-4" />}
          />
          <StatCard
            label="Profit / Loss"
            value={formatUsd(pnl)}
            sub={`${pnl >= 0 ? "+" : ""}${pnlPct.toFixed(2)}% return`}
            positive={pnl >= 0}
            icon={pnl >= 0 ? <TrendingUp className="size-4 text-success" /> : <ArrowDownRight className="size-4 text-danger" />}
          />
          <StatCard
            label="Open Positions"
            value={String(totalAssets)}
            sub="Across all assets"
            icon={<Briefcase className="size-4" />}
          />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Performance · 30d</CardTitle>
                <p className="text-xs text-muted mt-1">Total portfolio value over the last month.</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pnl >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                {pnl >= 0 ? "▲" : "▼"} {Math.abs(pnlPct).toFixed(2)}%
              </span>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={perfData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="perf-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(44 40 28 / 0.6)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgb(148 132 100)" }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 10, fill: "rgb(148 132 100)" }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "rgb(22 21 30)", border: "1px solid rgb(44 40 28)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "rgb(240 228 196)" }}
                    formatter={(v: number) => [formatUsd(v), "Portfolio"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#perf-grad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allocation</CardTitle>
              <p className="text-xs text-muted mt-1">Distribution by portfolio value.</p>
            </CardHeader>
            <CardBody>
              {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {allocationData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: "rgb(148 132 100)" }}>{v}</span>} />
                    <Tooltip
                      contentStyle={{ background: "rgb(22 21 30)", border: "1px solid rgb(44 40 28)", borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => [formatUsd(v)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center gap-3 text-center">
                  <p className="text-sm text-muted">No holdings yet.</p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="h-8 px-4 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition"
                  >
                    Make your first investment →
                  </button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Asset cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Market</h2>
            <Link href="/dashboard/invest" className="text-xs text-accent hover:underline">
              View all assets →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ELON_ASSETS.map(asset => {
              const h = holdings.find(x => x.assetId === asset.id);
              return (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  holdingShares={h?.shares}
                  onInvest={openInvest}
                />
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/dashboard/transactions" className="text-xs text-accent">View all →</Link>
          </CardHeader>
          <ul className="divide-y divide-border">
            {recentTx.map(t => {
              const asset = t.assetId ? ELON_ASSETS.find(a => a.id === t.assetId) : null;
              const isCredit = t.type === "SELL" || t.type === "DEPOSIT";
              return (
                <li key={t.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      t.type === "BUY"      ? "bg-success/10 text-success" :
                      t.type === "SELL"     ? "bg-danger/10 text-danger"   :
                      t.type === "DEPOSIT"  ? "bg-accent/10 text-accent"   :
                                              "bg-warn/10 text-warn"
                    }`}>
                      {t.type[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t.type}{asset ? ` · ${asset.symbol}` : ""}
                      </p>
                      <p className="text-xs text-muted">{timeAgo(new Date(t.date))}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${isCredit ? "text-success" : "text-danger"}`}>
                      {isCredit ? "+" : "-"}{formatUsd(t.amount)}
                    </p>
                    {t.shares && (
                      <p className="text-xs text-muted tabular-nums">
                        {t.shares.toFixed(4)} {t.assetSymbol}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
            {recentTx.length === 0 && (
              <li className="px-6 py-8 text-center text-muted text-sm">
                No activity yet.{" "}
                <button onClick={() => setModalOpen(true)} className="text-accent hover:underline">
                  Make your first investment →
                </button>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, positive, icon,
}: { label: string; value: string; sub: string; positive?: boolean; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className={`text-xs mt-0.5 ${positive === undefined ? "text-muted" : positive ? "text-success" : "text-danger"}`}>
          {sub}
        </p>
      </div>
    </div>
  );
}
