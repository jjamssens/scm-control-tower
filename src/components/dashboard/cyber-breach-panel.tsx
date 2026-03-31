// Cyber breach simulation panel — attack type toggles, affected node grid, AnimatePresence reveal
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, ShieldAlert, MonitorX, Network, Zap, Activity } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { generateMockNodes } from "@/lib/supply-chain-nodes"

export type AttackType = "ransomware" | "endpoint" | "network" | "none"

export const ATTACK_CONFIGS = {
  ransomware: {
    label: "Ransomware Attack",
    icon: ShieldAlert,
    riskDelta: 38,
    affectedNodes: ["taiwan-kaohsiung-t2", "usa-port-la-transit", "usa-romulus-mi-t3"],
    description:
      "Full OT/IT encryption across all SCOR nodes. ERP offline. FANUC robot lines halted. Digital ASN processing down. $22k/min clock running.",
    tlpColor: "rose" as const,
  },
  endpoint: {
    label: "Endpoint Compromise",
    icon: MonitorX,
    riskDelta: 18,
    affectedNodes: ["usa-romulus-mi-t3"],
    description:
      "Unpatched OT endpoints — Cylance flagged 3 anomalies at Romulus. BigFix shows 23 endpoints behind patch cycle. FANUC robot comms degraded.",
    tlpColor: "amber" as const,
  },
  network: {
    label: "Network Intrusion",
    icon: Network,
    riskDelta: 12,
    affectedNodes: ["taiwan-kaohsiung-t2", "usa-port-la-transit"],
    description:
      "Lateral movement detected across IT/OT boundary. Port logistics system access attempt. Switch config audit triggered on 700-switch fabric.",
    tlpColor: "blue" as const,
  },
} as const

const COLOR_MAP = {
  rose:  { active: "border-rose-500 bg-rose-500/10 text-rose-400",  icon: "text-rose-400" },
  amber: { active: "border-amber-500 bg-amber-500/10 text-amber-400", icon: "text-amber-400" },
  blue:  { active: "border-blue-500 bg-blue-500/10 text-blue-400",  icon: "text-blue-400" },
}

interface Props {
  activeAttack: AttackType
  onAttackChange: (type: AttackType) => void
}

export function CyberBreachPanel({ activeAttack, onAttackChange }: Props) {
  const nodes = generateMockNodes()
  const config = activeAttack !== "none" ? ATTACK_CONFIGS[activeAttack] : null
  const colors = config ? COLOR_MAP[config.tlpColor] : null

  const handleToggle = (type: Exclude<AttackType, "none">) => {
    onAttackChange(activeAttack === type ? "none" : type)
  }

  return (
    <Card className={`border-border/60 transition-colors duration-500 ${activeAttack !== "none" ? "border-rose-500/25" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`size-4 transition-colors duration-300 ${activeAttack !== "none" ? "text-rose-400" : "text-muted-foreground"}`} />
            <span className="font-semibold">Cyber Breach Simulation</span>
          </div>
          <div className="flex items-center gap-2">
            {activeAttack !== "none" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <Activity className="size-3 text-rose-400 animate-pulse" />
                <span className="text-xs font-mono text-rose-400">BREACH ACTIVE</span>
              </motion.div>
            )}
            <Badge variant={activeAttack !== "none" ? "destructive" : "outline"} className="font-mono text-[10px]">
              {activeAttack !== "none" ? "SIM RUNNING" : "NOMINAL"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Attack type toggles */}
        <div className="flex flex-wrap gap-2">
          {(["ransomware", "endpoint", "network"] as const).map((type) => {
            const cfg = ATTACK_CONFIGS[type]
            const Icon = cfg.icon
            const isActive = activeAttack === type
            const c = COLOR_MAP[cfg.tlpColor]
            return (
              <button
                key={type}
                onClick={() => handleToggle(type)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 cursor-pointer select-none
                  ${isActive ? c.active : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground bg-transparent"}`}
              >
                <Icon className={`size-3.5 ${isActive ? c.icon : ""}`} />
                {cfg.label}
                {isActive && <Zap className="size-3 animate-pulse" />}
              </button>
            )
          })}
        </div>

        {/* Attack detail panel */}
        <AnimatePresence mode="wait">
          {config && colors && (
            <motion.div
              key={activeAttack}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-md border border-rose-500/20 bg-rose-950/10 p-3 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>

                {/* Node status grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {nodes.map((node) => {
                    const affected = (config.affectedNodes as readonly string[]).includes(node.id)
                    return (
                      <motion.div
                        key={node.id}
                        initial={false}
                        animate={affected ? { borderColor: "rgba(239,68,68,0.4)" } : { borderColor: "rgba(255,255,255,0.08)" }}
                        transition={{ duration: 0.3 }}
                        className={`rounded border p-2.5 text-xs transition-colors duration-300
                          ${affected ? "bg-rose-950/25 text-rose-300" : "border-border/40 text-muted-foreground"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span
                            className={`size-1.5 rounded-full flex-shrink-0
                              ${affected ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`}
                          />
                          <span className="font-mono uppercase text-[10px] tracking-wide">{node.scorNode}</span>
                          {affected && <span className="ml-auto font-mono text-[10px] text-rose-400">COMPROMISED</span>}
                        </div>
                        <p className="font-medium">{node.location.city}</p>
                        <p className="text-[10px] opacity-60 mt-0.5">{node.location.country}</p>
                        {affected && (
                          <p className="text-[10px] text-rose-400/80 mt-1 font-mono">
                            +{Math.round(node.vulnerabilityScore * 0.5 * (activeAttack === "ransomware" ? 2.5 : 1))}d delay
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Risk delta callout */}
                <div className="flex items-center justify-between text-xs border-t border-rose-500/15 pt-2">
                  <span className="text-muted-foreground">Risk score impact</span>
                  <span className="font-mono text-rose-400 font-semibold">+{config.riskDelta}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeAttack === "none" && (
          <p className="text-xs text-muted-foreground">
            Select an attack vector to simulate a breach. Ransomware activates the financial exposure counter.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
