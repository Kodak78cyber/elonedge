import { Card } from "@/components/ui/card";
import { formatPercent, formatUsd } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  change,
  hint,
  icon,
  format = "usd",
}: {
  label: string;
  value: number;
  change?: number;
  hint?: string;
  icon?: ReactNode;
  format?: "usd" | "number" | "percent";
}) {
  const display =
    format === "usd"
      ? formatUsd(value)
      : format === "percent"
        ? formatPercent(value)
        : new Intl.NumberFormat("en-US").format(value);

  const positive = (change ?? 0) >= 0;
  return (
    <Card className="card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        {icon && <div className="text-muted">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{display}</p>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {change != null && (
          <span className={positive ? "text-success inline-flex items-center" : "text-danger inline-flex items-center"}>
            {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {formatPercent(change)}
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </Card>
  );
}
