// Individual SCM module card for the bento grid dashboard — client component for Feynman recall button
"use client"

import Link from "next/link"
import { Brain, Warehouse, Calculator, Timer, TrendingUp, BarChart3, Network, Play, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ScmModule } from "@/lib/scm-modules"
import { useFeynman } from "@/lib/feynman-context"

const iconMap: Record<string, React.ElementType> = {
  Warehouse,
  Calculator,
  Timer,
  TrendingUp,
  BarChart3,
  Network,
  Play,
  LayoutDashboard,
}

const statusConfig = {
  available:    { label: "Available",   className: "bg-emerald/15 text-emerald border-emerald/30" },
  "in-progress":{ label: "In Progress", className: "bg-amber/15 text-amber border-amber/30" },
  "coming-soon":{ label: "Coming Soon", className: "bg-muted text-muted-foreground border-border" },
} as const

export function ModuleCard({ module }: { module: ScmModule }) {
  const { openFeynman } = useFeynman()
  const Icon       = iconMap[module.icon] ?? LayoutDashboard
  const status     = statusConfig[module.status]
  const isClickable = module.status !== "coming-soon"

  const cardContent = (
    <Card
      className={cn(
        "h-full flex flex-col transition-colors duration-150 border-border/60 relative group",
        isClickable
          ? "hover:border-primary/50 hover:bg-card/80 cursor-pointer"
          : "opacity-80 cursor-default"
      )}
    >
      {/* Feynman recall button — always available, stops Link navigation */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openFeynman(module.id)
        }}
        title={`Feynman recall: ${module.title}`}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md border border-border/40 bg-card text-muted-foreground
          hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-150
          opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Brain className="size-3.5" />
      </button>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="p-2 rounded-lg bg-primary/10 w-fit">
            <Icon className="size-5 text-primary" />
          </div>
          <Badge
            variant="outline"
            className={cn("text-[10px] font-mono shrink-0 mr-7", status.className)}
          >
            {status.label}
          </Badge>
        </div>
        <h3 className="font-semibold text-foreground mt-2">{module.title}</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>

        {module.keyFormula && (
          <div className="font-mono text-xs text-primary bg-primary/5 border border-primary/20 rounded px-3 py-2">
            {module.keyFormula}
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-border/40">
          <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
            <span className="not-italic text-muted-foreground font-medium">GM analog: </span>
            {module.gmAnalog}
          </p>
        </div>
      </CardContent>
    </Card>
  )

  if (isClickable) {
    return <Link href={module.href} className="h-full block">{cardContent}</Link>
  }

  return cardContent
}
