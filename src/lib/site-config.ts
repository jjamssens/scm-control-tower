// Portfolio project and experience data — sourced from EXPERIENCE.md
// Drives the landing page hero, project grid, timeline, and background sections

export type ProjectStatus = "live" | "in-progress" | "placeholder"

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  domain: string
  href: string
  featured?: boolean
  status: ProjectStatus
  metric?: string  // one-line value prop / result
}

export const projects: Project[] = [
  {
    id: "scm-control-tower",
    title: "SCM Control Tower",
    description:
      "Full-stack supply chain risk dashboard bridging OT cybersecurity with ASCM logistics principles. Cyber breach simulator with $22k/min financial exposure modeling, dual-scale geographic routing, Feynman Active Recall with AI grading, and live risk scoring across SCOR nodes.",
    stack: ["Next.js 16", "TypeScript", "Framer Motion", "Recharts", "Claude API"],
    domain: "SCM Portfolio · Phase 0",
    href: "/projects/scm-control-tower",
    featured: true,
    status: "live",
    metric: "Kaohsiung → Port of LA → Romulus · 21d chain · $22k/min downtime model",
  },
  {
    id: "osha-loto-pro",
    title: "OSHA LOTO Pro",
    description:
      "Lockout/Tagout program generator for EHS managers. Produces compliant written programs citing 29 CFR 1910.147. Reduces 4–8 hour manual writing to minutes. Average OSHA citation avoided: $15,625.",
    stack: ["Python", "Flask", "HTML/JS"],
    domain: "Industrial Compliance",
    href: "#",
    status: "live",
    metric: "Cites 29 CFR 1910.147 · avg citation $15,625",
  },
  {
    id: "15-lb-guard-pro",
    title: "15-LB Guard Pro",
    description:
      "EPA refrigerant leak rate calculator for HVAC contractors and facility managers. Tracks compliance with 40 CFR Part 82. Stores inputs alongside outputs for traceable compliance records. EPA violations: up to $69,733/day.",
    stack: ["Python", "Flask", "HTML/JS"],
    domain: "EPA Compliance",
    href: "#",
    status: "live",
    metric: "40 CFR §82.157 · violations up to $69,733/day",
  },
  {
    id: "lead-scraper",
    title: "Lead Scraper + AI Outreach",
    description:
      "B2B outreach automation for SDRs and agency operators. 100 cities × 10 results = 1,000 leads/day pipeline. Integrates with Bland.ai for automated AI phone calls with dynamic script injection.",
    stack: ["Python", "SQLite", "Bland.ai"],
    domain: "B2B Automation",
    href: "#",
    status: "live",
    metric: "1,000 leads/day · AI phone outreach",
  },
  {
    id: "piano-tutor",
    title: "Piano Tutor",
    description:
      "AI-powered piano learning app for adults. Real-time MIDI feedback, lesson progression, and performance tracking via Electron/React. Play your first full song by lesson 3.",
    stack: ["Electron", "React", "TypeScript"],
    domain: "Consumer Learning",
    href: "#",
    status: "live",
    metric: "Real-time MIDI · first song by lesson 3",
  },
  {
    id: "ebay-tracker",
    title: "eBay Net Profit Tracker",
    description:
      "True margin tracker for eBay resellers. Calculates actual profit after platform fees, shipping, and COGS. Built because eBay Seller Hub shows gross revenue, not what you actually made.",
    stack: ["PowerShell", "CSV"],
    domain: "Reseller Tools",
    href: "#",
    status: "live",
    metric: "True margin after fees + COGS",
  },
  {
    id: "scm-risk-platform",
    title: "SCM Risk Intelligence",
    description:
      "Planned: multi-tier supplier risk scoring platform with geopolitical exposure indexing, Tier-1/2/3 vulnerability mapping, and Monte Carlo disruption simulation for enterprise supply chains.",
    stack: ["Next.js", "Python", "D3.js"],
    domain: "Enterprise SCM",
    href: "#",
    status: "placeholder",
    metric: "Monte Carlo disruption simulation",
  },
  {
    id: "ot-compliance-suite",
    title: "OT Compliance Automation",
    description:
      "Planned: automated OT/ICS compliance gap analysis tool mapping NIST CSF controls to IEC 62443 standards. Generates remediation roadmaps with estimated effort and priority scoring.",
    stack: ["Python", "FastAPI", "React"],
    domain: "OT / ICS Security",
    href: "#",
    status: "placeholder",
    metric: "NIST CSF × IEC 62443 mapping",
  },
]

export const experience = {
  name:     "Justin Jamssens",
  tagline:  "OT Cybersecurity Engineer · SCM Student · Builder",
  location: "Belleville, MI",
  email:    "justin@example.com",         // replace before deploying
  linkedin: "linkedin.com/in/justin-jamssens",
  github:   "github.com/jjamssens",

  headline: "From plant-floor OT networks to supply chain resilience modeling.",
  narrative: [
    "Five years inside General Motors' OT network taught me how supply chains actually fail — not from spreadsheet models, but from a 45-day patch lag on 400 endpoints, a FANUC robot arm that costs $22,000 per minute offline, and a semiconductor shortage that idled plants over $50 chips no forecast predicted.",
    "Now I'm building the tools to model those failure modes: financial exposure simulators, compounding disruption engines, and AI-graded recall systems for ASCM concepts — anchored to plant-floor experience most supply chain analysts don't have.",
  ],

  stats: [
    { value: "5+",  label: "Years GM OT/ICS" },
    { value: "10",  label: "Plant Sites" },
    { value: "400+",label: "Managed Endpoints" },
  ],

  gmRole: {
    title:    "OT Cybersecurity Engineer (Contractor)",
    company:  "General Motors · Romulus, MI",
    duration: "Oct 2019 – Present · 5+ years",
    highlights: [
      "OT/ICS cybersecurity across 10 automotive manufacturing plant sites",
      "Maintained CMDB inventory: 400+ PCs, 700+ network switches",
      "Led nationwide cable migration of 10,000+ cables across sites",
      "Coordinated directly with machine vendors: Marposs, Reishauer, Buderus",
      "FANUC robot integration: TP programming, PLC I/O, safety circuits",
    ],
  },

  certifications: ["CompTIA Security+"],

  academic: {
    umpi:  "B.A. Business Administration, SCM Concentration — UMPI YourPace (target: June 2027)",
    wsu:   "GSCM Specialist Certificate — Wayne State University (in parallel)",
    start: "7/06/2026",
  },
}

export const timeline = [
  {
    date:   "Oct 2019",
    title:  "Joined General Motors",
    detail: "OT Cybersecurity Engineer (Contractor) · Romulus, MI · Automotive manufacturing OT/ICS deployment across 10 plant sites.",
    status: "complete" as const,
  },
  {
    date:   "2020–2021",
    title:  "Chip Shortage — JIT Failure at Scale",
    detail: "Observed firsthand how a $50 semiconductor shortage idled GM assembly lines for weeks. The fragility of JIT supply chains became concrete, not academic.",
    status: "complete" as const,
  },
  {
    date:   "2019–2025",
    title:  "FANUC Robotics & OT Network Build-out",
    detail: "Hands-on FANUC robot integration: TP programming, PLC I/O, safety circuits. Maintained 700+ network switches across plant floor OT/IT boundary.",
    status: "complete" as const,
  },
  {
    date:   "2024",
    title:  "CompTIA Security+ Certified",
    detail: "Formalized cybersecurity knowledge base alongside practical OT experience.",
    status: "complete" as const,
  },
  {
    date:   "Mar 2026",
    title:  "SCM Control Tower — Phase 0 Launch",
    detail: "Built this portfolio application: cyber breach simulation, Feynman Active Recall, supply chain risk engine. Applied GM experience as formal ASCM analogs.",
    status: "current" as const,
  },
  {
    date:   "Jul 2026",
    title:  "UMPI Enrollment — BBA SCM",
    detail: "University of Maine Presque Isle · YourPace program · B.A. Business Administration, Supply Chain Management concentration.",
    status: "upcoming" as const,
  },
  {
    date:   "2026–2027",
    title:  "WSU GSCM Certificate (Parallel)",
    detail: "Wayne State University · GSCM Specialist Certificate · coursework runs in parallel with UMPI.",
    status: "upcoming" as const,
  },
  {
    date:   "Jun 2027",
    title:  "BBA Completion",
    detail: "Target graduation · B.A. Business Administration, SCM Concentration · eligible for CSCP certification track.",
    status: "upcoming" as const,
  },
]
