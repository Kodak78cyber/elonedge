"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface Props {
  data: number[];
  positive: boolean;
  id: string;
}

export function Sparkline({ data, positive, id }: Props) {
  const chartData = data.map((v, i) => ({ v, i }));
  const color = positive ? "#22c55e" : "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={52}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.28} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#sg-${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
