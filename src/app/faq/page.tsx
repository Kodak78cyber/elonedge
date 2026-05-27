import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

const qa = [
  {
    q: "Which cryptocurrencies can I track?",
    a: "VaultFlow supports the major networks out of the box — Bitcoin, Ethereum, Solana, USDC, Polygon and Cardano. More assets are added every month based on community demand.",
  },
  {
    q: "How are prices kept up to date?",
    a: "We pull live market data continuously and cache it for instant dashboard reads. Prices, 24-hour changes and market caps refresh automatically — no manual reloads required.",
  },
  {
    q: "What security do you use to protect my account?",
    a: "Every account is protected with bcrypt-hashed passwords, JWT sessions and optional time-based 2FA using an authenticator app of your choice (1Password, Authy, Google Authenticator). Every privileged action is recorded in an immutable audit log.",
  },
  {
    q: "How do I deposit crypto?",
    a: "Each account is provisioned with unique receive addresses for every supported asset. Deposits arrive automatically once confirmed on-chain — typically 1–10 minutes for Bitcoin and under a minute for Solana.",
  },
  {
    q: "Do you offer team or enterprise accounts?",
    a: "Yes. The Team plan supports up to 10 admin seats with role-based permissions and CSV exports. For larger requirements, our enterprise plan adds SSO, dedicated infrastructure and a 99.99% uptime SLA.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month with no commitment, and you can downgrade or cancel from the billing page in your account settings.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container py-16">
          <Badge tone="accent" className="mb-4">FAQ</Badge>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Frequently asked questions</h1>
          <p className="mt-3 text-muted max-w-2xl">Everything you need to know before getting started with VaultFlow. Still have questions? <a className="text-accent" href="/contact">Contact us</a>.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {qa.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-surface p-5 open:shadow-soft"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <span className="font-medium">{item.q}</span>
                  <span className="mt-1 text-muted group-open:rotate-180 transition">▾</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
