// Inventory Turnover line chart — 12-month rolling COGS / Avg Inventory trend
"use client"

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const DATA = [
  { month: "Apr",  turns: 8.2 },
  { month: "May",  turns: 8.8 },
  { month: "Jun",  turns: 9.4 },
  { month: "Jul",  turns: 8.9 },
  { month: "Aug",  turns: 7.6 },  // chip shortage impact
  { month: "Sep",  turns: 7.1 },  // trough
  { month: "Oct",  turns: 8.3 },
  { month: "Nov",  turns: 9.1 },
  { month: "Dec",  turns: 10.2 }, // year-end push
  { month: "Jan",  turns: 9.8 },
  { month: "Feb",  turns: 10.5 },
  { month: "Mar",  turns: 11.2 }, // current — improving
]

const current = DATA[DATA.length - 1].turns
const prev    = DATA[DATA.length - 2].turns
const delta   = ((current - prev) / prev * 100).toFixed(1)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-mono font-bold text-emerald-400">{payload[0].value}× turns</p>
    </div>
  )
}

export function ChartInventoryTurnover() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              <h3 className="font-semibold text-sm">Inventory Turnover</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              12-month rolling · COGS ÷ Avg Inventory · Romulus assembly tier
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-mono font-bold text-emerald-400">{current}×</p>
            <p className="text-[10px] text-muted-foreground">
              {Number(delta) >= 0 ? "▲" : "▼"} {Math.abs(Number(delta))}% MoM
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[6, 13]}
              tickFormatter={(v) => `${v}×`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={8}
              stroke="#f59e0b"
              strokeDasharray="4 2"
              strokeWidth={1}
              label={{ value: "min target  ", fill: "#f59e0b", fontSize: 10, position: "right" }}
            />
            <Line
              type="monotone"
              dataKey="turns"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "rgba(16,185,129,0.3)" }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
          <span>
            <span className="inline-block size-2 rounded-full bg-emerald-500 mr-1.5 align-middle" />
            Turnover rate
          </span>
          <span>
            <span className="inline-block w-4 border-t border-dashed border-amber-500 mr-1.5 align-middle" />
            Min target (8×)
          </span>
          <span className="ml-auto text-[10px]">
            GM Romulus: EOQ target 10–12×
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
