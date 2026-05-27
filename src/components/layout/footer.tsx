import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const cols = [
  {
    title: "Product",
    items: [
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/contact", label: "Contact" },
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/#privacy", label: "Privacy" },
      { href: "/#terms", label: "Terms" },
      { href: "/#compliance", label: "Compliance" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Logo />
          <p className="text-sm text-muted max-w-xs">
            The modern fintech investment dashboard and crypto portfolio platform
            for ambitious investors.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="text-sm">
            <h4 className="font-semibold mb-3">{c.title}</h4>
            <ul className="space-y-2">
              {c.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-muted hover:text-accent transition">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>© {new Date().getFullYear()} VaultFlow. All rights reserved.</span>
          <span>Crafted with care for modern investors.</span>
        </div>
      </div>
    </footer>
  );
}
