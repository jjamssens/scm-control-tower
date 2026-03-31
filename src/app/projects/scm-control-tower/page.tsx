// SCM Control Tower dashboard — live risk score, cyber breach simulation, charts, module cards
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, CalendarDays, AlertTriangle, ShieldCheck, Zap, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BentoGrid, BentoItem } from "@/components/bento-grid"
import { ModuleCard } from "@/components/module-card"
import { scmModules } from "@/lib/scm-modules"
import { generateMockNodes, calcChainLeadTime } from "@/lib/supply-chain-nodes"
import { GlitchWrapper } from "@/components/dashboard/glitch-wrapper"
import { CyberBreachPanel, ATTACK_CONFIGS, type AttackType } from "@/components/dashboard/cyber-breach-panel"
import { FinancialExposureCard } from "@/components/dashboard/financial-exposure-card"
import { ChartInventoryTurnover } from "@/components/dashboard/chart-inventory-turnover"
import { ChartLeadTime } from "@/components/dashboard/chart-lead-time"
import { useFeynman } from "@/lib/feynman-context"

// ─── Risk helpers ──────────────────────────────────────────────────────────────

function calcBaseRisk(nodes: ReturnType<typeof generateMockNodes>): number {
  const avgVuln = nodes.reduce((s, n) => s + n.vulnerabilityScore, 0) / nodes.length
  const activeDisruptions = nodes.reduce(
    (s, n) => s + n.disruptions.filter((d) => d.active).length, 0
  )
  return Math.min(100, Math.round(avgVuln * 8 + activeDisruptions * 4))
}

function daysToUmpi(): number {
  return Math.max(0, Math.ceil((new Date("2026-07-06").getTime() - Date.now()) / 86_400_000))
}

// ─── Recall-able stat card ─────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent, termId }: {
  icon: React.ElementType
  label: string
  value: string
  accent?: "rose" | "amber" | "emerald"
  termId?: string
}) {
  const { openFeynman } = useFeynman()
  const accentClass = accent === "rose" ? "text-rose-400" : accent === "amber" ? "text-amber-400" : accent === "emerald" ? "text-emerald-400" : "text-foreground"

  return (
    <div className={`group relative flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 ${termId ? "cursor-pointer hover:border-primary/40 transition-colors" : ""}`}
      onClick={termId ? () => openFeynman(termId) : undefined}
      role={termId ? "button" : undefined}
      tabIndex={termId ? 0 : undefined}
      onKeyDown={termId ? (e) => e.key === "Enter" && openFeynman(termId) : undefined}
    >
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-mono font-semibold truncate ${accentClass}`}>{value}</p>
      </div>
      {termId && (
        <Brain className="size-3.5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" />
      )}
    </div>
  )
}

// ─── Chart recall wrapper ──────────────────────────────────────────────────────

function ChartWrapper({ termId, children }: { termId: string; children: React.ReactNode }) {
  const { openFeynman } = useFeynman()
  return (
    <div className="relative group">
      <button
        onClick={() => openFeynman(termId)}
        title="Open Feynman recall"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md border border-border/40 bg-card text-muted-foreground
          hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150
          opacity-0 group-hover:opacity-100"
      >
        <Brain className="size-3.5" />
      </button>
      {children}
    </div>
  )
}

// ─── Risk badge ────────────────────────────────────────────────────────────────

function RiskBadge({ score }: { score: number }) {
  if (score >= 80) return <Badge variant="destructive" className="font-mono text-[10px] animate-pulse">CRITICAL</Badge>
  if (score >= 60) return <Badge variant="outline" className="font-mono text-[10px] border-amber-500/50 text-amber-400">ELEVATED</Badge>
  return <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/50 text-emerald-400">NOMINAL</Badge>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ControlTowerDashboard() {
  const { openFeynman } = useFeynman()

  const nodes             = generateMockNodes()
  const { totalDays }     = calcChainLeadTime(nodes)
  const baseRisk          = calcBaseRisk(nodes)
  const days              = daysToUmpi()
  const activeDisruptions = nodes.reduce((s, n) => s + n.disruptions.filter(d => d.active).length, 0)

  const [activeAttack, setActiveAttack] = useState<AttackType>("none")
  const [isGlitching, setIsGlitching]   = useState(false)
  const glitchFiredRef = useRef(false)

  const riskDelta = activeAttack !== "none" ? ATTACK_CONFIGS[activeAttack].riskDelta : 0
  const riskScore = Math.min(100, baseRisk + riskDelta)

  const riskColor =
    riskScore >= 80 ? "text-rose-400" :
    riskScore >= 60 ? "text-amber-400" :
    "text-emerald-400"

  useEffect(() => {
    if (riskScore > 80 && !glitchFiredRef.current) {
      glitchFiredRef.current = true
      setIsGlitching(true)
    }
    if (riskScore <= 80) glitchFiredRef.current = false
  }, [riskScore])

  return (
    <GlitchWrapper isGlitching={isGlitching} onGlitchComplete={() => setIsGlitching(false)}>
      <div className="flex flex-col gap-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Control Tower</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Kaohsiung → Port of LA → Romulus · {totalDays}d chain · Phase 0
            </p>
          </div>

          {/* Risk score — click to open recall */}
          <div
            className="text-right shrink-0 cursor-pointer group"
            onClick={() => openFeynman("supply-chain-risk")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openFeynman("supply-chain-risk")}
            title="Open Feynman recall: Supply Chain Risk"
          >
            <div className="flex items-center gap-2 justify-end">
              <AnimatePresence mode="wait">
                <motion.span
                  key={riskScore}
                  className={`text-4xl font-mono font-bold tabular-nums ${riskColor}`}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {riskScore}%
                </motion.span>
              </AnimatePresence>
              <RiskBadge score={riskScore} />
            </div>
            <p className="text-xs text-muted-foreground text-right mt-0.5 flex items-center justify-end gap-1">
              system risk score
              <Brain className="size-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            </p>
            <div className="mt-2 h-1 w-36 rounded-full bg-border/40 overflow-hidden ml-auto">
              <motion.div
                className={`h-full rounded-full transition-colors duration-500 ${
                  riskScore >= 80 ? "bg-rose-500" : riskScore >= 60 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                animate={{ width: `${riskScore}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* ── Critical alert banner ── */}
        <AnimatePresence>
          {riskScore >= 80 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 rounded-md border border-rose-500/40 bg-rose-950/20 px-3 py-2"
            >
              <AlertTriangle className="size-3.5 text-rose-400 shrink-0 animate-pulse" />
              <p className="text-xs text-rose-300">
                <span className="font-mono font-bold">CRITICAL THRESHOLD EXCEEDED</span>
                {" "}· Risk score {riskScore}% — compounding disruption across {ATTACK_CONFIGS[activeAttack as Exclude<AttackType,"none">]?.affectedNodes?.length ?? 0} nodes.
              </p>
              <Zap className="size-3 text-rose-400/60 ml-auto shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stat cards — all clickable with Feynman recall ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Layers}        label="Chain Lead Time"    value={`${totalDays}d`}         accent="amber"  termId="chain-lead-time" />
          <StatCard icon={AlertTriangle} label="Active Disruptions" value={`${activeDisruptions}`} accent={activeDisruptions > 2 ? "rose" : "amber"} termId="supply-chain-risk" />
          <StatCard icon={ShieldCheck}   label="Modules"             value={`${scmModules.length}`}                  termId="scor-model" />
          <StatCard icon={CalendarDays}  label="Days to UMPI"        value={days.toString()} />
        </div>

        {/* ── Cyber Breach Simulation ── */}
        <CyberBreachPanel activeAttack={activeAttack} onAttackChange={setActiveAttack} />

        {/* ── Financial Exposure + Lead Time ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ChartWrapper termId="financial-exposure">
              <FinancialExposureCard isActive={activeAttack === "ransomware"} attackType={activeAttack} />
            </ChartWrapper>
          </div>
          <div className="lg:col-span-2">
            <ChartWrapper termId="lead-time">
              <ChartLeadTime />
            </ChartWrapper>
          </div>
        </div>

        {/* ── Inventory Turnover ── */}
        <ChartWrapper termId="inventory-turnover">
          <ChartInventoryTurnover />
        </ChartWrapper>

        {/* ── Module Cards ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold">Learning Modules</h2>
            <Badge variant="outline" className="font-mono text-[10px]">Phase 0</Badge>
            <span className="text-xs text-muted-foreground ml-1">
              — hover any card for
              <Brain className="size-3 inline mx-1 text-primary/60" />
              Feynman recall
            </span>
          </div>
          <BentoGrid>
            {scmModules.map((module) => (
              <BentoItem key={module.id} span={module.span}>
                <ModuleCard module={module} />
              </BentoItem>
            ))}
          </BentoGrid>
        </div>

      </div>
    </GlitchWrapper>
  )
}
