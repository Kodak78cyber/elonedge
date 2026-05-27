"use client";

import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Sparkline } from "./sparkline";
import { type ElonAsset } from "@/lib/elon-assets";
import { formatUsd } from "@/lib/utils";

interface Props {
  asset: ElonAsset;
  holdingShares?: number;
  onInvest: (assetId: string) => void;
}

export function AssetCard({ asset, holdingShares = 0, onInvest }: Props) {
  const positive = asset.changePct24h >= 0;
  const holdingValue = holdingShares * asset.basePrice;

  return (
    <div className="rounded-2xl border border-border bg-surface card-hover flex flex-col overflow-hidden">
      {/* Top bar with asset color */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${asset.color}88, ${asset.color}22)` }}
      />

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: asset.color + "22", color: asset.color }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{asset.name}</p>
              <p className="text-[11px] text-muted">{asset.category}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {positive ? "+" : ""}{asset.changePct24h.toFixed(2)}%
          </span>
        </div>

        {/* Price */}
        <div>
          <p className="text-xl font-bold tabular-nums">{formatUsd(asset.basePrice)}</p>
          <p className={`text-xs tabular-nums mt-0.5 ${positive ? "text-success" : "text-danger"}`}>
            {positive ? "+" : ""}{formatUsd(asset.change24h)} today
          </p>
        </div>

        {/* Sparkline */}
        <div className="-mx-1">
          <Sparkline data={asset.priceHistory} positive={positive} id={asset.id} />
        </div>

        {/* Holding info */}
        {holdingShares > 0 && (
          <div className="rounded-lg border border-border bg-elevated/50 px-3 py-2 flex items-center justify-between text-xs">
            <span className="text-muted">Your position</span>
            <span className="font-semibold">
              {holdingShares.toFixed(4)} shares · <span className="text-accent">{formatUsd(holdingValue)}</span>
            </span>
          </div>
        )}

        {/* Invest button */}
        <button
          onClick={() => onInvest(asset.id)}
          className="mt-auto flex items-center justify-center gap-1.5 h-9 w-full rounded-xl border border-accent/40 bg-accent/10 text-accent text-sm font-semibold hover:bg-accent hover:text-accent-fg transition"
        >
          <Zap className="size-3.5" />
          Quick Invest
        </button>
      </div>
    </div>
  );
}
