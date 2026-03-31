// Portfolio landing page — hero, projects grid, academic timeline, background
import Link from "next/link"
import {
  ArrowRight, Download, Shield, Cpu, Package, MapPin,
  GraduationCap, CheckCircle2, Circle, Clock, ExternalLink,
  Link2, ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { projects, experience, timeline } from "@/lib/site-config"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
      <span className="inline-block w-5 h-px bg-border" />
      <Icon className="size-3" />
      {label}
    </div>
  )
}

const STATUS_STYLES = {
  live:        "border-emerald-500/40 text-emerald-400",
  "in-progress":"border-amber-500/40 text-amber-400",
  placeholder: "border-border/60 text-muted-foreground",
} as const

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <span className="text-sm font-mono text-muted-foreground tracking-wide">
          {experience.name.split(" ")[0].toLowerCase()}.dev
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-xs
              text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Download className="size-3" />
            Resume
          </a>
          <Link
            href="/projects/scm-control-tower"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground
              text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Control Tower
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Gradient fade bottom */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative flex flex-col gap-6 max-w-3xl">
        {/* Location pill */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          <span>{experience.location} · Open to SCM analyst and operations roles</span>
        </div>

        {/* Name */}
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {experience.name}
          </h1>
          <p className="text-lg text-primary font-mono mt-2">{experience.headline}</p>
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-3 max-w-2xl">
          {experience.narrative.map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Credential badges */}
        <div className="flex flex-wrap gap-2">
          {[
            "CompTIA Security+",
            "OT / ICS · 5yr GM",
            "FANUC Robotics",
            "UMPI SCM — 2026",
            "WSU GSCM Cert",
          ].map((badge) => (
            <Badge key={badge} variant="secondary" className="font-mono text-xs">
              {badge}
            </Badge>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects/scm-control-tower"
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground
              text-sm font-medium hover:bg-primary/90 transition-colors group"
          >
            View SCM Control Tower
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-border/60
              text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            <Download className="size-4" />
            Download Resume
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 pt-4 border-t border-border/40 mt-2">
          {experience.stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
          <div>
            <p className="text-2xl font-mono font-bold text-foreground">$22k</p>
            <p className="text-xs text-muted-foreground mt-0.5">/min downtime modeled</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Featured project ─────────────────────────────────────────────────────────

function FeaturedProject() {
  const featured = projects.find((p) => p.featured)!
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel icon={Package} label="Featured Project" />
      <Link href={featured.href} className="group block">
        <div className="relative rounded-xl border border-primary/30 bg-card p-6 md:p-8
          hover:border-primary/60 transition-all duration-200 overflow-hidden">

          {/* Glow */}
          <div className="absolute top-0 left-0 w-64 h-32 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className={`font-mono text-[10px] ${STATUS_STYLES.live}`}>
                  Live
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">{featured.domain}</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{featured.metric}</p>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {featured.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {featured.stack.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-[10px] font-mono">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Callout block */}
            <div className="shrink-0 rounded-lg border border-border/40 bg-card/60 p-4 w-full md:w-56 space-y-3">
              {[
                { label: "Cyber simulation",  value: "3 attack types" },
                { label: "Feynman recall",    value: "17 ASCM terms" },
                { label: "AI grading",        value: "Claude Haiku" },
                { label: "Risk engine",       value: "SCOR × CVSS" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
                  <span className="text-xs font-mono text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-6 right-6 md:top-8 md:right-8">
            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </Link>
    </section>
  )
}

// ─── Projects grid ────────────────────────────────────────────────────────────

function ProjectsGrid() {
  const others = projects.filter((p) => !p.featured)
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel icon={Package} label="All Projects" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((project) => {
          const isPlaceholder = project.status === "placeholder"
          const card = (
            <Card
              className={`h-full flex flex-col border-border/60 transition-all duration-150 group
                ${isPlaceholder
                  ? "opacity-50 border-dashed"
                  : "hover:border-border hover:bg-card/80"}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{project.domain}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 font-mono text-[10px] ${STATUS_STYLES[project.status]}`}
                  >
                    {isPlaceholder ? "Planned" : "Live"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 flex-1">
                <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
                {project.metric && (
                  <p className="text-[10px] font-mono text-primary/70 bg-primary/5 border border-primary/15 rounded px-2 py-1">
                    {project.metric}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[10px] font-mono">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )

          if (!isPlaceholder && project.href !== "#") {
            return (
              <Link key={project.id} href={project.href} className="h-full block">
                {card}
              </Link>
            )
          }
          return <div key={project.id} className="h-full">{card}</div>
        })}
      </div>
    </section>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineItem({
  item,
  isLast,
}: {
  item: typeof timeline[number]
  isLast: boolean
}) {
  const isCurrent  = item.status === "current"
  const isComplete = item.status === "complete"
  const isUpcoming = item.status === "upcoming"

  return (
    <div className="relative flex gap-4">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border/60" />
      )}

      {/* Node */}
      <div className="shrink-0 mt-0.5 relative">
        {isComplete && (
          <CheckCircle2 className="size-6 text-emerald-400" />
        )}
        {isCurrent && (
          <div className="relative">
            <div className="size-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        )}
        {isUpcoming && (
          <Circle className="size-6 text-border" />
        )}
      </div>

      {/* Content */}
      <div className={`pb-8 flex-1 ${isUpcoming ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-xs font-mono font-bold
            ${isComplete ? "text-emerald-400" : isCurrent ? "text-primary" : "text-muted-foreground"}`}>
            {item.date}
          </span>
          {isCurrent && (
            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary px-1.5 py-0">
              Now
            </Badge>
          )}
          {isUpcoming && (
            <Clock className="size-3 text-muted-foreground/60" />
          )}
        </div>
        <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.detail}</p>
      </div>
    </div>
  )
}

function AcademicTimeline() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <SectionLabel icon={GraduationCap} label="Academic Trajectory" />
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-mono">Target completion</p>
          <p className="text-sm font-mono font-bold text-foreground">Jun 2027</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <div>
          {timeline.map((item, i) => (
            <TimelineItem key={item.title} item={item} isLast={i === timeline.length - 1} />
          ))}
        </div>

        {/* Degree summary */}
        <div className="hidden md:flex flex-col gap-4 pt-1">
          <div className="rounded-lg border border-border/60 p-5 space-y-4 h-fit sticky top-20">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Degree Target
              </p>
              <p className="text-sm font-semibold">B.A. Business Administration</p>
              <p className="text-xs text-primary font-mono mt-0.5">SCM Concentration · UMPI YourPace</p>
            </div>
            <div className="border-t border-border/40 pt-4 space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Parallel Certificate
              </p>
              <p className="text-sm font-semibold">GSCM Specialist Certificate</p>
              <p className="text-xs text-muted-foreground font-mono">Wayne State University</p>
            </div>
            <div className="border-t border-border/40 pt-4 space-y-2">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Post-Graduation Track
              </p>
              {["CSCP (Certified Supply Chain Professional)", "CPIM (Production & Inventory Mgmt)"].map((cert) => (
                <div key={cert} className="flex items-start gap-2">
                  <ChevronRight className="size-3 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{cert}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border/40 pt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Phase 0 progress</span>
                <span className="font-mono text-primary">In progress</span>
              </div>
              <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                <div className="h-full w-[12%] rounded-full bg-primary" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Pre-academic foundation · UMPI enrollment Jul 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Background ───────────────────────────────────────────────────────────────

function Background() {
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel icon={Shield} label="Professional Background" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GM role */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Shield className="size-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{experience.gmRole.title}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {experience.gmRole.company} · {experience.gmRole.duration}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1.5">
              {experience.gmRole.highlights.map((h, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <ChevronRight className="size-3 text-primary shrink-0 mt-px" />
                  {h}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* FANUC + academic */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                <Cpu className="size-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">FANUC Industrial Robotics · 4 Years</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  GM Romulus · Automotive Assembly
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hands-on setup, configuration, and integration of FANUC industrial robots in
              automotive manufacturing. TP programming, PLC I/O, safety circuits (E-stops,
              light curtains), LOTO procedures. At $22k/min downtime, uptime is a supply chain problem.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["TP Programming", "PLC I/O", "E-stop Circuits", "LOTO", "OT Security"].map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] font-mono">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="border-t border-border/40 pt-3 space-y-1">
              <p className="text-xs font-medium text-foreground">SCM Bridge</p>
              <p className="text-xs text-muted-foreground">
                Every robot downtime event is a supply chain event. That frame — security as a logistics variable — is what this entire portfolio is built on.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground font-mono text-center sm:text-left">
          {experience.name} · {experience.location} · Phase 0 Portfolio
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://${experience.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link2 className="size-3.5" />
            LinkedIn
            <ExternalLink className="size-2.5" />
          </a>
          <a
            href={`https://${experience.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link2 className="size-3.5" />
            GitHub
            <ExternalLink className="size-2.5" />
          </a>
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="size-3.5" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 flex flex-col gap-20 pb-20">
        <Hero />
        <FeaturedProject />
        <ProjectsGrid />
        <AcademicTimeline />
        <Background />
      </main>
      <Footer />
    </div>
  )
}
