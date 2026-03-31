// Financial exposure counter — mounts losses at $22k/min when ransomware simulation is active
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Clock, TrendingUp, ShieldOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AttackType } from "./cyber-breach-panel"

const DOWNTIME_COST_PER_MINUTE = 22_000   // GM automotive, per scm-engine.ts constant
const TICK_MS = 80                         // update interval
const COST_PER_TICK = (DOWNTIME_COST_PER_MINUTE / 60 / 1000) * TICK_MS

interface Props {
  isActive: boolean
  attackType: AttackType
}

function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}k`
  return `$${Math.round(n).toLocaleString()}`
}

export function FinancialExposureCard({ isActive, attackType }: Props) {
  const [exposure, setExposure]         = useState(0)
  const [elapsedSec, setElapsedSec]     = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef    = useRef<number | null>(null)

  useEffect(() => {
    if (isActive) {
      startRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startRef.current!) / 1000
        setElapsedSec(Math.floor(elapsed))
        setExposure(elapsed / 60 * DOWNTIME_COST_PER_MINUTE)
      }, TICK_MS)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setExposure(0)
      setElapsedSec(0)
      startRef.current = null
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isActive])

  const minutes = Math.floor(elapsedSec / 60)
  const seconds = elapsedSec % 60
  const shiftsLost = exposure / (22_000 * 60 * 8)  // 8-hr shift cost

  return (
    <Card className={`border-border/60 h-full transition-all duration-500 ${
      isActive ? "border-rose-500/50 shadow-rose-900/20 shadow-lg" : ""
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className={`size-4 transition-colors duration-300 ${isActive ? "text-rose-400" : "text-muted-foreground"}`} />
            <span className="text-sm font-medium">Financial Exposure</span>
          </div>
          <Badge
            variant={isActive ? "destructive" : "outline"}
            className="font-mono text-[10px]"
          >
            {isActive ? "● LIVE" : "STANDBY"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Main counter */}
              <div>
                <motion.p
                  className="text-4xl font-mono font-bold text-rose-400 tabular-nums leading-none"
                  key={Math.floor(exposure / 500)}   // re-animate every $500
                  animate={{ opacity: [0.7, 1] }}
                  transition={{ duration: 0.08 }}
                >
                  {formatUSD(exposure)}
                </motion.p>
                <p className="text-xs text-rose-400/60 mt-1 font-mono">
                  ${DOWNTIME_COST_PER_MINUTE.toLocaleString()}/min · GM automotive
                </p>
              </div>

              {/* Elapsed time */}
              <div className="flex items-center gap-2 text-xs">
                <Clock className="size-3 text-rose-400/70" />
                <span className="font-mono text-rose-300/70">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")} elapsed
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 border-t border-rose-500/20 pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Attack vector</span>
                  <span className="font-mono text-rose-400 uppercase">{attackType}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-mono text-rose-300/80">$366.67/sec</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Shifts lost equiv.</span>
                  <span className="font-mono text-rose-300/80">{shiftsLost.toFixed(3)}</span>
                </div>
              </div>

              {/* Severity bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Exposure severity</span>
                  <span className="font-mono">{Math.min(100, Math.round(exposure / 1000)).toFixed(0)}k threshold</span>
                </div>
                <div className="h-1.5 rounded-full bg-rose-950/40 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${Math.min(100, (exposure / 500_000) * 100)}%` }}
                    transition={{ duration: 0.08 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldOff className="size-8 opacity-20" />
              </div>
              <p className="text-3xl font-mono font-bold text-muted-foreground/40">$0</p>
              <p className="text-xs text-muted-foreground">
                Activate <span className="text-rose-400/70 font-mono">Ransomware Attack</span> to start the counter.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 pt-1">
                <TrendingUp className="size-3" />
                <span>$22,000/min baseline (GM automotive)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
