// Individual SCM module card for the dashboard grid — client component for Feynman recall button
"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScmModule } from "@/lib/scm-modules"
import { useFeynman } from "@/lib/feynman-context"

const statusConfig = {
  available:    { label: "ACTIVE",      className: "border-emerald-500/30 text-emerald-400" },
  "in-progress":{ label: "IN PROGRESS", className: "border-amber-500/30 text-amber-400" },
  "coming-soon":{ label: "SOON",        className: "border-border/50 text-muted-foreground" },
} as const

export function ModuleCard({ module, index }: { module: ScmModule; index?: number }) {
  const { openFeynman } = useFeynman()
  const status      = statusConfig[module.status]
  const isClickable = module.status !== "coming-soon"
  const num         = index !== undefined ? String(index + 1).padStart(2, "0") : null

  const cardContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-card border border-border/50 border-l-2 p-5 relative group transition-all duration-150",
        isClickable
          ? "border-l-primary/40 hover:border-l-primary hover:border-border/70 hover:bg-card/80 cursor-pointer"
          : "border-l-border/30 opacity-70 cursor-default"
      )}
    >
      {/* Feynman recall button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openFeynman(module.id)
        }}
        title={`Feynman recall: ${module.title}`}
        className="absolute top-3 right-3 z-10 p-1.5 border border-border/40 bg-background text-muted-foreground
          hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150
          opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Brain className="size-3.5" />
      </button>

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-2">
          {num && (
            <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{num}</span>
          )}
          <h3
            className="font-bold leading-tight text-foreground group-hover:text-primary transition-colors"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: "1.15rem",
              letterSpacing: "-0.01em",
            }}
          >
            {module.title}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 text-[9px] font-mono border px-1.5 py-0.5 leading-none mt-0.5 mr-6",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{module.description}</p>

      {/* Key formula */}
      {module.keyFormula && (
        <div className="mt-3 font-mono text-[11px] text-primary bg-primary/5 border border-primary/15 px-3 py-2">
          {module.keyFormula}
        </div>
      )}

      {/* GM analog */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-mono text-muted-foreground/70 uppercase tracking-wide text-[9px] mr-1">
            GM analog:
          </span>
          {module.gmAnalog}
        </p>
      </div>
    </div>
  )

  if (isClickable) {
    return (
      <Link href={module.href} className="h-full block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
