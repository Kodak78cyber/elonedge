"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Invalid credentials.");
        setBusy(false);
        return;
      }
      if (data.token && typeof window !== "undefined") {
        try { localStorage.setItem("elon_admin_token", data.token); } catch {}
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(String(err));
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#050508", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", maxWidth: 360, padding: 24, border: "1px solid #2c2820", borderRadius: 16, background: "#0e0d14" }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Administrator sign in</h1>
        <p style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>Restricted area.</p>
        <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", height: 40, marginBottom: 12, padding: "0 12px", border: "1px solid #2c2820", borderRadius: 6, background: "#050508", color: "#fff" }}
        />
        <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", height: 40, marginBottom: 12, padding: "0 12px", border: "1px solid #2c2820", borderRadius: 6, background: "#050508", color: "#fff" }}
        />
        {error && <p style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{ width: "100%", height: 40, background: "#D4AF37", color: "#000", fontWeight: 600, border: "none", borderRadius: 12, cursor: "pointer" }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
