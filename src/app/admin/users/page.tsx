"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAuthHeaders } from "@/lib/admin-client";
import { formatUsd } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  country: string;
  balance: number;
  joinedAt: string;
  _count: { holdings: number; transactions: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users", { credentials: "include", headers: adminAuthHeaders() });
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function patch(id: string, body: Partial<{ balance: number }>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: adminAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    if (res.ok) {
      toast.success("User updated.");
      load();
    } else {
      toast.error("Update failed.");
    }
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Delete account ${email}? This wipes their holdings and transactions.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: adminAuthHeaders(),
    });
    if (res.ok) { toast.success("Deleted."); load(); }
    else        { toast.error("Delete failed."); }
  }

  const filtered = users.filter(u =>
    !q || u.email.toLowerCase().includes(q.toLowerCase()) || u.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted">Manage accounts, balances, and admin roles.</p>
      </header>

      <div className="relative max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by name or email…"
          className="pl-9"
        />
      </div>

      <Card>
        <CardBody className="!p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="text-left text-xs text-muted border-b border-border">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-right">Holdings</th>
                <th className="px-4 py-3 text-right">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">No users found.</td></tr>
              )}
              {filtered.map(u => (
                <UserRow key={u.id} user={u} onSave={patch} onDelete={remove} />
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

function UserRow({
  user, onSave, onDelete,
}: {
  user: AdminUser;
  onSave: (id: string, body: Partial<{ balance: number }>) => void;
  onDelete: (id: string, email: string) => void;
}) {
  const [bal, setBal] = useState(user.balance.toString());
  const dirty = parseFloat(bal) !== user.balance && !isNaN(parseFloat(bal));

  return (
    <tr className="border-b border-border/60 hover:bg-elevated/30">
      <td className="px-4 py-3">
        <p className="font-medium">{user.name}</p>
        <p className="text-xs text-muted">{user.email}</p>
      </td>
      <td className="px-4 py-3 text-muted">{user.country}</td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <span className="text-muted text-xs">$</span>
          <input
            type="number"
            value={bal}
            onChange={e => setBal(e.target.value)}
            className="w-28 h-8 rounded-md border border-border bg-surface px-2 text-right tabular-nums text-sm focus:outline-none focus:border-accent"
          />
          {dirty && (
            <button
              onClick={() => onSave(user.id, { balance: parseFloat(bal) })}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg hover:brightness-110"
              aria-label="Save balance"
            >
              <Save className="size-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">current: {formatUsd(user.balance)}</p>
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{user._count.holdings}</td>
      <td className="px-4 py-3 text-right text-muted text-xs">
        {new Date(user.joinedAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => onDelete(user.id, user.email)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:text-danger hover:bg-danger/10"
          aria-label="Delete user"
        >
          <Trash2 className="size-4" />
        </button>
      </td>
    </tr>
  );
}
