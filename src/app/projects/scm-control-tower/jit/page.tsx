// JIT / Lean module
import { ModulePage } from "@/components/module-page"

export default function JitPage() {
  return (
    <ModulePage
      title="Just-in-Time (JIT) / Lean"
      status="coming-soon"
      concepts={[
        {
          term: "Core Principle",
          definition:
            "Receive or produce goods exactly when needed. Zero buffer. Demand triggers production — production doesn't push to a warehouse.",
        },
        {
          term: "Pull vs Push",
          definition:
            "Push: produce to forecast, pile up WIP. Pull: downstream demand pulls inventory upstream. Kanban cards are the physical signal in a pull system.",
        },
        {
          term: "Takt Time",
          definition:
            "Available production time ÷ customer demand rate. If you have 480 min/day and need 240 units, takt = 2 min/unit. Every process must match takt or you have a bottleneck.",
        },
        {
          term: "Kanban",
          definition:
            "Physical or digital signal authorizing replenishment of exactly one standard container. GM tugger trains replenish line-side parts bins using kanban logic.",
        },
        {
          term: "Single-Piece Flow",
          definition:
            "Move one unit at a time instead of batches. Exposes quality defects immediately — a defect in batch of 500 hides for hours. Single-piece flow surfaces it in seconds.",
        },
        {
          term: "JIT's Fatal Flaw",
          definition:
            "Zero buffer = zero resilience. COVID-19 chip shortage: automotive plants built to JIT had no inventory buffer. One missing $3 chip stopped a $50,000 vehicle. The tradeoff is real.",
        },
      ]}
      gmAnalog="GM plants run modified JIT for sub-assemblies. Line-side parts bins have kanban cards. Tugger trains replenish on a fixed circuit. OT network reliability is a JIT dependency — a 15-minute network outage stops the kanban signal the same as a missed delivery."
    />
  )
}
