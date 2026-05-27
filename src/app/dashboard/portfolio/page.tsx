"use client";

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useElonStore } from "@/lib/elon-context";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { Sparkline } from "@/components/dashboard/sparkline";
import { formatUsd } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

export default function AnalyticsPage() {
  const { holdings, transactions, balance } = useElonStore();

  const positionData = ELON_ASSETS.map(asset => {
    const h = holdings.find(x => x.assetId === asset.id);
    const value = h ? h.shares * asset.basePrice : 0;
    const gain  = h ? value - h.totalInvested : 0;
    return { name: asset.symbol, value, gain, invested: h?.totalInvested ?? 0 };
  }).filter(d => d.value > 0);

  const portfolioValue = positionData.reduce((s, d) => s + d.value, 0);
  const totalGain      = positionData.reduce((s, d) => s + d.gain, 0);
  const buyCount       = transactions.filter(t => t.type === "BUY").length;

  const radarData = ELON_ASSETS.slice(0, 6).map(asset => {
    const h = holdings.find(x => x.assetId === asset.id);
    const weight = portfolioValue > 0 && h ? (h.shares * asset.basePrice) / portfolioValue * 100 : 0;
    return { asset: asset.symbol, weight: Number(weight.toFixed(1)) };
  });

  return (
    <div className="space-y-6">
      <header>
        <Badge tone="accent" className="mb-2">Analytics</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-sm text-muted">Deep insights into your ElonEdge positions.</p>
      </header>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Portfolio Value", v: formatUsd(portfolioValue) },
          { label: "Total Gain/Loss",  v: (totalGain >= 0 ? "+" : "") + formatUsd(totalGain), pos: totalGain >= 0 },
          { label: "Wallet Balance",  v: formatUsd(balance) },
          { label: "Total Trades",    v: String(buyCount) },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">{s.label}</p>
            <p className={`text-2xl font-bold tabular-nums ${s.pos === false ? "text-danger" : s.pos === true ? "text-success" : ""}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Position bar chart */}
        <Card>
          <CardHeader><CardTitle>Position Values</CardTitle></CardHeader>
          <CardBody>
            {positionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={positionData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(44 40 28 / 0.5)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgb(148 132 100)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "rgb(148 132 100)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "rgb(22 21 30)", border: "1px solid rgb(44 40 28)", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [formatUsd(v)]}
                  />
                  <Bar dataKey="value" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted">No positions yet.</div>
            )}
          </CardBody>
        </Card>

        {/* Radar allocation */}
        <Card>
          <CardHeader><CardTitle>Allocation Radar</CardTitle></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgb(44 40 28)" />
                <PolarAngleAxis dataKey="asset" tick={{ fontSize: 11, fill: "rgb(148 132 100)" }} />
                <Radar name="Weight %" dataKey="weight" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{ background: "rgb(22 21 30)", border: "1px solid rgb(44 40 28)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, "Allocation"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Per-asset sparklines */}
      <div>
        <h2 className="text-base font-semibold mb-4">30-Day Price Charts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ELON_ASSETS.map(asset => (
            <div key={asset.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                    style={{ background: asset.color + "22", color: asset.color }}>
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <span className="text-sm font-semibold">{asset.symbol}</span>
                </div>
                <span className={`text-xs font-semibold ${asset.changePct24h >= 0 ? "text-success" : "text-danger"}`}>
                  {asset.changePct24h >= 0 ? "+" : ""}{asset.changePct24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-base font-bold tabular-nums mb-1">{formatUsd(asset.basePrice)}</p>
              <Sparkline data={asset.priceHistory} positive={asset.changePct24h >= 0} id={`analytics-${asset.id}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
