"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { getPageTitle, userNav } from "./nav-config";
import { SidebarNav } from "./sidebar";
import { useElonStore } from "@/lib/elon-context";
import { logoutUser } from "@/lib/elon-store";
import { formatUsd } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, balance } = useElonStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pageTitle = getPageTitle(pathname);
  const initial = (user?.name || user?.email || "?").slice(0, 1).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => { setDrawerOpen(false); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  async function handleSignOut() {
    await logoutUser();
    router.push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-bg/85 backdrop-blur">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-accent transition"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
              <span className="hidden md:inline text-muted/60">Dashboard</span>
              <ChevronRight className="size-3.5 hidden md:inline text-muted/40" />
              <span className="font-semibold text-fg">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 h-9 text-sm">
              <span className="text-muted text-xs">Balance</span>
              <span className="font-semibold text-accent tabular-nums">{formatUsd(balance)}</span>
            </div>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-xl border border-transparent hover:border-border hover:bg-surface transition"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="size-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-xs font-bold">
                  {initial}
                </div>
                <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                  {user?.name || user?.email?.split("@")[0] || "Investor"}
                </span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-64 rounded-2xl border border-border bg-elevated shadow-gold p-2 animate-fade-in"
                >
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-sm font-semibold truncate">{user?.name || "Investor"}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                    <p className="text-xs text-accent mt-0.5 font-medium">{formatUsd(balance)} available</p>
                  </div>
                  <div className="py-1.5">
                    <MenuLink href="/dashboard"          icon={UserRound} label="My portfolio" />
                    <MenuLink href="/dashboard/settings" icon={Settings}  label="Account settings" />
                  </div>
                  <div className="border-t border-border pt-1.5">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition"
                    >
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!drawerOpen}
      >
        <button
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-surface border-r border-border flex flex-col transition-transform",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Logo />
            <button
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>
          <SidebarNav sections={userNav} pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          <div className="border-t border-border p-4 flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center text-sm font-bold">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Investor"}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:border-danger hover:text-danger transition"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}

function MenuLink({ href, icon: Icon, label }: { href: string; icon: typeof UserRound; label: string }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-surface transition"
    >
      <Icon className="size-4 text-muted" />
      {label}
    </Link>
  );
}
