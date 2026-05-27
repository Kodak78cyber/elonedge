"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, BarChart3, Settings as SettingsIcon, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { adminAuthHeaders, ADMIN_TOKEN_KEY } from "@/lib/admin-client";

const NAV = [
  { href: "/admin",         label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/users",   label: "Users",     icon: Users },
  { href: "/admin/assets",  label: "Assets",    icon: BarChart3 },
  { href: "/admin/site",    label: "Site copy", icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "no-auth">("loading");

  // The login page is a sibling under /admin but should render unauthenticated.
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      setState("ok");
      return;
    }
    fetch("/api/admin/users", { credentials: "include", headers: adminAuthHeaders() })
      .then(r => {
        if (r.ok) setState("ok");
        else setState("no-auth");
      })
      .catch(() => setState("no-auth"));
  }, [isLoginRoute]);

  useEffect(() => {
    if (state === "no-auth") {
      router.replace("/admin/login");
    }
  }, [state, router]);

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch {}
    router.push("/admin/login");
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (state === "loading" || state === "no-auth") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-muted text-sm">
          {state === "loading" ? "Loading admin…" : "Redirecting to sign-in…"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-surface">
        <div className="h-16 px-4 flex items-center border-b border-border">
          <Logo />
        </div>
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-muted uppercase flex items-center gap-1.5">
          <Shield className="size-3" /> Admin Panel
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  active
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted hover:text-fg hover:bg-elevated",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10"
          >
            <LogOut className="size-4" />
            Sign out of admin
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden h-14 border-b border-border bg-bg/85 backdrop-blur sticky top-0 z-30 flex items-center px-4 gap-3">
          <Shield className="size-5 text-accent" />
          <h1 className="font-semibold">Admin</h1>
          <nav className="ml-auto flex gap-1 flex-wrap">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-2 py-1 rounded-md text-xs",
                  pathname === href ? "bg-accent/15 text-accent" : "text-muted",
                )}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="px-2 py-1 rounded-md text-xs text-danger"
              aria-label="Sign out"
            >
              <LogOut className="size-3.5" />
            </button>
          </nav>
        </header>
        <div className="flex-1 p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
