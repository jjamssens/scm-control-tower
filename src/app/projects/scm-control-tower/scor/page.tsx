// SCOR Model module
import { ModulePage } from "@/components/module-page"

export default function ScorPage() {
  return (
    <ModulePage
      title="SCOR Model"
      status="coming-soon"
      concepts={[
        {
          term: "What SCOR Is",
          definition:
            "Supply Chain Operations Reference — the ASCM/APICS standard framework for analyzing, benchmarking, and improving supply chains. Used in Fortune 500 sourcing decisions and MBA case studies.",
        },
        {
          term: "Plan",
          definition:
            "Align supply with demand. S&OP (Sales & Operations Planning) lives here. Forecast demand, plan production capacity, plan procurement. If Plan is wrong, every downstream process absorbs the error.",
        },
        {
          term: "Source",
          definition:
            "Procure goods and services. Supplier selection, contracts, purchase orders, receiving, quality verification. Vendor-managed inventory (VMI) is a Source optimization.",
        },
        {
          term: "Make",
          definition:
            "Transform inputs into finished goods. Manufacturing, assembly, testing. FANUC robot lines, production scheduling, quality control. Takt time and cycle time live here.",
        },
        {
          term: "Deliver",
          definition:
            "Order management, warehousing, transportation, last-mile. 3PL relationships, freight carrier selection, distribution center layout. eBay shipping decisions = Deliver.",
        },
        {
          term: "Return",
          definition:
            "Reverse logistics. Returns from customers (defects, wrong items), returns to suppliers (excess, defective components). eBay condition disputes = Return process with zero infrastructure.",
        },
      ]}
      gmAnalog="The GM plant maps directly onto SCOR: Plan = production scheduling against dealer orders. Source = procurement of parts from Tier 1/2 suppliers (Marposs, Reishauer, Buderus). Make = FANUC robot assembly lines at takt time. Deliver = finished vehicles to dealer network. Return = warranty claims and component defect returns to suppliers."
    />
  )
}
