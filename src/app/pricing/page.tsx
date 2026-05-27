import { Check, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/forever",
    blurb: "Get started in seconds. Track up to 3 portfolios and use the full dashboard.",
    cta: "Get started",
    href: "/register",
    features: ["3 portfolios", "Daily price refresh", "Email support", "Community Discord"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    blurb: "For active investors who want richer analytics and live integrations.",
    cta: "Start 14-day trial",
    href: "/register",
    features: [
      "Unlimited portfolios",
      "Realtime CoinGecko prices",
      "Coinbase Commerce + NOWPayments",
      "Webhook event log",
      "2FA + audit trail",
      "Priority email support",
    ],
    highlight: true,
  },
  {
    name: "Team",
    price: "$79",
    cadence: "/month",
    blurb: "Multi-seat workspaces with role-based admin controls and SSO-ready.",
    cta: "Contact sales",
    href: "/contact",
    features: [
      "Everything in Pro",
      "Up to 10 admin seats",
      "Role-based permissions",
      "SLA + 99.99% uptime",
      "Activity export (CSV)",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container py-16 text-center">
          <Badge tone="accent" className="mb-4 mx-auto">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted max-w-xl mx-auto">Every plan includes the full dashboard, real-time prices and secure auth. Upgrade for unlimited portfolios, live deposits and team features.</p>
        </section>

        <section className="container pb-20 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={
                "p-7 relative card-hover " +
                (t.highlight ? "border-accent/60 shadow-glow" : "")
              }
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-accent text-accent-fg px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                  <Sparkles className="size-3.5" /> Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted">{t.blurb}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{t.price}</span>
                <span className="text-sm text-muted">{t.cadence}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 mt-0.5 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <LinkButton href={t.href} variant={t.highlight ? "primary" : "outline"} className="mt-7 w-full">
                {t.cta}
              </LinkButton>
            </Card>
          ))}
        </section>

        <section className="container pb-20">
          <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
            All prices in USD. Plans renew monthly. Cancel anytime. Need a custom enterprise plan? <a href="/contact" className="text-accent">Get in touch</a>.
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
