// Inventory Management module — core concepts from COURSE_GOALS.md
import { ModulePage } from "@/components/module-page"

export default function InventoryPage() {
  return (
    <ModulePage
      title="Inventory Management"
      status="in-progress"
      concepts={[
        {
          term: "Core Tradeoff",
          definition:
            "Hold enough stock to meet demand without tying up excess capital or space. Every unit in inventory is cash that isn't working.",
        },
        {
          term: "Carrying Cost",
          definition:
            "Cost to hold one unit for one period — storage, insurance, obsolescence, capital tied up. Typically 20–30% of unit value per year.",
        },
        {
          term: "Ordering Cost",
          definition:
            "Fixed cost per order placed — admin, receiving, setup. Independent of order size. Reducing this is why companies push for supplier consolidation.",
        },
        {
          term: "Safety Stock",
          definition:
            "Buffer inventory held against demand or lead time variability. More variability = more safety stock needed. Formula: Z × √(lead time) × σ_demand",
        },
        {
          term: "Reorder Point (ROP)",
          definition:
            "Inventory level that triggers a new order. ROP = (avg daily demand × lead time) + safety stock. Below ROP = place order, don't wait.",
        },
        {
          term: "ABC Analysis",
          definition:
            "Rank SKUs by value × velocity. A-items (~20% of SKUs, ~80% of value) get tight control. C-items get relaxed oversight. Pareto in a warehouse.",
        },
        {
          term: "Cycle Counting",
          definition:
            "Continuous partial inventory audits instead of one annual wall-to-wall count. Keeps CMDB-equivalent data current without shutting everything down.",
        },
      ]}
      formula="ROP = (avg daily demand × lead time) + safety stock"
      formulaExplanation="Why: If your supplier takes 7 days to deliver and you sell 100 units/day, you need 700 units on hand before ordering — plus buffer for demand spikes or late shipments."
      gmAnalog="Your CMDB of 400+ PCs and 700+ network switches IS an inventory management problem. BigFix doing endpoint scans = cycle counting. A missing switch that nobody noticed until a plant goes down = stockout cost."
    />
  )
}
