"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Jan", users: 125, matches: 45, messages: 780 },
  { month: "Feb", users: 178, matches: 68, messages: 890 },
  { month: "Mar", users: 235, matches: 87, messages: 1020 },
  { month: "Apr", users: 290, matches: 102, messages: 1180 },
  { month: "May", users: 345, matches: 128, messages: 1340 },
  { month: "Jun", users: 412, matches: 156, messages: 1520 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="matches"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="messages"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}