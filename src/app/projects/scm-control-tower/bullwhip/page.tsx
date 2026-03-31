// Bullwhip Effect module
import { ModulePage } from "@/components/module-page"

export default function BullwhipPage() {
  return (
    <ModulePage
      title="Bullwhip Effect"
      status="coming-soon"
      concepts={[
        {
          term: "What It Is",
          definition:
            "Small fluctuations in end-consumer demand get amplified as they travel upstream through the supply chain. Each tier over-reacts. The oscillation grows — like a whip.",
        },
        {
          term: "Cause 1: Demand Signal Processing",
          definition:
            "Suppliers forecast from orders placed to them, not from end-consumer POS data. They see noise, not signal. Each tier adds its own forecast error on top.",
        },
        {
          term: "Cause 2: Order Batching",
          definition:
            "Buyers consolidate orders weekly or monthly to minimize ordering cost. This creates artificial demand spikes even when actual consumption is smooth.",
        },
        {
          term: "Cause 3: Price Fluctuations",
          definition:
            "Promotional pricing causes forward buying. Buyers over-order during sales, under-order after. The discount that feels like a win distorts the whole upstream chain.",
        },
        {
          term: "Cause 4: Shortage Gaming",
          definition:
            "During scarcity, buyers over-order expecting rationing. Orders collapse when supply returns. This is exactly what happened with chips in 2021–2022.",
        },
        {
          term: "Mitigation: VMI",
          definition:
            "Vendor-Managed Inventory: the supplier sees your actual inventory levels and controls replenishment. Bypasses the distorted order signal entirely.",
        },
      ]}
      gmAnalog="The 2020–2023 chip shortage is a textbook bullwhip case across a 4-tier supply chain: consumers panic-bought electronics → OEMs over-ordered chips → Tier 1s ramped orders → TSMC/ASML ramped fab capacity → market flooded 18 months later → prices crashed. GM stopped $50K vehicles for a $3 chip."
    />
  )
}
