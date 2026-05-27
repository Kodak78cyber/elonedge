"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { loginUser } from "@/lib/elon-store";

export function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email    = String(fd.get("email")    || "");
    const password = String(fd.get("password") || "");
    const result = await loginUser(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }
    toast.success("Welcome back!");
    // Hard navigation guarantees the freshly-set session cookie is sent on the
    // next request — client-side router.push can race with cookie storage on
    // mobile Safari.
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="password" className="mb-0">Password</Label>
          <a href="#" className="text-xs text-muted hover:text-accent transition">Forgot password?</a>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent"
            aria-label="Toggle password"
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <FieldError>{error}</FieldError>
      <Button
        type="submit"
        disabled={busy}
        className="w-full bg-accent text-accent-fg hover:brightness-110 font-semibold"
      >
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
