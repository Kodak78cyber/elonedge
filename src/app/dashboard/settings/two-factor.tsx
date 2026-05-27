"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function TwoFactorPanel({ enabled }: { enabled: boolean }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    const r = await fetch("/api/auth/2fa/setup", { method: "POST" });
    setLoading(false);
    if (!r.ok) return toast.error("Could not start 2FA setup");
    const data = await r.json();
    setSecret(data.secret);
    setQr(data.qrCodeDataUrl);
  }

  async function confirm() {
    setLoading(true);
    const r = await fetch("/api/auth/2fa/enable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    setLoading(false);
    if (r.ok) {
      toast.success("Two-factor authentication enabled");
      location.reload();
    } else {
      const d = await r.json().catch(() => ({}));
      toast.error(d.error || "Invalid code");
    }
  }

  async function disable() {
    setLoading(true);
    const r = await fetch("/api/auth/2fa/disable", { method: "POST" });
    setLoading(false);
    if (r.ok) {
      toast.success("Two-factor authentication disabled");
      location.reload();
    } else toast.error("Failed to disable 2FA");
  }

  if (enabled) {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-muted">Two-factor authentication is currently enabled. You'll need a code from your authenticator app on every sign-in.</p>
        <Button onClick={disable} variant="danger" size="sm" disabled={loading}>{loading ? "Disabling…" : "Disable 2FA"}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      {!secret ? (
        <>
          <p className="text-muted">Add a second factor to your account using an authenticator app like 1Password, Authy or Google Authenticator.</p>
          <Button onClick={start} disabled={loading}>{loading ? "Generating…" : "Begin setup"}</Button>
        </>
      ) : (
        <>
          <div className="rounded-xl border border-border p-4 bg-elevated/50 flex items-start gap-4">
            {qr && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr} alt="2FA QR code" className="size-32 rounded-lg bg-white p-1" />
            )}
            <div className="space-y-1">
              <p className="text-muted">Scan this QR with your authenticator. Or enter the key manually:</p>
              <code className="text-xs break-all">{secret}</code>
            </div>
          </div>
          <div>
            <Label htmlFor="otp">6-digit code</Label>
            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} inputMode="numeric" maxLength={6} placeholder="123456" />
          </div>
          <Button onClick={confirm} disabled={loading || otp.length !== 6}>{loading ? "Confirming…" : "Confirm & enable"}</Button>
        </>
      )}
    </div>
  );
}
