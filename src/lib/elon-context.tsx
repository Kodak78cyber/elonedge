"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authHeaders, type ElonUser, type Holding, type Transaction, type StoreCtxType } from "./elon-store";

const Ctx = createContext<StoreCtxType | null>(null);

export function ElonStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [snap, setSnap] = useState<{
    user: ElonUser | null;
    balance: number;
    holdings: Holding[];
    transactions: Transaction[];
  }>({ user: null, balance: 0, holdings: [], transactions: [] });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio/data", {
        credentials: "include",
        headers: authHeaders(),
      });
      if (!res.ok) {
        setSnap({ user: null, balance: 0, holdings: [], transactions: [] });
        return;
      }
      const data = await res.json();
      setSnap({
        user: data.user,
        balance: data.balance,
        holdings: data.holdings,
        transactions: data.transactions,
      });
    } catch {
      setSnap({ user: null, balance: 0, holdings: [], transactions: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const deposit = useCallback(async (amount: number) => {
    await fetch("/api/portfolio/deposit", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ amount }),
      credentials: "include",
    });
    await refresh();
  }, [refresh]);

  const withdraw = useCallback(async (amount: number): Promise<boolean> => {
    const res = await fetch("/api/portfolio/withdraw", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ amount }),
      credentials: "include",
    });
    if (!res.ok) return false;
    await refresh();
    return true;
  }, [refresh]);

  const buy = useCallback(async (
    assetId: string, assetName: string, assetSymbol: string,
    usdAmount: number, pricePerShare: number,
  ): Promise<boolean> => {
    const res = await fetch("/api/portfolio/buy", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ assetId, assetName, assetSymbol, usdAmount, pricePerShare }),
      credentials: "include",
    });
    if (!res.ok) return false;
    await refresh();
    return true;
  }, [refresh]);

  const sell = useCallback(async (
    assetId: string, assetName: string, assetSymbol: string,
    shares: number, pricePerShare: number,
  ): Promise<boolean> => {
    const res = await fetch("/api/portfolio/sell", {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ assetId, assetName, assetSymbol, shares, pricePerShare }),
      credentials: "include",
    });
    if (!res.ok) return false;
    await refresh();
    return true;
  }, [refresh]);

  return (
    <Ctx.Provider value={{ ...snap, loading, refresh, deposit, withdraw, buy, sell }}>
      {children}
    </Ctx.Provider>
  );
}

export function useElonStore(): StoreCtxType {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useElonStore must be inside ElonStoreProvider");
  return ctx;
}
