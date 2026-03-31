// Feynman Active Recall content library — textbook definitions + GM/eBay real-world analogs
// Sourced from COURSE_GOALS.md (ASCM baseline) and EXPERIENCE.md (professional background)

export type FeynmanCategory =
  | "inventory"
  | "logistics"
  | "risk"
  | "forecasting"
  | "lean"
  | "scor"
  | "cost"
  | "analytics"

export interface FeynmanEntry {
  id: string
  term: string
  category: FeynmanCategory
  textbookDef: string
  formula?: string
  formulaBreakdown?: string
  realWorldApp: {
    context: "gm" | "ebay" | "both"
    description: string
  }
  examTips: string[]
  relatedTerms: string[]
}

export const FEYNMAN_CONTENT: Record<string, FeynmanEntry> = {

  "inventory-turnover": {
    id: "inventory-turnover",
    term: "Inventory Turnover",
    category: "inventory",
    textbookDef:
      "A financial ratio measuring how many times a company sells and replaces its inventory in a given period. Calculated as Cost of Goods Sold divided by Average Inventory value. Higher turnover indicates lean, efficient operations; lower turnover signals overstocking or slow-moving goods.",
    formula: "Inventory Turnover = COGS ÷ Average Inventory",
    formulaBreakdown:
      "COGS = all production/purchase costs for goods sold. Average Inventory = (Beginning + Ending Inventory) ÷ 2. Result is expressed as a multiple (×), not a percentage.",
    realWorldApp: {
      context: "both",
      description:
        "At GM Romulus, automotive assembly targets 10–12× annually — each SKU must cycle off the shelf roughly once per month. Slowdown (e.g., chip shortage 2020–23) crashes turnover because production halts while parts sit in warehouses. On eBay, sell-through rate is the retail equivalent: if a listing sells within 30 days, that's ~12× annual turnover. Dead listings drag the metric just like obsolete MRO stock.",
    },
    examTips: [
      "UMPI exams often ask you to calculate turnover and interpret whether it's improving or degrading — always compute the delta, not just the point-in-time number.",
      "A very high turnover can be a warning sign too: it may mean stockouts are imminent (zero safety stock).",
      "Know the difference between inventory turnover (COGS/AvgInv) and days-sales-of-inventory (365/turnover).",
      "Industry benchmarks matter: automotive targets 10–15×; retail food 50–100×; industrial MRO 2–4×.",
    ],
    relatedTerms: ["safety-stock", "carrying-cost", "eoq", "abc-analysis"],
  },

  "lead-time": {
    id: "lead-time",
    term: "Lead Time",
    category: "logistics",
    textbookDef:
      "The total elapsed time from initiating a process (placing an order, starting production) to completing it (receiving goods, shipping finished product). Encompasses processing time, wait time, move time, and inspection time. Shorter lead times reduce safety stock requirements and improve responsiveness.",
    realWorldApp: {
      context: "gm",
      description:
        "The Kaohsiung → Port of LA → Romulus chain has a 21-day base lead time: ~2 days at origin port, ~14 days ocean transit, ~1 day LA drayage, ~4 days Romulus receiving. Every active disruption (Taiwan Strait tension, port congestion, OT cyber event) adds to the effective lead time. The safety stock formula uses lead time as a direct multiplier — doubling LT roughly doubles required buffer stock.",
    },
    examTips: [
      "Lead time has multiple components: supplier processing, transit time, receiving/inspection. Exams test whether you know which component is the bottleneck.",
      "Lead time variability (standard deviation of LT) affects safety stock more than average LT alone — the formula uses √LT.",
      "Supply lead time ≠ manufacturing lead time ≠ customer lead time. Know which one is being discussed.",
      "JIT systems are designed to compress lead time, but this makes them brittle to disruption.",
    ],
    relatedTerms: ["safety-stock", "reorder-point", "jit", "chain-lead-time"],
  },

  "chain-lead-time": {
    id: "chain-lead-time",
    term: "Supply Chain Lead Time",
    category: "logistics",
    textbookDef:
      "The cumulative lead time across all tiers of a supply chain, from raw material sourcing to final customer delivery. Equals the sum of individual node lead times on the critical path. Long chain lead times force companies to forecast further into the future, increasing forecast error and required safety stock at every tier.",
    realWorldApp: {
      context: "gm",
      description:
        "Kaohsiung (2d) → Port of LA transit (16d) → Romulus assembly (3d) = 21d base chain lead time. With active disruptions (Taiwan Strait + port congestion + OT cyber event), effective chain lead time can exceed 30 days — a 43% increase. Every extra day of chain LT adds direct carrying cost and requires proportionally more safety stock at Romulus to maintain service levels.",
    },
    examTips: [
      "The critical path is the longest path — not all nodes are on the critical path. Compressing non-critical path nodes does nothing.",
      "Chain lead time × average demand = minimum pipeline inventory you must carry at all times.",
      "SCOR model uses supply chain cycle time as a performance metric under 'Plan' and 'Source' process categories.",
    ],
    relatedTerms: ["lead-time", "safety-stock", "scor-model", "bullwhip-effect"],
  },

  "safety-stock": {
    id: "safety-stock",
    term: "Safety Stock",
    category: "inventory",
    textbookDef:
      "Extra inventory held beyond expected demand to protect against variability in demand and supply lead time. A buffer that prevents stockouts when actual demand exceeds forecast or when supplier lead times extend. Directly tied to desired service level: higher service levels require larger safety stock buffers.",
    formula: "SS = Z × √LT × σ_demand",
    formulaBreakdown:
      "Z = service-level z-score (1.65 = 95%, 2.33 = 99%). √LT = square root of lead time in days (amplification factor). σ_demand = standard deviation of daily demand. All three multiply — lead time variability has outsized impact.",
    realWorldApp: {
      context: "gm",
      description:
        "At Romulus, keeping spare FANUC robot components is safety stock for OT assets — not raw materials. If a robot arm fails and the replacement part has a 14-day lead time, safety stock is the on-hand spare that keeps the line running during that window. The $22k/min downtime cost is the 'stockout penalty' that justifies the carrying cost. For semiconductor components sourced from Kaohsiung, GM was forced to dramatically increase safety stock after 2020–21 shortages exposed JIT fragility.",
    },
    examTips: [
      "The Z-score multiplier is critical: 95% service level is 1.65, 98% is 2.05, 99% is 2.33. Memorize these for calculations.",
      "Safety stock increases with lead time variability, not just lead time length. A supplier with erratic delivery is more costly than one with long but consistent delivery.",
      "Safety stock is a cost — the carrying cost applies. Higher service level = higher safety stock = higher carrying cost. Know how to make that tradeoff.",
      "Don't confuse safety stock (variability buffer) with cycle stock (the inventory that cycles between orders).",
    ],
    relatedTerms: ["reorder-point", "lead-time", "carrying-cost", "eoq"],
  },

  "reorder-point": {
    id: "reorder-point",
    term: "Reorder Point (ROP)",
    category: "inventory",
    textbookDef:
      "The inventory level at which a replenishment order should be triggered, ensuring stock does not run out before the new order arrives. Set high enough to cover demand during the lead time period plus a safety buffer. When on-hand inventory falls to the ROP, a purchase order is placed.",
    formula: "ROP = (Average Daily Demand × Lead Time) + Safety Stock",
    formulaBreakdown:
      "Average Daily Demand × Lead Time = expected demand during replenishment period. Safety Stock = protection against variability. ROP is a quantity (units), not a time. It must be recalculated whenever demand patterns or lead times change significantly.",
    realWorldApp: {
      context: "gm",
      description:
        "At Romulus, if the assembly line consumes 50 FANUC servo controllers per day and the lead time from the Japanese supplier is 14 days, the ROP ignoring safety stock is 700 units (50 × 14). With demand variability (σ = 8/day) and 95% service level, safety stock adds another 49 units (1.65 × √14 × 8 ≈ 49), making ROP = 749. BigFix asset inventory effectively does continuous ROP monitoring for IT assets — when spare parts fall below threshold, procurement is triggered.",
    },
    examTips: [
      "ROP is a trigger quantity, not an order quantity. The order quantity is determined by EOQ or a different policy.",
      "ROP changes when lead time changes. A disrupted supplier with longer LT raises your ROP — you need to reorder sooner.",
      "Continuous review systems monitor inventory and reorder when hitting ROP. Periodic review systems check on a schedule and order the difference.",
      "UMPI calculations usually give you demand, lead time, and σ — practice deriving Z from service level before applying the formula.",
    ],
    relatedTerms: ["safety-stock", "eoq", "lead-time", "inventory-management"],
  },

  "eoq": {
    id: "eoq",
    term: "Economic Order Quantity (EOQ)",
    category: "inventory",
    textbookDef:
      "The mathematically optimal order quantity that minimizes total annual inventory cost — the sum of ordering costs and holding costs. Derived by setting the derivative of total cost to zero. Assumes constant demand, instantaneous replenishment, fixed ordering cost, and constant holding cost. The result is the inflection point where ordering frequency cost and holding cost are equal.",
    formula: "EOQ = √( 2DS / H )",
    formulaBreakdown:
      "D = annual demand (units/year). S = ordering cost per order (cost to place one order: labor, freight, setup). H = holding cost per unit per year (storage, capital, obsolescence, insurance — typically 20-30% of unit cost). As S increases, order more per order. As H increases, order less and more frequently.",
    realWorldApp: {
      context: "gm",
      description:
        "FANUC robot changeover between part variants maps directly to the EOQ setup cost (S). Each changeover takes 4 hours at $22k/min = ~$5.3M cost. This makes the setup cost so high that EOQ pushes toward very large batch runs — exactly what you see in automotive stamping and casting. Smaller H (lower holding cost for cheap parts) or higher S (expensive setup) both increase EOQ, pushing toward larger, less frequent orders. This is why JIT conflicts with high-setup environments: JIT wants small frequent orders, but EOQ says batch when setup is costly.",
    },
    examTips: [
      "EOQ minimizes total cost when ordering cost = holding cost. If these aren't equal after your calculation, check your math.",
      "EOQ increases with demand (D) and setup cost (S). It decreases with holding cost (H).",
      "EOQ assumptions are often violated in practice: demand varies, replenishment isn't instantaneous, holding cost changes. Understand the assumptions and their limitations.",
      "UMPI will test you on the cost tradeoff graph — know what it looks like and where the minimum is.",
      "Sensitivity: doubling D increases EOQ by √2 ≈ 1.41×, not 2×. Understand the square root dampening effect.",
    ],
    relatedTerms: ["carrying-cost", "safety-stock", "inventory-turnover", "jit"],
  },

  "carrying-cost": {
    id: "carrying-cost",
    term: "Carrying / Holding Cost",
    category: "cost",
    textbookDef:
      "The total cost of holding one unit of inventory for one period, typically expressed as a percentage of unit value per year (commonly 20–30%). Components include capital cost (opportunity cost of cash tied up), storage cost (warehouse space, utilities, handling), risk cost (obsolescence, theft, damage, insurance), and tax/insurance. A key driver in EOQ and safety stock decisions.",
    formula: "Annual Carrying Cost = (Q/2) × H",
    formulaBreakdown:
      "Q/2 = average inventory level (assumes uniform draw-down from Q to 0). H = annual holding cost per unit. Total annual ordering cost = (D/Q) × S. Total annual cost = (Q/2)H + (D/Q)S. EOQ minimizes this sum.",
    realWorldApp: {
      context: "both",
      description:
        "At GM, semiconductor components for FANUC robots have high obsolescence risk (chip generations turn over every 18-24 months) — pushing the holding cost percentage well above 30%. This made the JIT model appealing before 2020. On eBay, holding cost is very tangible: storage fees, capital tied up in unsold inventory, and depreciation risk on electronics. A GPU sitting in a box for 60 days loses 10-15% of its value as the next generation drops. Knowing your carrying cost rate tells you whether it's worth holding stock or selling at a slight discount to turn it fast.",
    },
    examTips: [
      "Carrying cost is usually given as a percentage (i) of unit cost (C), so H = iC. If a unit costs $100 and carrying cost is 25%, H = $25/unit/year.",
      "Higher carrying cost reduces EOQ — you want smaller, more frequent orders to minimize the cost of holding stock.",
      "Don't confuse carrying cost with ordering cost. Carrying cost is about holding; ordering cost is about the act of placing an order.",
    ],
    relatedTerms: ["eoq", "inventory-turnover", "safety-stock", "abc-analysis"],
  },

  "inventory-management": {
    id: "inventory-management",
    term: "Inventory Management",
    category: "inventory",
    textbookDef:
      "The systematic oversight of ordering, storing, using, and replenishing a company's inventory — raw materials, work-in-process, and finished goods. Goal: maintain the right amount of stock, in the right place, at the right time, at the lowest total cost. Key decisions: what to stock, how much to order, when to reorder, and how to classify and prioritize inventory items.",
    realWorldApp: {
      context: "both",
      description:
        "GM Romulus manages 400+ PC endpoints and 700+ network switches as a technology inventory system. The CMDB (Configuration Management Database) is functionally a warehouse management system: it tracks what's in stock, location, condition, and lifecycle state. BigFix is the cycle-counting tool — running compliance scans is equivalent to physical inventory counts. On eBay, inventory management is the entire business model: buying below market, holding briefly, selling above. Every dollar tied up in unlisted inventory is a carrying cost eating into margin.",
    },
    examTips: [
      "Know the three types of inventory: raw materials, WIP (work-in-process), and finished goods. They have different flow patterns and management needs.",
      "Inventory management tradeoff: service level vs. carrying cost. Higher service → more stock → more cost.",
      "Cycle stock cycles between orders. Safety stock is a constant buffer. Pipeline stock is in-transit. Know all three.",
      "Inventory accuracy is foundational — you can't manage what you can't count. Cycle counting vs. annual physical count.",
    ],
    relatedTerms: ["eoq", "safety-stock", "reorder-point", "abc-analysis", "carrying-cost"],
  },

  "abc-analysis": {
    id: "abc-analysis",
    term: "ABC Analysis",
    category: "analytics",
    textbookDef:
      "An inventory classification method based on the Pareto principle (80/20 rule). Items are ranked by annual consumption value (unit cost × annual usage). 'A' items (top 10–20% of SKUs) account for 70–80% of total inventory value and receive tight control, frequent reviews, and low stockout tolerance. 'B' items are middle tier. 'C' items are the long tail — many SKUs, low value, can be managed loosely with large safety stocks.",
    realWorldApp: {
      context: "both",
      description:
        "At GM, FANUC servo motors and specialized OT sensors are 'A' items — few units, very high cost, critical to production. Standard CAT5 patch cables are 'C' items — hundreds of SKUs, low cost, stockout barely matters. ABC analysis tells you where to invest management attention. On eBay, 'A' items are high-margin, fast-moving electronics (GPUs, consoles). 'C' items are low-margin commodities. Same principle: focus sourcing, pricing attention, and restocking speed on the A items.",
    },
    examTips: [
      "ABC is about annual consumption VALUE, not unit cost alone. A cheap part used constantly could be an A item.",
      "Know the classification thresholds: A = ~70-80% of value, B = ~15-25%, C = ~5-10%. SKU counts are inverted.",
      "ABC drives inventory policy decisions: A items → tight reorder controls, frequent cycle counts, lower safety stock (lean). C items → bulk purchasing, annual counts, higher safety stock (convenience).",
      "XYZ analysis adds demand variability dimension to ABC: X = stable, Y = variable, Z = erratic. AX = highest priority.",
    ],
    relatedTerms: ["inventory-management", "carrying-cost", "eoq", "safety-stock"],
  },

  "jit": {
    id: "jit",
    term: "Just-in-Time (JIT)",
    category: "lean",
    textbookDef:
      "A production and inventory management philosophy in which materials arrive and products are made exactly when needed — no earlier, no later. Originated at Toyota (Toyota Production System). Eliminates waste (muda) by removing buffer inventory, reducing lot sizes, and synchronizing production to actual demand. Requires highly reliable suppliers, short lead times, and quality at the source.",
    realWorldApp: {
      context: "gm",
      description:
        "GM's tugger trains replenishing line-side bins are kanban-driven JIT in action: empty bin = pull signal = parts dispatched. No WIP builds up at the station. The system works perfectly until a disruption breaks the chain — the 2020-21 semiconductor shortage revealed JIT's fatal flaw at scale. When Tier-2 chip suppliers couldn't deliver, GM had zero buffer stock to bridge the gap. Plants were idled for weeks while $50 chips were the constraint. Post-COVID, automotive has partially reverted to strategic buffering for A-item components.",
    },
    examTips: [
      "JIT is a philosophy, not just a scheduling technique. The underlying goal is waste elimination (7 wastes: overproduction, waiting, transport, over-processing, inventory, motion, defects).",
      "JIT requires: reliable suppliers, stable demand, short setup times, and high quality. If any of these fail, JIT fails.",
      "Kanban is the pull mechanism that enables JIT. Understand how kanban cards/containers signal production.",
      "JIT vs. EOQ: EOQ encourages large batches when setup is costly. JIT works to reduce setup cost so smaller batches are economical. They're not opposites — they converge as setup cost → 0.",
      "Takt time = available production time ÷ customer demand rate. The heartbeat JIT lines must match.",
    ],
    relatedTerms: ["kanban", "takt-time", "lead-time", "eoq", "bullwhip-effect"],
  },

  "kanban": {
    id: "kanban",
    term: "Kanban",
    category: "lean",
    textbookDef:
      "A visual pull-based signaling system that triggers production or material movement only when downstream consumption creates a need. Originally physical cards (kanban = 'card' in Japanese). The downstream process 'pulls' inventory; the upstream process only produces to replenish what was consumed. Limits WIP, exposes bottlenecks, and prevents overproduction.",
    realWorldApp: {
      context: "gm",
      description:
        "GM assembly line parts bins are the textbook kanban implementation: two-bin system (working bin + reserve bin). When the working bin empties, the empty bin is the signal — it's placed on the tugger train, which returns full bins and takes empty ones back to the warehouse. Production only replenishes what the line consumed. The number of kanban bins in circulation limits the WIP in the system. OT network downtime breaks kanban because the digital signals (barcode scans, WMS transactions) that track bin movement stop flowing.",
    },
    examTips: [
      "Kanban number = (average demand × lead time + safety stock) ÷ container quantity. This is tested on UMPI exams.",
      "Kanban is a pull system. Push systems (like MRP) schedule production based on forecasts. Pull systems respond to actual consumption.",
      "Electronic kanban (e-kanban) replaces physical cards with digital signals — same principle, faster response.",
      "Reducing kanban cards reduces WIP and exposes problems. If removing a card causes a stockout, that's a real bottleneck.",
    ],
    relatedTerms: ["jit", "takt-time", "lead-time", "inventory-management"],
  },

  "takt-time": {
    id: "takt-time",
    term: "Takt Time",
    category: "lean",
    textbookDef:
      "The maximum allowable time to produce one unit in order to meet customer demand — the 'heartbeat' of production. Calculated as available production time divided by customer demand rate. Takt time sets the pace for the entire production system: if a step takes longer than takt time, it's a bottleneck.",
    formula: "Takt Time = Available Production Time ÷ Customer Demand Rate",
    formulaBreakdown:
      "Available time = net production time per period (excluding breaks, changeovers). Demand = units required per period. Units are time/unit (e.g., seconds per vehicle). Lower takt time = faster pace = harder to achieve.",
    realWorldApp: {
      context: "gm",
      description:
        "GM's Romulus assembly line has a defined takt time per vehicle — the entire line must step at that rate. FANUC robots are programmed to complete their cycle within takt time; any robot that falls behind creates a stoppage. At $22k/minute, even a 30-second takt time violation is a $660 event. OT network disruptions that slow robot communication directly threaten takt time compliance. When the line falls behind takt time, GM faces the choice of overtime (expensive) or shipping fewer vehicles (revenue loss).",
    },
    examTips: [
      "Takt time decreases when customer demand increases or available time decreases — the line must go faster.",
      "Cycle time is how long a step actually takes. Takt time is how long it should take. CT > TT = bottleneck.",
      "UMPI exams will give you demand per day and shift time — calculate takt in seconds/unit.",
    ],
    relatedTerms: ["jit", "kanban", "lead-time"],
  },

  "bullwhip-effect": {
    id: "bullwhip-effect",
    term: "Bullwhip Effect",
    category: "forecasting",
    textbookDef:
      "The phenomenon where small fluctuations in consumer demand cause increasingly large oscillations in demand signals as they move upstream through the supply chain. Each tier overreacts to the noise from the tier below, building excess stock or order buffers. Named for the whip metaphor: a small wrist flick creates a large crack at the tip. Root causes: demand signal processing, order batching, price fluctuations, and shortage gaming.",
    realWorldApp: {
      context: "gm",
      description:
        "The 2020–2023 semiconductor shortage is the definitive modern example. Consumer demand shifted toward home electronics (PCs, consoles) in early COVID. Automotive OEMs cut chip orders assuming demand would drop. Chip fabs shifted capacity to consumer electronics. When auto demand rebounded, fabs had no capacity. OEMs over-ordered to secure allocation. Tier-1 suppliers double-booked. Prices spiked. Then consumer electronics demand normalized, fab capacity flooded back, and prices crashed — all caused by a relatively small initial demand signal being amplified 10× through the supply chain. GM idled multiple plants over $50 chips.",
    },
    examTips: [
      "Four root causes (Lee, Padmanabhan, Whang 1997): demand signal processing, order batching, price fluctuations, shortage gaming. UMPI will ask you to identify which cause is driving a given scenario.",
      "Countermeasures: information sharing (EDI/VMI), reducing order batching, stable pricing (EDLP), supply allocation based on historical sales not orders.",
      "Bullwhip is worse with more supply chain tiers. Vertical integration (reducing tiers) reduces it.",
      "Collaborative forecasting (CPFR) directly attacks the demand signal processing root cause.",
    ],
    relatedTerms: ["forecasting", "jit", "chain-lead-time", "scor-model"],
  },

  "forecasting": {
    id: "forecasting",
    term: "Demand Forecasting",
    category: "forecasting",
    textbookDef:
      "The process of estimating future customer demand for products or services. Drives inventory, production, staffing, and capacity planning decisions. Methods range from simple moving averages to exponential smoothing to causal regression models. All forecasts are wrong — the goal is to quantify and minimize forecast error. Key metrics: MAD (Mean Absolute Deviation), MAPE (Mean Absolute Percentage Error), Bias.",
    formula: "Exponential Smoothing: F(t+1) = α × A(t) + (1-α) × F(t)",
    formulaBreakdown:
      "α (alpha) = smoothing constant (0-1). Higher α = more weight on recent actuals (reactive). Lower α = more weight on history (stable). A(t) = actual demand this period. F(t) = forecast this period. Simple to compute; requires only last period's forecast and actual.",
    realWorldApp: {
      context: "ebay",
      description:
        "eBay sell-through rate is real-time demand sensing with zero forecasting infrastructure — price discovery happens in auctions and BIN pricing. When I notice a GPU model's average sale price dropping over 30 days, that's the demand signal telling me to clear inventory before the next GPU launch makes this generation obsolete. Exponential smoothing with a high α (say 0.8) would put heavy weight on recent sales — appropriate for fast-moving tech. For stable commodities (cables, adapters), lower α captures the trend without overreacting to weekly noise.",
    },
    examTips: [
      "MAPE = mean of |actual - forecast|/actual × 100. A MAPE of 15% means your forecast is on average 15% off. Lower is better.",
      "Bias tells you the direction of error. Positive bias = consistently over-forecasting. Negative bias = consistently under-forecasting. Unbiased ≠ accurate.",
      "Moving average smooths noise but lags trends. Exponential smoothing can track trends with trend-adjusted models (Holt's method).",
      "Choose your method based on demand pattern: stable demand → MA or ES. Trending → Holt's. Seasonal → Holt-Winters.",
    ],
    relatedTerms: ["bullwhip-effect", "mape", "inventory-management", "safety-stock"],
  },

  "mape": {
    id: "mape",
    term: "MAPE (Mean Absolute Percentage Error)",
    category: "analytics",
    textbookDef:
      "A forecast accuracy metric that expresses the average absolute error as a percentage of actual demand. Allows comparison of forecast accuracy across different scales (units, dollars, time periods). Calculated as the mean of the absolute percentage errors for each period. Lower MAPE = more accurate forecast. Limitation: undefined when actual = 0 (divide by zero).",
    formula: "MAPE = (1/n) × Σ |Actual(t) - Forecast(t)| / Actual(t) × 100",
    formulaBreakdown:
      "For each period t: calculate the absolute error |A-F|, divide by the actual A to get percentage error, average across all n periods. Result is a percentage. Example: MAPE of 12% means forecasts are off by 12% on average.",
    realWorldApp: {
      context: "ebay",
      description:
        "If I list 10 GPUs and forecast selling 3 per week but actually sell 5, the error is (5-3)/5 = 40% MAPE for that week. Across a quarter, averaging these weekly errors gives my forecasting quality. On the GM side, demand planning teams track MAPE by product line — a MAPE above 20% triggers a safety stock review because forecast errors large enough to exceed the buffer cause stockouts.",
    },
    examTips: [
      "MAPE is scale-independent — useful for comparing accuracy across product lines with different volumes.",
      "MAD (Mean Absolute Deviation) measures absolute error in units; MAPE converts to percentage. Both are used; know which one is being asked.",
      "Tracking signal = (cumulative forecast error) / MAD. Used to detect if a forecast is systematically biased. Signal beyond ±4–6 triggers model review.",
      "MAPE can't be calculated if any actual = 0. Use sMAPE (symmetric MAPE) or RMSE for zero-demand periods.",
    ],
    relatedTerms: ["forecasting", "bullwhip-effect", "safety-stock"],
  },

  "scor-model": {
    id: "scor-model",
    term: "SCOR Model",
    category: "scor",
    textbookDef:
      "Supply Chain Operations Reference model, developed and maintained by ASCM. A process reference framework that standardizes supply chain management across five process domains: Plan (demand/supply balancing), Source (procurement), Make (production), Deliver (fulfillment/logistics), Return (reverse logistics). Each domain has performance metrics, best practices, and technology requirements for benchmarking and improvement.",
    realWorldApp: {
      context: "gm",
      description:
        "GM Romulus maps almost perfectly onto SCOR: Plan = production scheduling and demand receipt from vehicle programs. Source = procurement of FANUC components, metals, electronics from Tier-1/2 suppliers (Kaohsiung, Japan). Make = the assembly line itself — robot welding, painting, final assembly. Deliver = outbound vehicle logistics to dealers (railcar, truck). Return = warranty returns, remanufactured parts. OT cybersecurity sits across all five processes — a ransomware event doesn't just hit 'Make'; it disrupts Source (EDI orders stop), Plan (ERP goes offline), and Deliver (shipping manifests can't be generated).",
    },
    examTips: [
      "SCOR has three levels: Level 1 = five process types (Plan/Source/Make/Deliver/Return). Level 2 = process categories (e.g., Make-to-Stock vs. Make-to-Order). Level 3 = process elements.",
      "SCOR metrics span five categories: Reliability, Responsiveness, Agility, Cost, Assets. Know at least one metric per category (e.g., Perfect Order Rate, Cycle Time, Value-at-Risk, Total Supply Chain Cost, Inventory Days of Supply).",
      "SCOR is a reference model, not a methodology. It describes what to measure and what best practices exist, not how to implement them.",
      "The Return process is often underemphasized — but reverse logistics is critical in automotive (warranty, remanufacturing) and retail (e-commerce returns).",
    ],
    relatedTerms: ["chain-lead-time", "inventory-management", "lead-time", "bullwhip-effect"],
  },

  "supply-chain-risk": {
    id: "supply-chain-risk",
    term: "Supply Chain Risk",
    category: "risk",
    textbookDef:
      "The probability-weighted potential for disruption to supply chain flows of materials, information, or finances, resulting in negative outcomes for the organization. Assessed using risk matrices (probability × impact). Categories: operational risk (day-to-day failures), disruption risk (discrete events like natural disasters or cyber attacks), systemic risk (global shocks affecting all suppliers simultaneously). Mitigation strategies include redundancy, geographic diversification, buffer stock, and supplier qualification programs.",
    realWorldApp: {
      context: "gm",
      description:
        "The GM OT environment embodies supply chain risk at two layers: physical (Taiwan Strait geopolitical risk, port congestion affecting semiconductor delivery) and cyber (unpatched OT endpoints, vendor remote access to FANUC robots). The $22k/minute downtime cost converts risk probability to financial exposure — a 5% probability of a 2-day ransomware event = 0.05 × 2 × 1440 × $22,000 = $3.17M expected value, justifying significant security spend. SCOR's 'Agility' metric (supply chain risk exposure) directly measures this.",
    },
    examTips: [
      "Risk = Probability × Impact. A low-probability, high-impact event (tail risk) often gets underweighted — this is the lesson of COVID.",
      "Risk mitigation strategies: avoid (exit the risk), transfer (insurance/contracts), reduce (redundancy/dual source), accept (buffer stock).",
      "Geographic concentration is a risk amplifier — single-source from one country creates systemic exposure.",
      "Cyber risk is now a supply chain risk category, not just an IT issue. OT attacks directly halt production.",
    ],
    relatedTerms: ["chain-lead-time", "safety-stock", "scor-model", "financial-exposure"],
  },

  "financial-exposure": {
    id: "financial-exposure",
    term: "Supply Chain Downtime Cost",
    category: "cost",
    textbookDef:
      "The total financial impact of a supply chain disruption, including direct costs (lost production, idle labor, equipment depreciation) and indirect costs (customer penalties, expediting costs, brand damage, recovery expenses). For manufacturing, often expressed as cost per minute of production stoppage. A key input to risk prioritization and investment justification for resilience measures.",
    formula: "Exposure = Disruption Duration × Downtime Cost Rate",
    formulaBreakdown:
      "GM automotive baseline: $22,000/minute = $1.32M/hour = $10.56M/8-hr shift. This covers direct lost production value plus idle labor. Does not include expediting, overtime recovery, or customer penalties, which can 2–3× the base rate.",
    realWorldApp: {
      context: "gm",
      description:
        "Every minute a GM assembly line is down due to a supply disruption (missing parts, OT cyber event, conveyor failure) costs approximately $22,000. A 2-hour OT ransomware event = $2.64M in direct production losses before recovery costs. This number transforms abstract risk discussions into budget conversations: a $500k OT security investment is justified if it prevents even one 23-minute outage per year. It's also why FANUC robot spare parts are held at higher safety stock despite high carrying costs — the stockout cost (line down) massively outweighs the holding cost.",
    },
    examTips: [
      "Total cost of disruption = direct losses + expediting costs + customer penalties + recovery costs + brand impact. Exams usually focus on direct costs but real-world includes all.",
      "Downtime cost justifies safety stock investment — when stockout cost is very high, higher safety stock is economically optimal.",
      "Supply chain resilience investments are evaluated against expected disruption cost (probability × impact × duration).",
    ],
    relatedTerms: ["supply-chain-risk", "safety-stock", "scor-model", "inventory-management"],
  },
}

export function getFeynmanEntry(id: string): FeynmanEntry | undefined {
  return FEYNMAN_CONTENT[id]
}

export function getRelatedEntries(id: string): FeynmanEntry[] {
  const entry = FEYNMAN_CONTENT[id]
  if (!entry) return []
  return entry.relatedTerms
    .map((termId) => FEYNMAN_CONTENT[termId])
    .filter(Boolean) as FeynmanEntry[]
}

export const CATEGORY_LABELS: Record<FeynmanCategory, string> = {
  inventory:   "Inventory",
  logistics:   "Logistics",
  risk:        "Risk",
  forecasting: "Forecasting",
  lean:        "Lean / JIT",
  scor:        "SCOR",
  cost:        "Cost",
  analytics:   "Analytics",
}

export const CATEGORY_COLORS: Record<FeynmanCategory, string> = {
  inventory:   "border-blue-500/40 text-blue-400",
  logistics:   "border-amber-500/40 text-amber-400",
  risk:        "border-rose-500/40 text-rose-400",
  forecasting: "border-purple-500/40 text-purple-400",
  lean:        "border-emerald-500/40 text-emerald-400",
  scor:        "border-cyan-500/40 text-cyan-400",
  cost:        "border-orange-500/40 text-orange-400",
  analytics:   "border-violet-500/40 text-violet-400",
}
