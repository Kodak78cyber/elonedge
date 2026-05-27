"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatPercent, formatUsd } from "@/lib/utils";

const PALETTE = ["#0ea5e9", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899", "#14b8a6", "#ef4444", "#06b6d4", "#94a3b8"];
const MAX_SLICES = 8;

type Slice = { symbol: string; valueUsd: number; weight: number };

function condense(rows: Slice[]): Slice[] {
  if (rows.length <= MAX_SLICES) return rows;
  const sorted = [...rows].sort((a, b) => b.valueUsd - a.valueUsd);
  const head = sorted.slice(0, MAX_SLICES - 1);
  const tail = sorted.slice(MAX_SLICES - 1);
  const valueUsd = tail.reduce((s, r) => s + r.valueUsd, 0);
  const weight = tail.reduce((s, r) => s + r.weight, 0);
  return [...head, { symbol: `+${tail.length} others`, valueUsd, weight }];
}

export function AllocationChart({ data }: { data: Slice[] }) {
  const rows = condense(data);
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            contentStyle={{
              background: "rgb(var(--elevated))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(_v, _n, p) => {
              const d = p.payload as Slice;
              return [`${formatUsd(d.valueUsd)} (${formatPercent(d.weight, { signed: false })})`, d.symbol];
            }}
          />
          <Pie
            data={rows}
            dataKey="valueUsd"
            nameKey="symbol"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke="rgb(var(--surface))"
            strokeWidth={3}
          >
            {rows.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span style={{ color: "rgb(var(--muted))", fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
