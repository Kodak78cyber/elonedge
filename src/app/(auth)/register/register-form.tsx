"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { registerUser } from "@/lib/elon-store";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Singapore", "UAE", "India", "Japan", "Brazil", "Other",
];

export function RegisterForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy]     = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const fd      = new FormData(e.currentTarget);
    const name    = String(fd.get("name")     || "").trim();
    const email   = String(fd.get("email")    || "").trim();
    const password= String(fd.get("password") || "");
    const country = String(fd.get("country")  || "");

    const errs: Record<string, string> = {};
    if (name.length < 2)        errs.name     = "Name must be at least 2 characters.";
    if (!email.includes("@"))   errs.email    = "Enter a valid email address.";
    if (password.length < 6)    errs.password = "Password must be at least 6 characters.";
    if (!country)               errs.country  = "Please select your country.";

    if (Object.keys(errs).length) { setErrors(errs); setBusy(false); return; }

    const result = await registerUser({ name, email, password, country });
    setBusy(false);
    if (!result.ok) { setErrors({ email: result.error ?? "Registration failed." }); return; }

    toast.success("Account created! Welcome to ElonEdge.");
    // Hard navigation guarantees the freshly-set session cookie is sent on the
    // next request — client-side router.push can race with cookie storage on
    // mobile Safari.
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required minLength={2} placeholder="Jane Doe" />
        <FieldError>{errors.name}</FieldError>
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          name="country"
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent transition"
        >
          <option value="">Select country…</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <FieldError>{errors.country}</FieldError>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            minLength={6}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
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
        <FieldError>{errors.password}</FieldError>
      </div>
      <p className="text-xs text-muted">
        By signing up you agree to our{" "}
        <a href="#" className="text-accent hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
      </p>
      <Button
        type="submit"
        disabled={busy}
        className="w-full bg-accent text-accent-fg hover:brightness-110 font-semibold"
      >
        {busy ? "Creating account…" : "Create account — it's free"}
      </Button>
    </form>
  );
}
