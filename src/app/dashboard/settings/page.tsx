"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useElonStore } from "@/lib/elon-context";
import { logoutUser } from "@/lib/elon-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useElonStore();
  const router   = useRouter();
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await logoutUser();
    toast.success("Signed out. See you soon!");
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <header>
        <Badge tone="accent" className="mb-2">Account</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">Manage your ElonEdge account preferences.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Profile */}
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardBody>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="s-name">Full name</Label>
                <Input id="s-name" defaultValue={user?.name || ""} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="s-email">Email address</Label>
                <Input id="s-email" type="email" defaultValue={user?.email || ""} disabled className="opacity-60 cursor-not-allowed" />
                <p className="mt-1 text-xs text-muted">Contact support to update your registered email.</p>
              </div>
              <div>
                <Label htmlFor="s-country">Country</Label>
                <Input id="s-country" defaultValue={user?.country || ""} placeholder="Country" />
              </div>
              <div>
                <Label>Member since</Label>
                <p className="text-sm text-muted mt-1">
                  {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                </p>
              </div>
              <Button type="submit" className={`bg-accent text-accent-fg hover:brightness-110 font-semibold ${saved ? "opacity-70" : ""}`}>
                {saved ? "Saved ✓" : "Save changes"}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Security */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted mt-0.5">Add an extra layer of security</p>
                </div>
                <Badge tone="warn">Set up</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Session management</p>
                  <p className="text-xs text-muted mt-0.5">Currently active on this device</p>
                </div>
                <Badge tone="success">Active</Badge>
              </div>
              <Button variant="danger" onClick={handleSignOut} className="w-full">
                Sign out of ElonEdge
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
            <CardBody>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Account type</span>
                  <span className="font-medium text-accent">Individual Investor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Platform</span>
                  <span>ElonEdge v1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Insurance</span>
                  <span>SIPC up to $500,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Compliance</span>
                  <span>SEC-registered broker</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
