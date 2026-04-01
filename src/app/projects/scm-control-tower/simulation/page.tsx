// Simulation module — supply chain map + ChainSim port placeholder
import { Play, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SupplyChainMap } from "@/components/supply-chain-map"

export default function SimulationPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Supply Chain Map */}
      <div>
        <h1 className="text-xl font-semibold mb-1">Supply Chain Map</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Kaohsiung → Port of LA → Romulus, MI. Toggle to eBay/USPS routing view.
        </p>
        <SupplyChainMap />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-semibold">Inventory Simulation</h1>
          <Badge variant="outline" className="font-mono text-[10px]">Coming Soon</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Interactive inventory management simulator — EOQ, ROP, safety stock, disruption scenarios.
        </p>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Play className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">ChainSim — Supply Chain Simulation Engine</h2>
              <p className="text-sm text-muted-foreground">Port from existing Vite/React app</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The existing ChainSim tool (built in Vite + React) models inventory management scenarios
            using real SCM math — EOQ, ROP, safety stock with normal distribution sampling,
            and disruption events (supplier failure, demand shock, port delay, pandemic).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "EOQ / ROP / Safety Stock calculator",
              "Normal distribution demand sampling (Box-Muller)",
              "Disruption scenarios: supplier failure, demand shock, port delay",
              "Learning mode: auto-generated insights with formula breakdowns",
              "Scenario presets: Stable, High Variability, Pandemic",
              "Bullwhip multi-tier visualization",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm">
                <ArrowRight className="size-3 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border/40 pt-4">
            <p className="text-xs text-muted-foreground">
              Existing simulation runs locally at <span className="font-mono text-primary">SCM-Tool/chainsim/</span> — will be ported here as an interactive client component once Phase 0 foundation is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
