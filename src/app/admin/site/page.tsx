"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin-client";

const FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: "stats.activeInvestors", label: "Active investors",   hint: 'e.g. "14,832+"' },
  { key: "stats.aum",             label: "Assets under management", hint: 'e.g. "$2.4B"' },
  { key: "stats.avgReturn",       label: "Avg. annual return", hint: 'e.g. "34.7%"' },
  { key: "stats.ventures",        label: "Ventures count",     hint: 'e.g. "7"' },
  { key: "hero.tagline",          label: "Homepage hero tagline", hint: '"Live markets · 7 assets · $2.4B AUM"' },
];

export default function AdminSitePage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/config", { credentials: "include", headers: adminAuthHeaders() });
    const data = await res.json();
    setConfig(data.config ?? {});
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function set(k: string, v: string) {
    setConfig(prev => ({ ...prev, [k]: v }));
  }

  async function save() {
    setBusy(true);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      credentials: "include",
      headers: adminAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(config),
    });
    setBusy(false);
    if (res.ok) { toast.success("Site copy updated."); load(); }
    else        { toast.error("Save failed."); }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Site Copy</h1>
        <p className="text-sm text-muted">Edit the public homepage headline numbers and tagline.</p>
      </header>

      {loading && <p className="text-muted text-sm">Loading…</p>}

      {!loading && (
        <Card>
          <CardBody className="space-y-4">
            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium block mb-1">{f.label}</label>
                <input
                  type="text"
                  value={config[f.key] ?? ""}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.hint}
                  className="w-full h-10 rounded-md border border-border bg-surface px-3 text-sm focus:outline-none focus:border-accent"
                />
                {f.hint && <p className="text-xs text-muted mt-1">{f.hint}</p>}
              </div>
            ))}
            <Button onClick={save} disabled={busy} className="w-full bg-accent text-accent-fg gap-2">
              <Save className="size-4" />
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
