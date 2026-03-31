// EOQ Calculator module — with interactive calculator coming soon
import { ModulePage } from "@/components/module-page"

export default function EoqPage() {
  return (
    <ModulePage
      title="Economic Order Quantity (EOQ)"
      status="in-progress"
      concepts={[
        {
          term: "What EOQ Solves",
          definition:
            "Ordering too often = high ordering cost. Ordering too rarely = high holding cost. EOQ is the quantity where those two curves cross — total cost is minimized.",
        },
        {
          term: "D — Annual Demand",
          definition:
            "Total units demanded per year. If you sell 100 units/day, D = 36,500. Forecast error here flows directly into a wrong EOQ.",
        },
        {
          term: "S — Ordering Cost",
          definition:
            "Fixed cost every time you place an order — purchase order admin, receiving labor, inspection, setup. For FANUC robot changeovers, this is retooling + reprogramming time.",
        },
        {
          term: "H — Holding Cost",
          definition:
            "Annual cost to hold one unit in inventory. H = unit cost × holding rate (usually 20%). A $25 part costs $5/year to hold.",
        },
        {
          term: "Key Insight: Square Root Relationship",
          definition:
            "Doubling demand does NOT double EOQ — it increases by √2 (~41%). This is why large companies don't order proportionally more just because they're bigger.",
        },
        {
          term: "Quantity Discounts Break EOQ",
          definition:
            "If a supplier offers price breaks at higher quantities, EOQ formula is no longer enough. Must compare total cost (purchase + ordering + holding) at each price tier.",
        },
      ]}
      formula="EOQ = √( 2 × D × S / H )"
      formulaExplanation="Why: Ordering cost per year = (D/Q) × S — decreases as Q grows. Holding cost per year = (Q/2) × H — increases as Q grows. Set derivative = 0, solve for Q. That's EOQ."
      gmAnalog="Every FANUC robot changeover between part variants has a fixed setup cost (retooling, reprogramming, safety lockout). That S value is why GM batches part variants into longer production runs — minimizing the number of setups per shift IS EOQ reasoning in manufacturing."
    />
  )
}
