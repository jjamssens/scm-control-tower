// Bento grid layout wrapper — CSS Grid with variable column spans
import { cn } from "@/lib/utils"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoItemProps {
  children: React.ReactNode
  span?: 1 | 2
  className?: string
}

export function BentoItem({ children, span = 1, className }: BentoItemProps) {
  return (
    <div
      className={cn(
        span === 2 && "md:col-span-2",
        className
      )}
    >
      {children}
    </div>
  )
}
