import {
  BarChart3,
  Briefcase,
  ArrowLeftRight,
  LayoutDashboard,
  Settings,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem   = { href: string; label: string; icon: LucideIcon };
export type NavSection = { title: string; items: NavItem[] };

export const userNav: NavSection[] = [
  {
    title: "Portfolio",
    items: [
      { href: "/dashboard",              label: "Overview",      icon: LayoutDashboard },
      { href: "/dashboard/invest",       label: "Invest",        icon: Briefcase },
      { href: "/dashboard/wallets",      label: "Wallet",        icon: Wallet },
      { href: "/dashboard/transactions", label: "Transactions",  icon: ArrowLeftRight },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/portfolio",   label: "Analytics",    icon: BarChart3 },
      { href: "/dashboard/settings",    label: "Settings",     icon: Settings },
    ],
  },
];

export function isActive(itemHref: string, pathname: string) {
  if (itemHref === "/dashboard") return pathname === itemHref;
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

export function getPageTitle(pathname: string): string {
  const all = userNav.flatMap(s => s.items);
  const match = all
    .filter(i => isActive(i.href, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Dashboard";
}
