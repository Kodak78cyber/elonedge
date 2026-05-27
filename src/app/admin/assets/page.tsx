"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin-client";
import { formatUsd } from "@/lib/utils";

interface AdminAsset {
  id: string;
  symbol: string;
  name: string;
  category: string;
  basePrice: number;
  changePct24h: number;
  annualReturn: number;
  marketCap: string;
  color: string;
}

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/assets", { credentials: "include", headers: adminAuthHeaders() });
    const data = await res.json();
    setAssets(data.assets ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function reseed() {
    const res = await fetch("/api/admin/seed", { method: "POST", credentials: "include", headers: adminAuthHeaders() });
    if (res.ok) { toast.success("Seeded."); load(); }
    else        { toast.error("Seed failed."); }
  }

  return (
    <div className="space-y-5">
      <header className="flex justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-sm text-muted">Edit live prices, daily change %, projected annual return.</p>
        </div>
        {!loading && assets.length === 0 && (
          <Button onClick={reseed} className="bg-accent text-accent-fg">Seed from defaults</Button>
        )}
      </header>

      {loading && <p className="text-muted text-sm">Loading…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map(a => <AssetCard key={a.id} asset={a} onSaved={load} />)}
      </div>
    </div>
  );
}

function AssetCard({ asset, onSaved }: { asset: AdminAsset; onSaved: () => void }) {
  const [form, setForm] = useState({
    basePrice:    asset.basePrice.toString(),
    changePct24h: asset.changePct24h.toString(),
    annualReturn: asset.annualReturn.toString(),
    marketCap:    asset.marketCap,
    category:     asset.category,
    name:         asset.name,
  });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/admin/assets/${asset.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: adminAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        basePrice:    parseFloat(form.basePrice),
        changePct24h: parseFloat(form.changePct24h),
        annualReturn: parseFloat(form.annualReturn),
        marketCap:    form.marketCap,
        category:     form.category,
        name:         form.name,
      }),
    });
    setBusy(false);
    if (res.ok) { toast.success(`${asset.symbol} updated.`); onSaved(); }
    else        { toast.error("Save failed."); }
  }

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b border-border">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: asset.color + "22", color: asset.color }}
          >
            {asset.symbol.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{asset.symbol}</p>
            <p className="text-xs text-muted truncate">{asset.id}</p>
          </div>
          <p className="text-sm tabular-nums">{formatUsd(asset.basePrice)}</p>
        </div>

        <Row label="Name">
          <input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={inp} />
        </Row>
        <Row label="Base price (USD)">
          <input type="number" step="any" value={form.basePrice} onChange={e => set("basePrice", e.target.value)} className={inp} />
        </Row>
        <Row label="24h change %">
          <input type="number" step="any" value={form.changePct24h} onChange={e => set("changePct24h", e.target.value)} className={inp} />
        </Row>
        <Row label="Annual return %">
          <input type="number" step="any" value={form.annualReturn} onChange={e => set("annualReturn", e.target.value)} className={inp} />
        </Row>
        <Row label="Market cap">
          <input type="text" value={form.marketCap} onChange={e => set("marketCap", e.target.value)} className={inp} placeholder="$789.4B" />
        </Row>
        <Row label="Category">
          <input type="text" value={form.category} onChange={e => set("category", e.target.value)} className={inp} />
        </Row>

        <Button onClick={save} disabled={busy} className="w-full bg-accent text-accent-fg gap-2">
          <Save className="size-4" />
          {busy ? "Saving…" : "Save"}
        </Button>
      </CardBody>
    </Card>
  );
}

const inp = "w-full h-9 rounded-md border border-border bg-surface px-2 text-sm focus:outline-none focus:border-accent";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted mb-1 block">{label}</span>
      {children}
    </label>
  );
}
