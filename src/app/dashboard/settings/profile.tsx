"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ProfilePanel({ name, email, verified }: { name: string; email: string; verified: boolean }) {
  const [saving, setSaving] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData(e.currentTarget);
        const r = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: fd.get("name") }),
        });
        setSaving(false);
        if (r.ok) toast.success("Profile updated");
        else toast.error("Update failed");
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name">Display name</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="flex items-center gap-2">
          <Input id="email" name="email" defaultValue={email} disabled />
          <Badge tone={verified ? "success" : "warn"}>{verified ? "Verified" : "Unverified"}</Badge>
        </div>
      </div>
      {!verified && (
        <button
          type="button"
          onClick={async () => {
            const r = await fetch("/api/auth/verify-email", { method: "POST" });
            if (r.ok) toast.success("Verification email sent (check server logs in dev)");
            else toast.error("Could not send verification email");
          }}
          className="text-xs text-accent hover:underline"
        >
          Resend verification email →
        </button>
      )}
      <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
    </form>
  );
}
