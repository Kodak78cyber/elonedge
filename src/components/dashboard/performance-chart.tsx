"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatUsd } from "@/lib/utils";

type Point = { ts: number; value: number };

export function PerformanceChart({ data }: { data: Point[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.42} />
              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="ts"
            tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            stroke="rgb(var(--muted))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
          />
          <YAxis
            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
            stroke="rgb(var(--muted))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "rgb(var(--elevated))",
              border: "1px solid rgb(var(--border))",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "rgb(var(--muted))" }}
            labelFormatter={(v) => new Date(v as number).toLocaleString()}
            formatter={(v: number) => [formatUsd(v), "Portfolio"]}
          />
          <Area type="monotone" dataKey="value" stroke="rgb(var(--accent))" strokeWidth={2} fill="url(#vg)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
