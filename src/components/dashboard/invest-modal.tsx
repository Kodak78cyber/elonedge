"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ELON_ASSETS, type ElonAsset } from "@/lib/elon-assets";
import { useElonStore } from "@/lib/elon-context";
import { formatUsd } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedId?: string;
}

export function InvestModal({ open, onClose, preselectedId }: Props) {
  const { balance, holdings, buy } = useElonStore();
  const [assetId, setAssetId] = useState(preselectedId ?? ELON_ASSETS[0].id);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (preselectedId) setAssetId(preselectedId);
  }, [preselectedId]);

  const asset = ELON_ASSETS.find(a => a.id === assetId) as ElonAsset;
  const usdAmount = parseFloat(amount) || 0;
  const shares = usdAmount > 0 ? usdAmount / asset.basePrice : 0;
  const projectedReturn1y = usdAmount * (1 + asset.annualReturn / 100);
  const currentHolding = holdings.find(h => h.assetId === assetId);
  const insufficient = usdAmount > balance;

  async function handleConfirm() {
    if (usdAmount <= 0 || insufficient) return;
    setBusy(true);
    const ok = await buy(asset.id, asset.name, asset.symbol, usdAmount, asset.basePrice);
    setBusy(false);
    if (ok) {
      toast.success(`Invested ${formatUsd(usdAmount)} in ${asset.name}`);
      setAmount("");
      onClose();
    } else {
      toast.error("Insufficient balance");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-gold animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">Quick Invest</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-elevated transition"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Asset selector */}
          <div>
            <Label htmlFor="asset-select">Select Asset</Label>
            <select
              id="asset-select"
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent transition"
            >
              {ELON_ASSETS.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.symbol}) — {formatUsd(a.basePrice)}
                </option>
              ))}
            </select>
          </div>

          {/* Asset info strip */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-elevated/50 p-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: asset.color + "22", color: asset.color }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{asset.name}</p>
              <p className="text-xs text-muted">{asset.category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{formatUsd(asset.basePrice)}</p>
              <p className={`text-xs tabular-nums ${asset.changePct24h >= 0 ? "text-success" : "text-danger"}`}>
                {asset.changePct24h >= 0 ? "▲" : "▼"} {Math.abs(asset.changePct24h).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="amount">Amount (USD)</Label>
              <span className="text-xs text-muted">
                Balance: <span className="text-accent font-medium">{formatUsd(balance)}</span>
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-7"
              />
            </div>
            {/* Quick amount buttons */}
            <div className="flex gap-2 mt-2">
              {[100, 500, 1000, 5000].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(String(Math.min(v, balance)))}
                  className="flex-1 h-7 rounded-lg border border-border text-xs text-muted hover:border-accent hover:text-accent transition"
                >
                  ${v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
            </div>
          </div>

          {/* Order summary */}
          {usdAmount > 0 && (
            <div className="rounded-xl border border-border bg-elevated/40 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Shares purchased</span>
                <span className="tabular-nums font-medium">{shares.toFixed(4)} {asset.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Price per share</span>
                <span className="tabular-nums">{formatUsd(asset.basePrice)}</span>
              </div>
              {currentHolding && (
                <div className="flex justify-between">
                  <span className="text-muted">Current holding</span>
                  <span className="tabular-nums">{currentHolding.shares.toFixed(4)} shares</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="text-muted flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> Est. 1-year return
                </span>
                <span className="text-success tabular-nums font-semibold">
                  {formatUsd(projectedReturn1y)} (+{asset.annualReturn}%)
                </span>
              </div>
            </div>
          )}

          {insufficient && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>Insufficient balance. Top up your wallet first.</span>
            </div>
          )}
        </div>

        <div className="p-5 pt-0 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={busy || usdAmount <= 0 || insufficient}
            className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold"
          >
            {busy ? "Processing…" : `Invest ${usdAmount > 0 ? formatUsd(usdAmount) : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
