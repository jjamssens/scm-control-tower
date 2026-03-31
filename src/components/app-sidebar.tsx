// SCM Control Tower sidebar — persistent navigation across all /projects/scm-control-tower/* routes
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Warehouse,
  Calculator,
  Timer,
  TrendingUp,
  BarChart3,
  Network,
  Play,
  ArrowLeft,
  GraduationCap,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const modules = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/projects/scm-control-tower", exact: true },
  { label: "Inventory Mgmt", icon: Warehouse, href: "/projects/scm-control-tower/inventory" },
  { label: "EOQ Calculator", icon: Calculator, href: "/projects/scm-control-tower/eoq" },
  { label: "JIT / Lean", icon: Timer, href: "/projects/scm-control-tower/jit" },
  { label: "Bullwhip Effect", icon: TrendingUp, href: "/projects/scm-control-tower/bullwhip" },
  { label: "Demand Forecasting", icon: BarChart3, href: "/projects/scm-control-tower/forecasting" },
  { label: "SCOR Model", icon: Network, href: "/projects/scm-control-tower/scor" },
]

const tools = [
  { label: "Simulation", icon: Play, href: "/projects/scm-control-tower/simulation" },
]

// Days until UMPI classes start (7/06/2026)
function daysToUmpi(): number {
  const start = new Date("2026-07-06")
  const today = new Date()
  const diff = start.getTime() - today.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function AppSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
            SCM Control Tower
          </span>
          <span className="text-xs text-muted-foreground">Phase 0 · Pre-Academic</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarMenu>
            {modules.map(({ label, icon: Icon, href, exact }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={isActive(href, exact)}
                  tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            {tools.map(({ label, icon: Icon, href }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={isActive(href)}
                  tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <GraduationCap className="size-3 shrink-0" />
          <span className="font-mono">{daysToUmpi()}d to UMPI</span>
          <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-auto">
            Phase 0
          </Badge>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to Portfolio"
              className="text-muted-foreground"
            >
              <ArrowLeft />
              <span>Back to Portfolio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
