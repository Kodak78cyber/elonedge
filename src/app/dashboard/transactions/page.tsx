"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useElonStore } from "@/lib/elon-context";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { formatUsd, timeAgo } from "@/lib/utils";

type Filter = "ALL" | "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";

const TONE = {
  BUY:      "success",
  SELL:     "danger",
  DEPOSIT:  "accent",
  WITHDRAW: "warn",
} as const;

export default function TransactionsPage() {
  const { transactions } = useElonStore();
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = transactions.filter(t => filter === "ALL" || t.type === filter);

  return (
    <div className="space-y-6">
      <header>
        <Badge tone="accent" className="mb-2">Activity</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted">All deposits, trades, and withdrawals on your account.</p>
      </header>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", "BUY", "SELL", "DEPOSIT", "WITHDRAW"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-lg text-xs font-medium transition ${
              filter === f
                ? "bg-accent text-accent-fg"
                : "border border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted">{filtered.length} records</span>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-muted border-b border-border">
                <th className="py-2.5 pl-6 pr-3 font-medium">Type</th>
                <th className="px-3 font-medium">Asset</th>
                <th className="px-3 font-medium text-right">Shares</th>
                <th className="px-3 font-medium text-right">Price</th>
                <th className="px-3 font-medium text-right">Amount</th>
                <th className="px-3 pr-6 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const asset = t.assetId ? ELON_ASSETS.find(a => a.id === t.assetId) : null;
                const isCredit = t.type === "SELL" || t.type === "DEPOSIT";
                return (
                  <tr key={t.id} className="border-t border-border hover:bg-elevated/40 transition">
                    <td className="py-3.5 pl-6 pr-3">
                      <Badge tone={TONE[t.type]}>{t.type}</Badge>
                    </td>
                    <td className="px-3">
                      {asset ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: asset.color + "22", color: asset.color }}>
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <span className="font-medium">{asset.symbol}</span>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-3 text-right tabular-nums text-muted">
                      {t.shares ? t.shares.toFixed(4) : "—"}
                    </td>
                    <td className="px-3 text-right tabular-nums text-muted">
                      {t.pricePerShare ? formatUsd(t.pricePerShare) : "—"}
                    </td>
                    <td className={`px-3 text-right tabular-nums font-semibold ${isCredit ? "text-success" : "text-danger"}`}>
                      {isCredit ? "+" : "-"}{formatUsd(t.amount)}
                    </td>
                    <td className="px-3 pr-6 text-right text-xs text-muted">
                      {timeAgo(new Date(t.date))}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
