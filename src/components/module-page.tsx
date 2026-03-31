// Shared layout for SCM concept module pages
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { ModuleStatus } from "@/lib/scm-modules"

const statusConfig = {
  available: { label: "Available", className: "bg-emerald/15 text-emerald border-emerald/30" },
  "in-progress": { label: "In Progress", className: "bg-amber/15 text-amber border-amber/30" },
  "coming-soon": { label: "Coming Soon", className: "bg-muted text-muted-foreground border-border" },
}

interface Concept {
  term: string
  definition: string
}

interface ModulePageProps {
  title: string
  status: ModuleStatus
  concepts: Concept[]
  gmAnalog: string
  formula?: string
  formulaExplanation?: string
}

export function ModulePage({
  title,
  status,
  concepts,
  gmAnalog,
  formula,
  formulaExplanation,
}: ModulePageProps) {
  const s = statusConfig[status]

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-semibold">{title}</h1>
          <Badge variant="outline" className={cn("font-mono text-[10px]", s.className)}>
            {s.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Sourced from COURSE_GOALS.md · ASCM baseline
        </p>
      </div>

      {/* Formula callout */}
      {formula && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <p className="font-mono text-base text-primary font-bold mb-2">{formula}</p>
            {formulaExplanation && (
              <p className="text-sm text-muted-foreground leading-relaxed">{formulaExplanation}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Concepts */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Core Concepts
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border/40">
          {concepts.map((concept, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">{concept.term}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{concept.definition}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* GM Analog */}
      <Card className="border-amber/20 bg-amber/5">
        <CardContent className="pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber mb-2">
            GM / Real-World Analog
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{gmAnalog}</p>
        </CardContent>
      </Card>

      <Separator className="opacity-30" />

      <p className="text-xs text-muted-foreground">
        Interactive tools for this module will be added once Phase 0 foundation is complete
        (target: 7/06/2026 UMPI start).
      </p>
    </div>
  )
}
