import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-aurora">
        <div className="absolute inset-0 bg-grid opacity-20" />
        {/* Gold orb */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 m-auto max-w-md p-10 space-y-7">
          <Logo />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              The edge belongs to those who invest early.
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              ElonEdge gives you premium access to Tesla, SpaceX, Starlink, xAI, Neuralink,
              X Corp and Boring Company — all in one beautifully crafted dashboard.
            </p>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "Curated access to Musk-linked equities and pre-IPO opportunities",
              "Institutional-grade execution with transparent fees",
              "Real-time market data and portfolio analytics",
              "Fast deposits, instant buy/sell, and projected return modeling",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px]">✓</span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
          {/* Decorative asset pill row */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["TSLA", "SPACEX", "XAI", "STLK", "NRLK"].map(sym => (
              <span key={sym} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {sym}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="relative flex flex-col bg-bg">
        <div className="flex items-center justify-between p-5">
          <Link href="/" className="text-sm text-muted hover:text-accent transition">
            ← Back to site
          </Link>
          <div className="lg:hidden">
            <Logo mark={false} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
