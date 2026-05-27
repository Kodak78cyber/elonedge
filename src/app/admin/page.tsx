"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3, DollarSign, RefreshCw } from "lucide-react";
import { adminAuthHeaders } from "@/lib/admin-client";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminOverview() {
  const [stats, setStats] = useState<{ users: number; totalBalance: number; assets: number } | null>(null);
  const [seeding, setSeeding] = useState(false);

  async function load() {
    const [usersRes, assetsRes] = await Promise.all([
      fetch("/api/admin/users",  { credentials: "include", headers: adminAuthHeaders() }),
      fetch("/api/admin/assets", { credentials: "include", headers: adminAuthHeaders() }),
    ]);
    const usersJson  = await usersRes.json().catch(() => ({ users: [] }));
    const assetsJson = await assetsRes.json().catch(() => ({ assets: [] }));
    const users = usersJson.users ?? [];
    const totalBalance = users.reduce((sum: number, u: { balance: number }) => sum + (u.balance || 0), 0);
    setStats({ users: users.length, totalBalance, assets: (assetsJson.assets ?? []).length });
  }

  useEffect(() => { load(); }, []);

  async function reseed() {
    setSeeding(true);
    const res = await fetch("/api/admin/seed", { method: "POST", credentials: "include", headers: adminAuthHeaders() });
    setSeeding(false);
    if (res.ok) {
      toast.success("Assets & site config seeded.");
      load();
    } else {
      toast.error("Seed failed.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted">Manage your platform from one place.</p>
        </div>
        <Button onClick={reseed} disabled={seeding} variant="secondary" className="gap-2">
          <RefreshCw className={`size-4 ${seeding ? "animate-spin" : ""}`} />
          {seeding ? "Seeding…" : "Reset assets to defaults"}
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Total users</p>
                <p className="text-2xl font-bold tabular-nums">{stats ? stats.users : "—"}</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Combined balances</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats ? formatUsd(stats.totalBalance) : "—"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warn/15 text-warn flex items-center justify-center">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted">Tradeable assets</p>
                <p className="text-2xl font-bold tabular-nums">{stats ? stats.assets : "—"}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="space-y-3 text-sm">
          <h3 className="font-semibold">What you can edit</h3>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li><strong>Users</strong> — credit/debit balances, delete accounts.</li>
            <li><strong>Assets</strong> — live prices, daily change %, projected annual returns, market cap.</li>
            <li><strong>Site copy</strong> — homepage headline numbers (active investors, AUM, avg. return) and hero tagline.</li>
          </ul>
          <p className="text-xs text-muted pt-2 border-t border-border">
            The <em>Reset assets to defaults</em> button above wipes any custom edits and restores the original 7 Musk-asset values. Use it if you want to start over.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
