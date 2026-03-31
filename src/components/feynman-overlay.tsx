// Feynman Active Recall overlay — sliding right panel with definition, GM/eBay analog, and graded test
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Factory, ShoppingCart, GraduationCap, Brain, ChevronRight, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFeynman } from "@/lib/feynman-context"
import {
  getFeynmanEntry,
  getRelatedEntries,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/feynman-content"

// ─── Grade display ─────────────────────────────────────────────────────────────

interface GradeResult {
  grade: string
  score: number
  correction: string
  strength: string
}

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-400 border-emerald-500/40 bg-emerald-950/20",
  B: "text-blue-400   border-blue-500/40   bg-blue-950/20",
  C: "text-amber-400  border-amber-500/40  bg-amber-950/20",
  D: "text-orange-400 border-orange-500/40 bg-orange-950/20",
  F: "text-rose-400   border-rose-500/40   bg-rose-950/20",
}

function GradeCard({ result }: { result: GradeResult }) {
  const colors = GRADE_COLORS[result.grade] ?? GRADE_COLORS["C"]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-md border p-4 space-y-3 ${colors}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-5xl font-mono font-bold tabular-nums">{result.grade}</span>
        <div>
          <p className="text-2xl font-mono font-semibold">{result.score}%</p>
          <p className="text-xs opacity-70 font-mono uppercase tracking-wider">
            UMPI Readiness Score
          </p>
        </div>
      </div>
      <div className="space-y-2 text-sm border-t border-current/20 pt-3">
        <div className="flex gap-2">
          <CheckCircle className="size-4 shrink-0 mt-0.5 text-emerald-400" />
          <p className="text-foreground/80 leading-relaxed">{result.strength}</p>
        </div>
        <div className="flex gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-400" />
          <p className="text-foreground/80 leading-relaxed">{result.correction}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section wrapper ────────────────────────────────────────────────────────────

function Section({ icon: Icon, title, accent, children }: {
  icon: React.ElementType
  title: string
  accent?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`size-3.5 ${accent ?? "text-muted-foreground"}`} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── Main overlay ───────────────────────────────────────────────────────────────

export function FeynmanOverlay() {
  const { activeTerm, closeFeynman, openFeynman } = useFeynman()
  const entry    = activeTerm ? getFeynmanEntry(activeTerm) : null
  const related  = entry ? getRelatedEntries(activeTerm!) : []

  const [explanation, setExplanation] = useState("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [gradeResult, setGradeResult]   = useState<GradeResult | null>(null)
  const [evalError, setEvalError]       = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset state when term changes
  useEffect(() => {
    setExplanation("")
    setGradeResult(null)
    setEvalError(null)
  }, [activeTerm])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeFeynman() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [closeFeynman])

  // Lock body scroll while open
  useEffect(() => {
    if (activeTerm) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [activeTerm])

  const handleEvaluate = async () => {
    if (!entry || explanation.trim().length < 20) return
    setIsEvaluating(true)
    setGradeResult(null)
    setEvalError(null)
    try {
      const res = await fetch("/api/feynman/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termId: entry.id, explanation: explanation.trim() }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json()
      setGradeResult(data)
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : "Evaluation failed — check ANTHROPIC_API_KEY in .env.local")
    } finally {
      setIsEvaluating(false)
    }
  }

  const categoryColor = entry ? CATEGORY_COLORS[entry.category] : ""
  const contextIcon   = entry?.realWorldApp.context === "ebay" ? ShoppingCart : Factory
  const contextLabel  = entry?.realWorldApp.context === "both"
    ? "GM / eBay"
    : entry?.realWorldApp.context === "ebay"
    ? "eBay Micro-Logistics"
    : "GM Romulus"

  return (
    <AnimatePresence>
      {activeTerm && entry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={closeFeynman}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border/60 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/40 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`font-mono text-[10px] ${categoryColor}`}>
                    {CATEGORY_LABELS[entry.category]}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[10px] border-border/40 text-muted-foreground">
                    Feynman Recall
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-foreground leading-tight">{entry.term}</h2>
              </div>
              <button
                onClick={closeFeynman}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-1"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

              {/* Textbook Definition */}
              <Section icon={BookOpen} title="Textbook Definition" accent="text-blue-400">
                <div className="rounded-md border border-blue-500/20 bg-blue-950/10 p-4 space-y-3">
                  <p className="text-sm text-foreground/85 leading-relaxed">{entry.textbookDef}</p>
                  {entry.formula && (
                    <div className="border-t border-blue-500/20 pt-3 space-y-1.5">
                      <p className="font-mono text-sm font-bold text-blue-300 bg-blue-950/30 px-3 py-2 rounded">
                        {entry.formula}
                      </p>
                      {entry.formulaBreakdown && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {entry.formulaBreakdown}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Section>

              {/* Real-World Application */}
              <Section icon={contextIcon} title={`In Practice — ${contextLabel}`} accent="text-amber-400">
                <div className="rounded-md border border-amber-500/20 bg-amber-950/10 p-4">
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {entry.realWorldApp.description}
                  </p>
                </div>
              </Section>

              {/* Exam Tips */}
              <Section icon={GraduationCap} title="UMPI Exam Tips" accent="text-purple-400">
                <ul className="space-y-2">
                  {entry.examTips.map((tip, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight className="size-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Divider */}
              <div className="border-t border-border/40" />

              {/* Test My Knowledge */}
              <Section icon={Brain} title="Test My Knowledge" accent="text-emerald-400">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Explain <span className="font-semibold text-foreground">{entry.term}</span> in your own words.
                    Your explanation will be graded against ASCM/UMPI standards and scored for exam readiness.
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder={`Explain ${entry.term} as if teaching it to someone who has never studied supply chain...`}
                    rows={5}
                    className="w-full rounded-md border border-border/60 bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {explanation.trim().length < 20
                        ? `${20 - explanation.trim().length} characters minimum`
                        : `${explanation.trim().split(/\s+/).length} words`}
                    </p>
                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating || explanation.trim().length < 20}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium
                        hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Brain className="size-3.5" />
                          Evaluate My Understanding
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Section>

              {/* Grade result */}
              <AnimatePresence>
                {gradeResult && <GradeCard result={gradeResult} />}
                {evalError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-md border border-rose-500/40 bg-rose-950/10 p-3 text-sm text-rose-400"
                  >
                    {evalError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Related terms */}
              {related.length > 0 && (
                <>
                  <div className="border-t border-border/40" />
                  <Section icon={ChevronRight} title="Related Concepts">
                    <div className="flex flex-wrap gap-2">
                      {related.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => openFeynman(rel.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/60 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                        >
                          {rel.term}
                          <ChevronRight className="size-3" />
                        </button>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              {/* Bottom padding */}
              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
