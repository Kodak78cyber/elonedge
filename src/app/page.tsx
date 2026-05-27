"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, Lock, Rocket, Shield, TrendingUp, Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { formatUsd } from "@/lib/utils";
import { Sparkline } from "@/components/dashboard/sparkline";

/* ─── Ticker bar ─────────────────────────────────────────────────────────── */
function TickerBar() {
  return (
    <div className="border-b border-border bg-elevated/60 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...ELON_ASSETS, ...ELON_ASSETS].map((a, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-6 py-2 text-xs border-r border-border/40">
            <span className="font-semibold text-fg">{a.symbol}</span>
            <span className="tabular-nums text-muted">{formatUsd(a.basePrice)}</span>
            <span className={a.changePct24h >= 0 ? "text-success" : "text-danger"}>
              {a.changePct24h >= 0 ? "▲" : "▼"} {Math.abs(a.changePct24h).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Floating price card ────────────────────────────────────────────────── */
function LivePriceCard({ asset }: { asset: typeof ELON_ASSETS[0] }) {
  const [price, setPrice] = useState(asset.basePrice);
  const [up, setUp] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.47) * asset.basePrice * 0.004;
      setPrice(p => {
        const next = Number((p + delta).toFixed(2));
        setUp(next >= p);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [asset.basePrice]);

  const positive = asset.changePct24h >= 0;

  return (
    <div className="rounded-2xl border border-border bg-surface/80 backdrop-blur p-4 card-hover">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{ background: asset.color + "22", color: asset.color }}
          >
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-xs font-semibold">{asset.name}</p>
            <p className="text-[10px] text-muted">{asset.symbol}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          {positive ? "+" : ""}{asset.changePct24h.toFixed(2)}%
        </span>
      </div>
      <p className={`text-lg font-bold tabular-nums transition-colors ${up ? "text-success" : "text-danger"}`}>
        {formatUsd(price)}
      </p>
      <div className="-mx-1 mt-2">
        <Sparkline data={asset.priceHistory} positive={positive} id={`hero-${asset.id}`} />
      </div>
    </div>
  );
}

/* ─── Hero dashboard mockup ─────────────────────────────────────────────── */
function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-accent/5 blur-3xl rounded-full" />
      <div className="relative rounded-3xl border border-border bg-surface shadow-gold overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border bg-elevated">
          <span className="size-2.5 rounded-full bg-danger/60" />
          <span className="size-2.5 rounded-full bg-warn/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
          <span className="ml-3 text-xs text-muted">app.elonedge.io/dashboard</span>
        </div>
        <div className="p-5 space-y-3">
          {/* Portfolio overview */}
          <div className="rounded-xl border border-border bg-elevated/60 p-4">
            <p className="text-xs text-muted uppercase tracking-wide">Portfolio Value</p>
            <p className="text-2xl font-bold text-fg mt-1">$84,219.04</p>
            <p className="text-xs text-success mt-0.5">▲ +12.41% this month</p>
            <div className="mt-3 h-16 rounded-lg bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />
          </div>
          {/* Asset rows */}
          <div className="space-y-2">
            {ELON_ASSETS.slice(0, 4).map(a => (
              <div key={a.id} className="flex items-center gap-2 text-xs">
                <div className="h-5 w-5 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: a.color + "22", color: a.color }}>
                  {a.symbol.slice(0, 1)}
                </div>
                <span className="flex-1 text-muted">{a.name}</span>
                <span className="tabular-nums font-medium">{formatUsd(a.basePrice)}</span>
                <span className={`tabular-nums ${a.changePct24h >= 0 ? "text-success" : "text-danger"}`}>
                  {a.changePct24h >= 0 ? "+" : ""}{a.changePct24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature cards ──────────────────────────────────────────────────────── */
const features = [
  { icon: Rocket,    title: "Exclusive Access",    body: "Invest in private ventures normally reserved for Silicon Valley insiders — SpaceX, Neuralink, xAI, and more." },
  { icon: BarChart3, title: "Real-Time Analytics", body: "Live price feeds, portfolio P&L tracking, allocation charts, and performance dashboards at a glance." },
  { icon: Shield,    title: "Bank-Grade Security", body: "End-to-end encrypted accounts, two-factor authentication, and institutional-grade custody." },
  { icon: Zap,       title: "Instant Execution",   body: "Buy and sell positions instantly with no minimum investment and zero platform commission." },
  { icon: TrendingUp,title: "Smart Projections",   body: "AI-powered return projections based on historical Musk-venture performance and market trends." },
  { icon: Lock,      title: "Private Markets",     body: "Access pre-IPO secondary market shares in the world's most anticipated private companies." },
];

/* ─── Stats bar ──────────────────────────────────────────────────────────── */
const DEFAULT_STATS = [
  { key: "stats.activeInvestors", value: "14,832+",   label: "Active investors" },
  { key: "stats.aum",             value: "$2.4B",     label: "Assets under management" },
  { key: "stats.avgReturn",       value: "34.7%",     label: "Avg. annual return" },
  { key: "stats.ventures",        value: "7",         label: "Elon Musk ventures" },
];
const DEFAULT_TAGLINE = "Live markets · 7 assets · $2.4B AUM";

function useSiteConfig() {
  const [config, setConfig] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch("/api/site").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.config) setConfig(d.config);
    }).catch(() => {});
  }, []);
  return config;
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const config = useSiteConfig();
  const stats = DEFAULT_STATS.map(s => ({ ...s, value: config[s.key] ?? s.value }));
  const tagline = config["hero.tagline"] ?? DEFAULT_TAGLINE;
  return (
    <>
      <Navbar />
      <TickerBar />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-aurora min-h-[85vh] flex items-center">
          <div className="absolute inset-0 bg-grid opacity-20" />
          {/* Gold orb backdrop */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
          <div className="container relative py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left — copy */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-gold" />
                  {tagline}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                  Invest in the{" "}
                  <span className="relative">
                    <span className="text-accent">Future.</span>
                  </span>
                  <br />
                  Invest in{" "}
                  <span className="text-accent">Vision.</span>
                </h1>
                <p className="mt-6 text-base md:text-lg text-muted max-w-lg leading-relaxed">
                  ElonEdge gives you premium access to the world&apos;s most transformative
                  ventures — from Tesla and SpaceX to xAI and Neuralink. Built for serious
                  investors who believe in the future.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-accent text-accent-fg font-semibold text-base hover:brightness-110 transition shadow-gold"
                  >
                    Get Started <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="#assets"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border text-fg text-base hover:border-accent hover:text-accent transition"
                  >
                    View Assets
                  </Link>
                </div>
                {/* Micro stats */}
                <div className="mt-10 flex flex-wrap gap-6">
                  {stats.slice(0, 3).map(s => (
                    <div key={s.label}>
                      <p className="text-xl font-bold text-accent">{s.value}</p>
                      <p className="text-xs text-muted mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right — preview */}
              <div className="hidden lg:block">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-border bg-elevated/40">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-accent">{s.value}</p>
                  <p className="text-sm text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Asset showcase ── */}
        <section id="assets" className="container py-20">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
              Live Assets
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The Musk portfolio, unlocked.
            </h2>
            <p className="mt-3 text-muted text-lg">
              Seven of Elon Musk&apos;s most influential companies, available to invest in
              from a single platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ELON_ASSETS.map(a => (
              <LivePriceCard key={a.id} asset={a} />
            ))}
            {/* CTA card */}
            <div className="rounded-2xl border border-accent/30 bg-accent/5 flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Rocket className="size-5" />
              </div>
              <p className="font-semibold text-sm">More coming soon</p>
              <p className="text-xs text-muted">Boring Company, Hyperloop, and future ventures.</p>
              <Link href="/register"
                className="mt-1 h-8 px-4 rounded-lg bg-accent text-accent-fg text-xs font-semibold hover:brightness-110 transition inline-flex items-center">
                Start investing →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="container py-20">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-4">
              Why ElonEdge
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The premium platform for visionary investors.
            </h2>
            <p className="mt-3 text-muted text-lg">
              Everything you need to track, invest, and grow your position in the next
              generation of transformative companies.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-surface p-6 card-hover">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container py-20">
          <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-elevated/60 to-elevated/60 p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/15 blur-3xl rounded-full" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
                Ready to invest in the future?
              </h2>
              <p className="mt-4 text-muted max-w-lg mx-auto text-lg">
                Join 14,832+ investors who have already taken a stake in the world&apos;s most
                transformative ventures. Get started in under 2 minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-accent text-accent-fg font-semibold text-base hover:brightness-110 transition shadow-gold"
                >
                  Create Free Account <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center h-12 px-8 rounded-xl border border-border text-fg text-base hover:border-accent hover:text-accent transition"
                >
                  Sign in
                </Link>
              </div>
              <p className="mt-5 text-xs text-muted">
                SEC-registered · Insured up to $500,000 (SIPC) · 256-bit encryption
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/60">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2 font-bold text-base">
            <span className="text-fg">Elon</span><span className="text-accent">Edge</span>
          </div>
          <p>© 2025 ElonEdge. Investment simulation platform.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-accent transition">Privacy</Link>
            <Link href="/" className="hover:text-accent transition">Terms</Link>
            <Link href="/" className="hover:text-accent transition">Support</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
