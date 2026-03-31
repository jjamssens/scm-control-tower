// Lead Time Trends chart — base vs effective days for Kaohsiung → Romulus chain (12 months)
"use client"

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock } from "lucide-react"

const DATA = [
  { month: "Apr", base: 21, effective: 22 },
  { month: "May", base: 21, effective: 24 },
  { month: "Jun", base: 21, effective: 27 },   // port congestion spike
  { month: "Jul", base: 21, effective: 31 },   // geopolitical + congestion compound
  { month: "Aug", base: 21, effective: 35 },   // peak disruption
  { month: "Sep", base: 21, effective: 29 },
  { month: "Oct", base: 21, effective: 26 },
  { month: "Nov", base: 21, effective: 23 },
  { month: "Dec", base: 21, effective: 25 },   // holiday logistics surge
  { month: "Jan", base: 21, effective: 22 },
  { month: "Feb", base: 21, effective: 23 },
  { month: "Mar", base: 21, effective: 28 },   // current — Strait tension re-emerging
]

const current   = DATA[DATA.length - 1].effective
const base      = DATA[DATA.length - 1].base
const overage   = current - base

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const eff  = payload.find((p: { dataKey: string }) => p.dataKey === "effective")
  const base = payload.find((p: { dataKey: string }) => p.dataKey === "base")
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="text-muted-foreground">{label}</p>
      {eff  && <p className="font-mono text-amber-400">{eff.value}d effective</p>}
      {base && <p className="font-mono text-blue-400/70">{base.value}d base</p>}
      {eff && base && (
        <p className="font-mono text-rose-400/80">+{eff.value - base.value}d disruption</p>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
      {payload?.map((entry: { color: string; value: string }) => (
        <span key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-px w-5 align-middle"
            style={{ background: entry.color, borderTop: entry.value === "base" ? "1.5px dashed" : "2px solid", borderColor: entry.color }}
          />
          {entry.value === "base" ? "Base LT" : "Effective LT"}
        </span>
      ))}
    </div>
  )
}

export function ChartLeadTime() {
  return (
    <Card className="border-border/60 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-400" />
              <h3 className="font-semibold text-sm">Lead Time Trends</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kaohsiung → Port of LA → Romulus · days
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-mono font-bold text-amber-400">{current}d</p>
            <p className="text-[10px] text-muted-foreground">
              +{overage}d vs. base {base}d
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
              domain={[18, 38]}
              tickFormatter={(v) => `${v}d`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <ReferenceLine
              y={30}
              stroke="#f43f5e"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{ value: "SLA limit  ", fill: "#f43f5e", fontSize: 10, position: "right" }}
            />
            <Line
              type="monotone"
              dataKey="base"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              name="base"
            />
            <Line
              type="monotone"
              dataKey="effective"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 2, stroke: "rgba(245,158,11,0.3)" }}
              name="effective"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
