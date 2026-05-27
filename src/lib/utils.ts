import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pct = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });

export function formatUsd(n: number | string | null | undefined) {
  if (n == null) return "$0.00";
  const v = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(v)) return "$0.00";
  return usd.format(v);
}

export function formatPercent(n: number | null | undefined, { signed = true }: { signed?: boolean } = {}) {
  if (n == null || !Number.isFinite(n)) return "0.00%";
  const v = pct.format(n / 100);
  return signed && n > 0 ? `+${v}` : v;
}

export function formatNumber(n: number | string | null | undefined, digits = 4) {
  if (n == null) return "0";
  const v = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(v)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(v);
}

export function formatCrypto(n: number | string | null | undefined) {
  if (n == null) return "0";
  const v = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(v)) return "0";
  return numFmt.format(v);
}

export function shortAddress(addr: string, head = 6, tail = 6) {
  if (!addr) return "";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export function timeAgo(date: Date | string) {
  const t = typeof date === "string" ? new Date(date) : date;
  const diff = (Date.now() - t.getTime()) / 1000;
  const ranges: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let val = Math.abs(diff);
  let unit = "second";
  for (const [step, name] of ranges) {
    if (val < step) {
      unit = name;
      break;
    }
    val = val / step;
    unit = name;
  }
  const rounded = Math.floor(val);
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"} ${diff >= 0 ? "ago" : "from now"}`;
}
