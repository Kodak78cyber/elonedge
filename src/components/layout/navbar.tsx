"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#assets",   label: "Assets" },
  { href: "/#features", label: "Why ElonEdge" },
  { href: "/login",     label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "transition hover:text-accent",
                  pathname === l.href ? "text-accent" : "text-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <LinkButton href="/login"    variant="ghost"   size="sm">Sign in</LinkButton>
          <LinkButton href="/register" variant="primary" size="sm"
            className="bg-accent text-accent-fg hover:brightness-110 font-semibold">
            Get Started
          </LinkButton>
        </div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="container flex flex-col gap-2 py-4">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="py-2 text-sm text-muted" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <LinkButton href="/login"    variant="secondary" size="sm" className="flex-1">Sign in</LinkButton>
              <LinkButton href="/register" size="sm"
                className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
                Get Started
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
