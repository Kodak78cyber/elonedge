"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, CheckCircle, X, Building2, Search } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useElonStore } from "@/lib/elon-context";
import { ELON_ASSETS } from "@/lib/elon-assets";
import { US_BANKS, type USBank } from "@/lib/us-banks";
import { formatUsd, timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

/* ─── Deposit modal ─────────────────────────────────────────────────────── */
function DepositModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (n: number) => Promise<void> }) {
  const [amount, setAmount] = useState("");
  const [step, setStep]     = useState<"form" | "confirm">("form");
  const val = parseFloat(amount) || 0;

  function proceed() {
    if (val <= 0) return;
    setStep("confirm");
  }
  async function confirm() {
    await onConfirm(val);
    onClose();
    toast.success(`Deposited ${formatUsd(val)} successfully!`);
  }

  return (
    <ModalShell onClose={onClose} title="Deposit Funds">
      {step === "form" ? (
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted">Add funds to your ElonEdge wallet. Choose an amount to deposit.</p>
          <div>
            <Label htmlFor="dep-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <Input id="dep-amount" type="number" min="1" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="pl-7" />
            </div>
            <div className="flex gap-2 mt-2">
              {[500, 1000, 5000, 10000].map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className="flex-1 h-7 rounded-lg border border-border text-xs text-muted hover:border-accent hover:text-accent transition">
                  ${v >= 1000 ? `${v/1000}k` : v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={proceed} disabled={val <= 0}
              className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-border bg-elevated/40 p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted">Deposit amount</span><span className="font-semibold">{formatUsd(val)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Method</span><span>ACH bank transfer</span></div>
            <div className="flex justify-between"><span className="text-muted">Arrives</span><span className="text-success">Instantly</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("form")} className="flex-1">Back</Button>
            <Button onClick={confirm}
              className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
              <CheckCircle className="size-4" /> Confirm Deposit
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

/* ─── Withdraw modal ────────────────────────────────────────────────────── */
function WithdrawModal({ balance, onClose, onConfirm }: { balance: number; onClose: () => void; onConfirm: (n: number) => Promise<boolean> }) {
  const [step, setStep] = useState<"amount" | "bank" | "confirm">("amount");
  const [amount, setAmount] = useState("");
  const [bankId, setBankId] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const val = parseFloat(amount) || 0;
  const insufficient = val > balance;
  const bank: USBank | undefined = US_BANKS.find(b => b.id === bankId);
  const filteredBanks = US_BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    b.short.toLowerCase().includes(bankSearch.toLowerCase())
  );
  const acctValid = accountNumber.replace(/\D/g, "").length >= 4;

  async function confirm() {
    if (val <= 0 || insufficient || !bank) return;
    setBusy(true);
    const ok = await onConfirm(val);
    setBusy(false);
    if (ok) {
      onClose();
      toast.success(`${formatUsd(val)} sent to ${bank.name} ending in ${accountNumber.slice(-4)}`);
    } else {
      toast.error("Withdrawal failed. Please try again.");
    }
  }

  return (
    <ModalShell onClose={onClose} title="Withdraw Funds">
      {/* Step indicator */}
      <div className="flex items-center gap-1.5 px-5 pt-4">
        {["amount", "bank", "confirm"].map((s, i) => (
          <div key={s} className={`flex-1 h-1 rounded-full transition ${
            step === s || ["amount", "bank", "confirm"].indexOf(step) > i ? "bg-accent" : "bg-border"
          }`} />
        ))}
      </div>

      {step === "amount" && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-muted">
            Available balance: <span className="text-accent font-medium">{formatUsd(balance)}</span>
          </p>
          <div>
            <Label htmlFor="wit-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <Input id="wit-amount" type="number" min="1" max={balance} placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="pl-7" />
            </div>
            <div className="flex gap-2 mt-2">
              {[100, 500, 1000, 5000].map(v => (
                <button key={v} onClick={() => setAmount(String(Math.min(v, balance)))}
                  className="flex-1 h-7 rounded-lg border border-border text-xs text-muted hover:border-accent hover:text-accent transition">
                  ${v >= 1000 ? `${v / 1000}k` : v}
                </button>
              ))}
              <button onClick={() => setAmount(String(balance))}
                className="flex-1 h-7 rounded-lg border border-accent/40 text-xs text-accent hover:bg-accent/10 transition">
                Max
              </button>
            </div>
            {insufficient && <p className="mt-2 text-xs text-danger">Exceeds available balance.</p>}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={() => setStep("bank")} disabled={val <= 0 || insufficient}
              className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "bank" && (
        <div className="p-5 space-y-4">
          <div>
            <Label>Choose your bank</Label>
            <p className="text-xs text-muted mb-2">Select a U.S. bank to receive your funds.</p>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
              <Input
                placeholder="Search banks…"
                value={bankSearch}
                onChange={e => setBankSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 -mr-1">
              {filteredBanks.map(b => (
                <button
                  key={b.id}
                  onClick={() => setBankId(b.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                    bankId === b.id
                      ? "border-accent bg-accent/10 shadow-gold"
                      : "border-border hover:border-accent/60 hover:bg-elevated/40"
                  }`}
                >
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: b.color + "22", color: b.color }}>
                    {b.abbr}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{b.name}</p>
                    <p className="text-[10px] text-muted truncate">{b.short}</p>
                  </div>
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <div className="col-span-2 py-6 text-center text-xs text-muted">No banks match your search.</div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="acct">Account number</Label>
            <Input
              id="acct"
              type="text"
              inputMode="numeric"
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
              maxLength={20}
            />
            <p className="mt-1 text-xs text-muted">Your account number is encrypted in transit and at rest.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("amount")} className="flex-1">Back</Button>
            <Button onClick={() => setStep("confirm")} disabled={!bankId || !acctValid}
              className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
              Review
            </Button>
          </div>
        </div>
      )}

      {step === "confirm" && bank && (
        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-border bg-elevated/40 p-4 space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: bank.color + "22", color: bank.color }}>
                {bank.abbr}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{bank.name}</p>
                <p className="text-xs text-muted">{bank.short}</p>
              </div>
              <Building2 className="size-4 text-muted" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Amount</span>
              <span className="font-semibold tabular-nums text-base">{formatUsd(val)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Account</span>
              <span className="font-mono tabular-nums">•••• {accountNumber.replace(/\s/g, "").slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Routing #</span>
              <span className="font-mono tabular-nums text-xs">{bank.routingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Fees</span>
              <span className="text-success">$0.00</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted">Arrives</span>
              <span className="text-success font-medium">1–2 business days</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("bank")} disabled={busy} className="flex-1">Back</Button>
            <Button onClick={confirm} disabled={busy}
              className="flex-1 bg-accent text-accent-fg hover:brightness-110 font-semibold">
              {busy ? "Processing…" : <><CheckCircle className="size-4" /> Confirm</>}
            </Button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface shadow-gold animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-elevated transition">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function WalletsPage() {
  const { balance, holdings, transactions, deposit, withdraw } = useElonStore();
  const [showDeposit, setShowDeposit]   = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = ELON_ASSETS.find(a => a.id === h.assetId);
    return sum + (asset ? h.shares * asset.basePrice : 0);
  }, 0);
  const totalWealth = balance + portfolioValue;

  const walletTx = transactions.filter(t => t.type === "DEPOSIT" || t.type === "WITHDRAW").slice(0, 20);

  return (
    <>
      {showDeposit  && <DepositModal  onClose={() => setShowDeposit(false)}  onConfirm={deposit} />}
      {showWithdraw && <WithdrawModal balance={balance} onClose={() => setShowWithdraw(false)} onConfirm={withdraw} />}

      <div className="space-y-6">
        <header>
          <Badge tone="accent" className="mb-2">Wallet</Badge>
          <h1 className="text-2xl font-bold tracking-tight">Your Wallet</h1>
          <p className="text-sm text-muted">Manage your funds and transaction history.</p>
        </header>

        {/* Wallet overview */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/15 via-accent/5 to-surface p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-accent/10 blur-2xl" />
            <p className="text-xs text-accent uppercase tracking-wide font-semibold mb-3">Available Balance</p>
            <p className="text-3xl font-bold tabular-nums">{formatUsd(balance)}</p>
            <p className="text-xs text-muted mt-1">Ready to invest</p>
            <div className="flex gap-2 mt-5">
              <Button onClick={() => setShowDeposit(true)} size="sm"
                className="flex-1 bg-accent text-accent-fg hover:brightness-110 text-xs font-semibold">
                <ArrowDownToLine className="size-3.5" /> Deposit
              </Button>
              <Button onClick={() => setShowWithdraw(true)} variant="secondary" size="sm" className="flex-1 text-xs">
                <ArrowUpFromLine className="size-3.5" /> Withdraw
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">Portfolio Value</p>
            <p className="text-3xl font-bold tabular-nums">{formatUsd(portfolioValue)}</p>
            <p className="text-xs text-muted mt-1">{holdings.length} open position{holdings.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">Total Net Worth</p>
            <p className="text-3xl font-bold tabular-nums text-accent">{formatUsd(totalWealth)}</p>
            <p className="text-xs text-muted mt-1">Balance + portfolio</p>
          </div>
        </div>

        {/* Holdings */}
        {holdings.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Holdings</CardTitle></CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                {holdings.map(h => {
                  const asset = ELON_ASSETS.find(a => a.id === h.assetId);
                  if (!asset) return null;
                  const value = h.shares * asset.basePrice;
                  const gain  = value - h.totalInvested;
                  const gainPct = h.totalInvested > 0 ? (gain / h.totalInvested) * 100 : 0;
                  return (
                    <div key={h.assetId} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-elevated/40 transition">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: asset.color + "22", color: asset.color }}>
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{asset.name}</p>
                        <p className="text-xs text-muted">{h.shares.toFixed(4)} shares @ avg {formatUsd(h.avgBuyPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">{formatUsd(value)}</p>
                        <p className={`text-xs tabular-nums ${gain >= 0 ? "text-success" : "text-danger"}`}>
                          {gain >= 0 ? "+" : ""}{formatUsd(gain)} ({gainPct >= 0 ? "+" : ""}{gainPct.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Wallet transaction history */}
        <Card>
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <ul className="divide-y divide-border">
            {walletTx.map(t => (
              <li key={t.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    t.type === "DEPOSIT" ? "bg-accent/10 text-accent" : "bg-warn/10 text-warn"
                  }`}>
                    {t.type === "DEPOSIT" ? <ArrowDownToLine className="size-4" /> : <ArrowUpFromLine className="size-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.type === "DEPOSIT" ? "Deposit" : "Withdrawal"}</p>
                    <p className="text-xs text-muted">{timeAgo(new Date(t.date))}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold tabular-nums ${t.type === "DEPOSIT" ? "text-success" : "text-warn"}`}>
                  {t.type === "DEPOSIT" ? "+" : "-"}{formatUsd(t.amount)}
                </p>
              </li>
            ))}
            {walletTx.length === 0 && (
              <li className="px-6 py-8 text-center text-muted text-sm">No wallet transactions yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </>
  );
}
