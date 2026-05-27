"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { isActive, type NavSection, userNav } from "./nav-config";
import { cn } from "@/lib/utils";

export function SidebarNav({
  sections,
  pathname,
  onNavigate,
}: {
  sections: NavSection[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-5 text-sm">
      {sections.map(section => (
        <div key={section.title}>
          <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold text-muted/60">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map(item => {
              const active = isActive(item.href, pathname);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition group",
                      active
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "text-muted hover:bg-elevated hover:text-fg",
                    )}
                  >
                    <Icon className={cn("size-4 transition", active ? "text-accent" : "group-hover:text-fg")} />
                    <span>{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <Logo />
      </div>
      <SidebarNav sections={userNav} pathname={pathname} />
      <div className="p-3 m-3 rounded-xl border border-accent/20 bg-accent/5 text-xs">
        <p className="font-semibold text-accent mb-1">ElonEdge Premium</p>
        <p className="text-muted">Access exclusive pre-IPO allocations and early-stage venture rounds.</p>
      </div>
    </aside>
  );
}
