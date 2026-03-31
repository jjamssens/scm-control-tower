// SCM module definitions — sourced from COURSE_GOALS.md
// Each entry drives a sidebar nav item AND a bento grid card on the dashboard

export type ModuleStatus = "available" | "in-progress" | "coming-soon"

export interface ScmModule {
  id: string
  title: string
  description: string
  /** One-liner connecting the concept to real GM/eBay experience (from EXPERIENCE.md) */
  gmAnalog: string
  /** Lucide icon name */
  icon: string
  href: string
  status: ModuleStatus
  /** Column span in the bento grid: 1 = normal, 2 = featured/wide */
  span: 1 | 2
  /** Key formula or concept to surface on the card */
  keyFormula?: string
}

export const scmModules: ScmModule[] = [
  {
    id: "inventory",
    title: "Inventory Management",
    description:
      "Carrying cost, ordering cost, safety stock, ROP, ABC analysis, and cycle counting. The core tradeoff: holding too much ties up capital; holding too little stops production.",
    gmAnalog: "400+ PCs, 700+ switches — CMDB is a warehouse management system. BigFix = cycle count tool.",
    icon: "Warehouse",
    href: "/projects/scm-control-tower/inventory",
    status: "in-progress",
    span: 2,
    keyFormula: "ROP = (avg daily demand × lead time) + safety stock",
  },
  {
    id: "eoq",
    title: "EOQ Calculator",
    description:
      "Economic Order Quantity: find the order size that minimizes total inventory cost. The inflection point where ordering cost and carrying cost curves cross.",
    gmAnalog: "Robot changeover between part variants = setup cost (S) in the EOQ formula.",
    icon: "Calculator",
    href: "/projects/scm-control-tower/eoq",
    status: "in-progress",
    span: 1,
    keyFormula: "EOQ = √( 2DS / H )",
  },
  {
    id: "jit",
    title: "JIT / Lean",
    description:
      "Just-in-Time: receive or produce goods exactly when needed. Pull systems, takt time, kanban. Originated at Toyota. Fragile to disruption — the chip shortage proved it.",
    gmAnalog: "GM tugger trains replenishing line-side parts = kanban in practice. OT network downtime = missed delivery.",
    icon: "Timer",
    href: "/projects/scm-control-tower/jit",
    status: "coming-soon",
    span: 1,
  },
  {
    id: "bullwhip",
    title: "Bullwhip Effect",
    description:
      "Small consumer demand swings amplify into massive order swings upstream. Root causes: demand signal processing, order batching, price fluctuations, shortage gaming.",
    gmAnalog: "Chip shortage 2020–2023: Tier 1s over-ordered → fabs ramped → market flooded → prices crashed.",
    icon: "TrendingUp",
    href: "/projects/scm-control-tower/bullwhip",
    status: "coming-soon",
    span: 2,
  },
  {
    id: "forecasting",
    title: "Demand Forecasting",
    description:
      "Moving average, exponential smoothing, regression. All forecasts are wrong — the goal is to be wrong in a measurable, manageable way. Track MAD, MAPE, and Bias.",
    gmAnalog: "eBay sell-through rate = real-time demand sensing with zero forecasting infrastructure.",
    icon: "BarChart3",
    href: "/projects/scm-control-tower/forecasting",
    status: "coming-soon",
    span: 1,
  },
  {
    id: "scor",
    title: "SCOR Model",
    description:
      "Supply Chain Operations Reference: Plan → Source → Make → Deliver → Return. The ASCM standard framework for benchmarking and process improvement.",
    gmAnalog: "Plant network → production line → shipping dock maps directly onto Source → Make → Deliver.",
    icon: "Network",
    href: "/projects/scm-control-tower/scor",
    status: "coming-soon",
    span: 1,
  },
]

export const simulationModule = {
  id: "simulation",
  title: "Simulation",
  description: "Interactive EOQ/ROP/Safety Stock simulator with disruption scenarios.",
  icon: "Play",
  href: "/projects/scm-control-tower/simulation",
  status: "coming-soon" as ModuleStatus,
}
