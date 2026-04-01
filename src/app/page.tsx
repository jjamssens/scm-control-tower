// Portfolio landing page
import Link from "next/link"
import {
  ArrowRight, Download, ExternalLink, Link2,
  ChevronRight, CheckCircle2, Circle, Clock, Mail,
} from "lucide-react"
import { projects, experience, timeline } from "@/lib/site-config"

// ─── Shared label ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em] mb-5 pb-2 border-b border-border/40">
      {label}
    </p>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground tracking-[0.12em] uppercase">
          {experience.name.replace(" ", "_").toLowerCase()}
        </span>
        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href={`https://${experience.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={`https://${experience.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            ↓ Resume
          </a>
          <Link
            href="/projects/scm-control-tower"
            className="px-3 py-1 border border-primary/60 text-[11px] font-mono text-primary
              hover:bg-primary/10 transition-colors tracking-wide"
          >
            Control Tower →
          </Link>
        </div>
        {/* Mobile — just the primary CTA */}
        <div className="flex sm:hidden items-center gap-3">
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="text-[11px] font-mono text-muted-foreground"
          >
            ↓ Resume
          </a>
          <Link
            href="/projects/scm-control-tower"
            className="px-3 py-1 border border-primary/60 text-[11px] font-mono text-primary
              hover:bg-primary/10 transition-colors tracking-wide"
          >
            Control Tower →
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-10 pb-4">

      <p
        className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.14em] mb-5"
        data-reveal
        style={{ animationDelay: "0ms" }}
      >
        OT Cybersecurity Engineer &nbsp;·&nbsp; SCM Student &nbsp;·&nbsp; {experience.location}
      </p>

      <div data-reveal style={{ animationDelay: "60ms" }}>
        <h1
          className="font-extrabold leading-[0.9] tracking-[-0.02em] text-foreground"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
          }}
        >
          {experience.name.split(" ")[0]}{" "}
          {experience.name.split(" ")[1]}
        </h1>
      </div>

      {/* Stats strip */}
      <div
        className="mt-8 py-4 border-t border-b border-border flex items-center flex-wrap gap-y-3"
        data-reveal
        style={{ animationDelay: "120ms" }}
      >
        {[
          { value: "5+ YR", label: "GM OT/ICS" },
          { value: "10",    label: "Plant Sites" },
          { value: "400+",  label: "Endpoints" },
          { value: "$22K",  label: "/ min downtime" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center">
            {i > 0 && <span className="mx-5 md:mx-7 text-border select-none">|</span>}
            <div className="flex items-baseline gap-2">
              <span
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
              >
                {value}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs + credentials */}
      <div
        className="mt-7 flex flex-col sm:flex-row sm:items-center gap-5"
        data-reveal
        style={{ animationDelay: "180ms" }}
      >
        <div className="flex items-center gap-5">
          <Link
            href="/projects/scm-control-tower"
            className="flex items-center gap-2 text-sm font-mono text-primary hover:opacity-80 transition-opacity"
          >
            View SCM Control Tower <ArrowRight className="size-3.5" />
          </Link>
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="size-3.5" /> Resume
          </a>
        </div>

        <div className="flex flex-wrap gap-2 sm:border-l sm:border-border sm:pl-5">
          {["Security+", "OT / ICS", "FANUC", "UMPI 2026"].map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 border border-border text-[10px] font-mono text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <SectionLabel label="About" />
      <div className="max-w-2xl flex flex-col gap-4">
        {experience.narrative.map((para, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </section>
  )
}

// ─── Background ───────────────────────────────────────────────────────────────

function Background() {
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <SectionLabel label="Professional Background" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GM role */}
        <div className="border-l-2 border-primary/40 bg-card border border-border/40 p-5 space-y-4">
          <div>
            <p className="text-[10px] font-mono text-primary uppercase tracking-wider">Oct 2019 – Present</p>
            <h3
              className="font-bold mt-1"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.2rem" }}
            >
              {experience.gmRole.title}
            </h3>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              {experience.gmRole.company}
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {experience.gmRole.highlights.map((h, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <ChevronRight className="size-3 text-primary/60 shrink-0 mt-px" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* FANUC */}
        <div className="border-l-2 border-primary/40 bg-card border border-border/40 p-5 space-y-4">
          <div>
            <p className="text-[10px] font-mono text-primary uppercase tracking-wider">2019 – 2025</p>
            <h3
              className="font-bold mt-1"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.2rem" }}
            >
              FANUC Industrial Robotics
            </h3>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
              GM Romulus · Automotive Assembly
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hands-on setup and integration of FANUC robots in automotive manufacturing.
            TP programming, PLC I/O, safety circuits, LOTO procedures.
            When an arm goes down, the production line stops. That is a supply chain problem, not just a maintenance ticket.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["TP Programming", "PLC I/O", "E-stop Circuits", "LOTO", "OT Security"].map((tag) => (
              <span key={tag} className="text-[9px] font-mono text-muted-foreground border border-border/40 px-1.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
          <div className="border-t border-border/40 pt-3">
            <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">SCM Bridge</p>
            <p className="text-xs text-muted-foreground">
              The LOTO procedure is part of the fulfillment process. That connection is what this portfolio is built on.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Academic Timeline ────────────────────────────────────────────────────────

function AcademicTimeline() {
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <div className="flex items-center justify-between mb-5 pb-2 border-b border-border/40">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
          Academic Trajectory
        </p>
        <span className="text-[11px] font-mono text-muted-foreground">Target: Jun 2027</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <div>
          {timeline.map((item, i) => {
            const isLast    = i === timeline.length - 1
            const isCurrent = item.status === "current"
            const isComplete= item.status === "complete"

            return (
              <div key={item.title} className="relative flex gap-4">
                {!isLast && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border/40" />
                )}
                <div className="shrink-0 mt-0.5">
                  {isComplete && <CheckCircle2 className="size-6 text-emerald-400" />}
                  {isCurrent && (
                    <div className="size-6 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
                      <div className="size-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                  {item.status === "upcoming" && <Circle className="size-6 text-border" />}
                </div>
                <div className={`pb-8 flex-1 ${item.status === "upcoming" ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[11px] font-mono font-bold
                      ${isComplete ? "text-emerald-400" : isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                      {item.date}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-mono border border-primary/40 text-primary px-1 py-0.5 leading-none">
                        NOW
                      </span>
                    )}
                    {item.status === "upcoming" && <Clock className="size-3 text-muted-foreground/40" />}
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.detail}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden md:block">
          <div className="border border-border/40 border-l-2 border-l-primary/40 bg-card p-5 space-y-4 sticky top-16">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Degree Target</p>
              <p className="font-bold leading-tight" style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.25rem" }}>
                B.A. Business Administration
              </p>
              <p className="text-[11px] font-mono text-primary mt-0.5">SCM Concentration · UMPI YourPace</p>
            </div>
            <div className="border-t border-border/40 pt-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">Parallel Certificate</p>
              <p className="text-sm font-semibold">GSCM Specialist Certificate</p>
              <p className="text-[11px] font-mono text-muted-foreground">Wayne State University</p>
            </div>
            <div className="border-t border-border/40 pt-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Post-Graduation Track</p>
              {["CSCP — Certified Supply Chain Professional", "CPIM — Production & Inventory Mgmt"].map((cert) => (
                <div key={cert} className="flex items-start gap-2 mb-1.5">
                  <ChevronRight className="size-3 text-primary/60 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{cert}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border/40 pt-4">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                <span>Phase 0 progress</span>
                <span className="text-primary">Active</span>
              </div>
              <div className="h-1 bg-border/40">
                <div className="h-full w-[12%] bg-primary" />
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mt-1.5">
                Pre-academic foundation · UMPI enrollment Jul 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Featured Project ──────────────────────────────────────────────────────────

function FeaturedProject() {
  const featured = projects.find((p) => p.featured)!
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <SectionLabel label="Featured Work" />

      <Link href={featured.href} className="group block">
        <div className="border-l-2 border-primary bg-card border border-border/40 p-6 md:p-8
          hover:border-border hover:border-l-primary transition-all duration-200">

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5">
                LIVE
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{featured.domain}</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          <h2
            className="font-extrabold leading-tight mb-3 group-hover:text-primary transition-colors"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
          >
            {featured.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-5">
            Full-stack supply chain risk dashboard built on GM plant-floor experience. Cyber breach simulator,
            Feynman active recall with AI grading, and live risk scoring across SCOR nodes.
          </p>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              "3 attack types · $22k/min model",
              "17 ASCM terms · AI graded",
              "SCOR × CVSS risk engine",
              "Kaohsiung → LA → Romulus route",
            ].map((m) => (
              <span key={m} className="text-[10px] font-mono text-primary/80 border border-primary/20 bg-primary/5 px-2 py-1">
                {m}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {featured.stack.map((tech) => (
              <span key={tech} className="text-[10px] font-mono text-muted-foreground border border-border/50 px-1.5 py-0.5">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </section>
  )
}

// ─── Projects Grid ────────────────────────────────────────────────────────────

function ProjectsGrid() {
  const others = projects.filter((p) => !p.featured && p.status !== "placeholder")
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <SectionLabel label="Other Projects" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
        {others.map((project, i) => {
          const num = String(i + 1).padStart(2, "0")

          const inner = (
            <div className="h-full bg-background p-5 flex flex-col gap-3 border-l-2 border-border/50
              hover:border-primary hover:bg-card group cursor-pointer transition-all duration-150">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground/40">{num}</span>
                  <h3
                    className="font-bold leading-tight text-foreground group-hover:text-primary transition-colors"
                    style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.1rem" }}
                  >
                    {project.title}
                  </h3>
                </div>
                <span className="shrink-0 text-[9px] font-mono border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 leading-none mt-0.5">
                  LIVE
                </span>
              </div>

              <p className="text-[11px] font-mono text-muted-foreground/70">{project.domain}</p>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{project.description}</p>

              {project.metric && (
                <p className="text-[10px] font-mono text-primary/70 bg-primary/5 border border-primary/15 px-2 py-1">
                  {project.metric}
                </p>
              )}

              <div className="flex flex-wrap gap-1 pt-1">
                {project.stack.map((tech) => (
                  <span key={tech} className="text-[9px] font-mono text-muted-foreground border border-border/40 px-1.5 py-0.5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )

          if (project.href !== "#") {
            return <Link key={project.id} href={project.href} className="block">{inner}</Link>
          }
          return <div key={project.id}>{inner}</div>
        })}
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section data-reveal style={{ animationDelay: "0ms" }}>
      <SectionLabel label="Get in Touch" />
      <div className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground max-w-lg">
          Looking for SCM analyst, operations, or OT-adjacent roles starting in 2026.
          Reach out directly — no contact form.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href={`mailto:${experience.email}`}
            className="flex items-center gap-2 text-sm font-mono text-primary hover:opacity-80 transition-opacity"
          >
            <Mail className="size-3.5" /> {experience.email}
          </a>
          <a
            href={`https://${experience.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link2 className="size-3.5" /> LinkedIn <ExternalLink className="size-3" />
          </a>
          <a
            href={`https://${experience.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link2 className="size-3.5" /> GitHub <ExternalLink className="size-3" />
          </a>
          <a
            href="/resume-justin-jamssens.pdf"
            download
            className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="size-3.5" /> Resume PDF
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border/40 py-5 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-[11px] font-mono text-muted-foreground">
          {experience.name} · {experience.location} · Phase 0
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">
          Built with Next.js · Deployed on Vercel
        </span>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 flex flex-col gap-16 pb-20">
        <Hero />
        <About />
        <Background />
        <AcademicTimeline />
        <FeaturedProject />
        <ProjectsGrid />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
