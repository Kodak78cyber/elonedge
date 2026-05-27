"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvestModal } from "@/components/dashboard/invest-modal";
import { Sparkline } from "@/components/dashboard/sparkline";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { useElonStore } from "@/lib/elon-context";
import { formatUsd } from "@/lib/utils";

export default function InvestPage() {
  const { balance, holdings } = useElonStore();
  const [modalOpen, setModalOpen]     = useState(false);
  const [selectedId, setSelectedId]   = useState<string | undefined>();

  function openModal(id: string) {
    setSelectedId(id);
    setModalOpen(true);
  }

  return (
    <>
      <InvestModal open={modalOpen} onClose={() => setModalOpen(false)} preselectedId={selectedId} />

      <div className="space-y-6">
        <header>
          <Badge tone="accent" className="mb-2">Invest</Badge>
          <h1 className="text-2xl font-bold tracking-tight">Market</h1>
          <p className="text-sm text-muted">
            Buy positions in Elon Musk&apos;s most transformative ventures.{" "}
            <span className="text-accent font-medium">Available balance: {formatUsd(balance)}</span>
          </p>
        </header>

        {/* Asset table */}
        <Card>
          <CardHeader>
            <CardTitle>All Assets</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-muted border-b border-border">
                  <th className="py-2.5 pl-6 pr-3 font-medium">Asset</th>
                  <th className="px-3 font-medium text-right">Price</th>
                  <th className="px-3 font-medium text-right">24h Change</th>
                  <th className="px-3 font-medium">7-Day</th>
                  <th className="px-3 font-medium text-right">Mkt Cap</th>
                  <th className="px-3 font-medium text-right">Est. Return / yr</th>
                  <th className="px-3 font-medium text-right">Your Position</th>
                  <th className="px-3 pr-6 font-medium" />
                </tr>
              </thead>
              <tbody>
                {ELON_ASSETS.map(asset => {
                  const h = holdings.find(x => x.assetId === asset.id);
                  const posValue = h ? h.shares * asset.basePrice : 0;
                  const positive = asset.changePct24h >= 0;
                  return (
                    <tr key={asset.id} className="border-t border-border hover:bg-elevated/40 transition">
                      <td className="py-3.5 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: asset.color + "22", color: asset.color }}
                          >
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{asset.name}</p>
                            <p className="text-xs text-muted">{asset.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 text-right tabular-nums font-semibold">
                        {formatUsd(asset.basePrice)}
                      </td>
                      <td className="px-3 text-right tabular-nums">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                          {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                          {positive ? "+" : ""}{asset.changePct24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-3 w-28">
                        <Sparkline data={asset.priceHistory.slice(-14)} positive={positive} id={`inv-${asset.id}`} />
                      </td>
                      <td className="px-3 text-right text-muted text-xs">{asset.marketCap}</td>
                      <td className="px-3 text-right">
                        <span className="text-success text-xs font-semibold">+{asset.annualReturn}%</span>
                      </td>
                      <td className="px-3 text-right text-xs text-muted">
                        {h ? (
                          <span className="text-accent font-medium">{formatUsd(posValue)}</span>
                        ) : (
                          <span className="text-muted/60">—</span>
                        )}
                      </td>
                      <td className="px-3 pr-6 text-right">
                        <button
                          onClick={() => openModal(asset.id)}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-accent/30 bg-accent/10 text-accent text-xs font-semibold hover:bg-accent hover:text-accent-fg transition"
                        >
                          <Zap className="size-3" /> Invest
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
            <p className="text-xs text-accent uppercase tracking-wide font-semibold mb-2">How it works</p>
            <p className="text-sm text-muted leading-relaxed">
              Select an asset, enter your investment amount in USD, and confirm. Your position
              is calculated at the current market price.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">No minimums</p>
            <p className="text-sm text-muted leading-relaxed">
              Start with as little as $1. Buy fractional shares of every asset — including
              private companies like SpaceX and Neuralink.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">Projected returns</p>
            <p className="text-sm text-muted leading-relaxed">
              Annual return estimates are based on historical venture growth rates. Past
              performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
