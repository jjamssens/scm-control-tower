// Architecture & Purpose modal — documents IT/Security × SCM convergence and resume integration
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Info, Shield, Network, Database, Layers, ChevronRight,
  Copy, Check, Cpu, GitBranch, Zap, BookOpen, ExternalLink,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ─── Section components ────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, title, accent }: {
  icon: React.ElementType; title: string; accent: string
}) {
  return (
    <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
      <div className={`p-1.5 rounded-md ${accent}`}>
        <Icon className="size-4" />
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
    </div>
  )
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono border ${color}`}>
      {label}
    </span>
  )
}

// ─── Resume bullet copy ────────────────────────────────────────────────────────

const RESUME_BULLETS = [
  {
    category: "Engineering",
    color: "text-blue-400",
    bullets: [
      "Engineered dual-scale supply chain visualization mapping global automotive routing (Kaohsiung → Port of LA → Romulus) and domestic eBay/USPS micro-logistics using react-simple-maps with custom Pacific-centered geoMercator projection",
      "Architected compounding disruption engine modeling simultaneous port congestion and cyber attack interactions (×1.35 delay multiplier), documenting non-additive risk cascading across SCOR Plan/Source/Make/Deliver/Return nodes",
      "Developed client/server data boundary separation enforcing Next.js App Router constraints — pure SCM computation in client-safe modules, CSV parsing and Node.js fs in server-only data fetchers",
      "Implemented Feynman Active Recall system with 17 ASCM concept entries, structured GM/eBay real-world analogs, and AI-powered UMPI exam readiness grading via Claude API",
    ],
  },
  {
    category: "IT / OT Security",
    color: "text-rose-400",
    bullets: [
      "Mapped OT attack vectors (ransomware, endpoint compromise, network intrusion) to SCOR process disruption patterns — translated IT/OT boundary breach events into quantified supply chain lead time latency models",
      "Integrated CVSS-style vulnerability scoring (0–10 scale) with TTS/TTR (Time-to-Survive/Time-to-Recover) calculations per SCOR node, producing a composite supply chain risk score with real-time threshold alerting",
      "Designed cyber breach simulation panel correlating attack type to affected SCOR nodes — demonstrating how ransomware simultaneously disrupts ERP (Plan), supplier EDI (Source), robot control (Make), and shipping manifests (Deliver)",
    ],
  },
  {
    category: "Financial Modeling",
    color: "text-amber-400",
    bullets: [
      "Quantified financial exposure models projecting GM automotive downtime at $22,000/minute — real-time counter accumulates mounting losses during simulated ransomware scenarios with MM:SS elapsed tracking and severity visualization",
      "Constructed cyber risk justification framework converting disruption probability × impact × duration to expected annual loss, enabling security investment ROI framing in supply chain business language",
    ],
  },
  {
    category: "Data & Analytics",
    color: "text-emerald-400",
    bullets: [
      "Designed flexible CSV ingestion pipeline parsing Kaggle global supply chain risk datasets with multi-alias column resolution, automatic disruption inference from port congestion indices and vulnerability scores, and mock-data fallback",
      "Produced Recharts-driven inventory turnover and lead time trend visualizations tracking 12-month rolling performance — metric overlays update live as cyber breach simulation state changes",
    ],
  },
  {
    category: "Academic Portfolio",
    color: "text-purple-400",
    bullets: [
      "Built pre-academic SCM portfolio (Phase 0, 97 days pre-UMPI) grounded in 5+ years of GM OT/ICS operations across 400+ endpoint environment, 700+ network switches, and FANUC robotics — applied as documented analogs for every ASCM concept",
      "Deployed full-stack Next.js 16 Control Tower to Vercel with server-rendered AI evaluation API, static pre-rendering for all module pages, and TypeScript strict mode throughout",
    ],
  },
]

function BulletSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyAll = async () => {
    const text = RESUME_BULLETS.flatMap((cat) =>
      cat.bullets.map((b) => `• ${b}`)
    ).join("\n")
    await navigator.clipboard.writeText(text)
    setCopied("all")
    setTimeout(() => setCopied(null), 2000)
  }

  const copyBullet = async (bullet: string) => {
    await navigator.clipboard.writeText(`• ${bullet}`)
    setCopied(bullet)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          12 power-verb bullets formatted for ATS resume and LinkedIn. Hover any bullet to copy.
        </p>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          {copied === "all" ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          {copied === "all" ? "Copied!" : "Copy all"}
        </button>
      </div>

      {RESUME_BULLETS.map((cat) => (
        <div key={cat.category} className="space-y-2">
          <p className={`text-xs font-semibold uppercase tracking-wider ${cat.color}`}>{cat.category}</p>
          <ul className="space-y-2">
            {cat.bullets.map((bullet) => (
              <li
                key={bullet.slice(0, 40)}
                className="group flex gap-2.5 rounded-md p-2.5 border border-transparent hover:border-border/60 hover:bg-card/60 transition-all cursor-pointer"
                onClick={() => copyBullet(bullet)}
                title="Click to copy"
              >
                <ChevronRight className={`size-3.5 shrink-0 mt-0.5 ${cat.color}`} />
                <span className="text-sm text-foreground/85 leading-relaxed flex-1">{bullet}</span>
                <span className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === bullet
                    ? <Check className="size-3.5 text-emerald-400" />
                    : <Copy className="size-3.5 text-muted-foreground" />}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Tab system ────────────────────────────────────────────────────────────────

type Tab = "architecture" | "tech-stack" | "resume"

const TABS: { id: Tab; label: string }[] = [
  { id: "architecture", label: "Architecture & Purpose" },
  { id: "tech-stack",   label: "Tech Stack" },
  { id: "resume",       label: "Resume Integration" },
]

// ─── Architecture content ──────────────────────────────────────────────────────

function ArchitectureTab() {
  return (
    <div className="space-y-8">

      {/* Overview */}
      <div className="space-y-3">
        <SectionHeading icon={BookOpen} title="Project Overview" accent="bg-blue-950/40 text-blue-400" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          SCM Control Tower is a Phase 0 academic portfolio application built to translate 5+ years of GM OT/ICS experience
          into formal ASCM supply chain management principles ahead of UMPI coursework (July 2026).
          The core premise: <span className="text-foreground font-medium">cyber events and physical supply chain disruptions don't add — they compound.</span>
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Traditional SCM tools model port congestion and vendor lead times. Traditional security tools model CVSS scores and attack surfaces.
          This application models both simultaneously — and quantifies what happens when they interact.
        </p>
      </div>

      {/* The convergence */}
      <div className="space-y-4">
        <SectionHeading icon={Shield} title="IT / OT Security × Physical SCM" accent="bg-rose-950/40 text-rose-400" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: Shield,
              label: "Attack Type → SCOR Node Mapping",
              color: "rose",
              desc: "Ransomware disrupts all 5 SCOR nodes (ERP = Plan, EDI = Source, robots = Make, manifests = Deliver, RMA = Return). Endpoint compromise isolates to Plan/Make. Network intrusion hits Source/Deliver at the IT/OT boundary.",
            },
            {
              icon: Zap,
              label: "Vulnerability Score → Lead Time Latency",
              color: "amber",
              desc: "CVSS-style 0–10 score converts to additional lead time days per SCOR node. TTS (Time-to-Survive) and TTR (Time-to-Recover) are calculated per node type, giving a quantified delay expectation per attack.",
            },
            {
              icon: GitBranch,
              label: "Compounding Disruption (×1.35)",
              color: "orange",
              desc: "Port congestion + simultaneous cyber event isn't 5d + 3d = 8d. It's (5+3) × 1.35 = 10.8d. When vessels queue at Kaohsiung AND the port's digital customs system is compromised, dwell time compounds geometrically through both queues.",
            },
            {
              icon: Database,
              label: "Financial Bridge: $22k/min",
              color: "emerald",
              desc: "The $22,000/minute GM automotive downtime constant translates cyber risk into supply chain dollars. A 5% probability ransomware event with a 2-day impact = $3.17M expected annual loss — justifying security investment in SCM business terms.",
            },
          ].map(({ icon: Icon, label, color, desc }) => (
            <div
              key={label}
              className={`rounded-md border p-3.5 space-y-2
                ${color === "rose"   ? "border-rose-500/20 bg-rose-950/10" :
                  color === "amber"  ? "border-amber-500/20 bg-amber-950/10" :
                  color === "orange" ? "border-orange-500/20 bg-orange-950/10" :
                                       "border-emerald-500/20 bg-emerald-950/10"}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`size-3.5
                  ${color === "rose"   ? "text-rose-400" :
                    color === "amber"  ? "text-amber-400" :
                    color === "orange" ? "text-orange-400" :
                                         "text-emerald-400"}`}
                />
                <span className="text-xs font-semibold text-foreground">{label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border/40 bg-card/40 p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground">The Proof of Concept: Kaohsiung → Port of LA → Romulus</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every node on this chain faces dual risk. Kaohsiung carries Taiwan Strait geopolitical exposure
            <span className="text-amber-400"> and</span> an unpatched supplier ERP vulnerability.
            Port of LA faces chronic congestion <span className="text-amber-400">and</span> CBP system intrusion risk.
            Romulus runs 400 OT endpoints behind a 45-day patch lag with FANUC robots whose downtime costs
            $22k/minute. The dashboard doesn't model these risks in isolation — it models them as a system,
            because that's how they fail.
          </p>
        </div>
      </div>

      {/* Data architecture */}
      <div className="space-y-3">
        <SectionHeading icon={Layers} title="Three-Layer Data Architecture" accent="bg-blue-950/40 text-blue-400" />
        <div className="space-y-2">
          {[
            {
              file: "scm-engine.ts",
              role: "Pure math layer (server + client safe)",
              desc: "EOQ, safety stock, ROP, cyber risk multiplier, automotive downtime constants. No I/O.",
            },
            {
              file: "supply-chain-nodes.ts",
              role: "Client-safe types + mock data",
              desc: "SupplyChainNode type, compoundDisruptions(), generateMockNodes(), calcChainLeadTime(). No Node.js imports.",
            },
            {
              file: "data-fetcher.ts",
              role: "Server-only CSV parser",
              desc: "Node.js fs, Kaggle CSV ingestion, flexible column resolution. Never imported by client components.",
            },
          ].map(({ file, role, desc }) => (
            <div key={file} className="flex gap-3 rounded-md border border-border/40 p-3">
              <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded h-fit shrink-0 whitespace-nowrap">
                {file}
              </code>
              <div>
                <p className="text-xs font-medium text-foreground">{role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Tech stack content ────────────────────────────────────────────────────────

function TechStackTab() {
  const stack = [
    {
      category: "Framework",
      items: [
        { name: "Next.js 16.2.1", note: "App Router, Turbopack, RSC, API Routes" },
        { name: "TypeScript", note: "Strict mode throughout" },
      ],
    },
    {
      category: "UI & Styling",
      items: [
        { name: "Tailwind v4", note: "CSS-first config, oklch color space, @custom-variant dark" },
        { name: "shadcn/ui + Base UI", note: "render prop pattern (not Radix asChild)" },
        { name: "DM Sans + Space Mono", note: "next/font/google — UI + data display" },
      ],
    },
    {
      category: "Animation",
      items: [
        { name: "Framer Motion 12", note: "Glitch variants, overlay spring transitions, AnimatePresence" },
      ],
    },
    {
      category: "Data Visualization",
      items: [
        { name: "Recharts 3", note: "Inventory turnover + lead time trend line charts" },
        { name: "react-simple-maps v3", note: "ComposableMap, geoMercator (Pacific), geoAlbersUsa" },
      ],
    },
    {
      category: "AI / API",
      items: [
        { name: "@anthropic-ai/sdk", note: "claude-haiku-4-5 for Feynman grading — 256 token structured JSON response" },
        { name: "Next.js Route Handler", note: "POST /api/feynman/evaluate — Node.js runtime, not Edge" },
      ],
    },
    {
      category: "Deployment",
      items: [
        { name: "Vercel", note: "Static pre-render for module pages, dynamic for API route" },
        { name: "vercel.json", note: "Env var declaration: @anthropic-api-key" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeading icon={Cpu} title="Tech Stack" accent="bg-cyan-950/40 text-cyan-400" />
      <div className="space-y-5">
        {stack.map(({ category, items }) => (
          <div key={category}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{category}</p>
            <div className="space-y-1.5">
              {items.map(({ name, note }) => (
                <div key={name} className="flex items-start gap-3 rounded border border-border/40 px-3 py-2">
                  <code className="text-xs font-mono text-primary shrink-0 mt-px">{name}</code>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border/40 bg-card/40 p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ExternalLink className="size-3.5 text-muted-foreground" />
          Why These Choices
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tailwind v4 was chosen for its CSS-first configuration and oklch color space (perceptual uniformity across dark theme accents).
          Recharts over Tremor because <code className="font-mono text-[10px] text-primary">@tremor/react</code> v3 has a hard peer dependency on Tailwind v3 — incompatible with v4's build pipeline.
          Base UI over Radix because shadcn v4 migrated to the <code className="font-mono text-[10px] text-primary">render</code> prop pattern.
          Claude Haiku was chosen for grading latency ({'<'}2s) without sacrificing evaluation depth.
        </p>
      </div>
    </div>
  )
}

// ─── Main modal ────────────────────────────────────────────────────────────────

export function ArchitectureModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("architecture")

  // Reset tab on open
  const open = () => { setActiveTab("architecture"); setIsOpen(true) }
  const close = () => setIsOpen(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* Trigger */}
      <button
        onClick={open}
        title="Architecture & Purpose"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/50 text-xs text-muted-foreground
          hover:text-foreground hover:border-border hover:bg-card transition-all duration-150"
      >
        <Info className="size-3.5" />
        <span className="hidden sm:inline">Architecture</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={close}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 mx-auto max-w-3xl flex flex-col
                rounded-xl border border-border/60 bg-background shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <Network className="size-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base">SCM Control Tower</h2>
                    <p className="text-xs text-muted-foreground">Architecture & Purpose · Phase 0 Portfolio</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 flex-wrap">
                    <Pill label="Next.js 16" color="border-blue-500/30 text-blue-400" />
                    <Pill label="OT/SCM" color="border-amber-500/30 text-amber-400" />
                    <Pill label="Claude AI" color="border-purple-500/30 text-purple-400" />
                  </div>
                  <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/40 shrink-0 px-6">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
                      ${activeTab === tab.id
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab body */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                  >
                    {activeTab === "architecture" && <ArchitectureTab />}
                    {activeTab === "tech-stack"   && <TechStackTab />}
                    {activeTab === "resume"        && <BulletSection />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-3 border-t border-border/40 shrink-0 bg-card/30">
                <p className="text-xs text-muted-foreground font-mono">
                  Phase 0 · Pre-Academic · UMPI SCM begins 07/06/2026
                </p>
                <button
                  onClick={close}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
