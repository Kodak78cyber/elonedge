"use client";

import { Bell } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useElonStore } from "@/lib/elon-context";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { timeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const { transactions } = useElonStore();

  /* Turn recent transactions into notification-style items */
  const notifications = transactions.slice(0, 20).map(t => {
    const asset = t.assetId ? ELON_ASSETS.find(a => a.id === t.assetId) : null;
    const title =
      t.type === "BUY"      ? `Purchased ${asset?.name ?? "asset"}` :
      t.type === "SELL"     ? `Sold ${asset?.name ?? "asset"}` :
      t.type === "DEPOSIT"  ? "Deposit completed"   :
                              "Withdrawal completed";
    const body =
      t.type === "BUY"      ? `Bought ${t.shares?.toFixed(4)} ${asset?.symbol} @ $${t.pricePerShare?.toFixed(2)}` :
      t.type === "SELL"     ? `Sold ${t.shares?.toFixed(4)} ${asset?.symbol} @ $${t.pricePerShare?.toFixed(2)}` :
      t.type === "DEPOSIT"  ? `$${t.amount.toLocaleString()} added to your wallet` :
                              `$${t.amount.toLocaleString()} withdrawn from your wallet`;
    const kind: "accent" | "success" | "warn" =
      t.type === "BUY" || t.type === "DEPOSIT" ? "accent" :
      t.type === "SELL" ? "success" : "warn";

    return { id: t.id, title, body, kind, date: t.date };
  });

  return (
    <div className="space-y-6">
      <header>
        <Badge tone="accent" className="mb-2">Inbox</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted">Your recent account activity and alerts.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <ul className="divide-y divide-border">
          {notifications.map(n => (
            <li key={n.id} className="px-6 py-4 flex items-start gap-3">
              <div className="size-9 rounded-xl flex items-center justify-center bg-accent/10 text-accent flex-shrink-0">
                <Bell className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <Badge tone={n.kind}>{n.kind.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-muted">{n.body}</p>
                <p className="text-xs text-muted/60 mt-1">{timeAgo(new Date(n.date))}</p>
              </div>
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="px-6 py-10 text-center text-muted text-sm">
              No notifications yet. Start investing to see activity here.
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
