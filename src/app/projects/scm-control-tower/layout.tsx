// Control Tower layout — persistent sidebar + Feynman overlay provider across all SCM module routes
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { FeynmanProvider } from "@/lib/feynman-context"
import { FeynmanOverlay } from "@/components/feynman-overlay"
import { ArchitectureModal } from "@/components/architecture-modal"

export default function ControlTowerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-mono text-muted-foreground tracking-wide">
            SCM Control Tower
          </span>
          <div className="ml-auto">
            <ArchitectureModal />
          </div>
        </header>
        <main className="flex-1 p-6">
          <FeynmanProvider>
            {children}
            <FeynmanOverlay />
          </FeynmanProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
