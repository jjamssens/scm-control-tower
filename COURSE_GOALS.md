# COURSE_GOALS.md — ASCM Academic Baseline

**Purpose:** Core Supply Chain Management principles to anchor learning until formal UMPI SCM courses begin on 7/06/2026. Treat this as a reference layer — concepts here should be reinforced by real-world GM/OT experience wherever possible.

---

## Inventory Management

**Core principle:** Hold enough stock to meet demand without tying up excess capital or space.

### Key Concepts
- **Carrying cost:** Cost to hold one unit for one period (storage, insurance, obsolescence, capital tied up). Typically 20–30% of unit value per year.
- **Ordering cost:** Fixed cost per order placed (admin, receiving, setup). Independent of order size.
- **Stockout cost:** Cost of running out — lost sales, line stoppages, expedite fees.
- **Safety stock:** Buffer inventory held against demand or lead time variability.
- **Reorder point (ROP):** `ROP = (Average daily demand × Lead time) + Safety stock`
- **ABC analysis:** Rank SKUs by value × velocity. A-items (~20% of SKUs, ~80% of value) get tight control; C-items get relaxed oversight.
- **Cycle counting:** Continuous partial inventory audits vs. annual full wall-to-wall count.

### GM Analog
Managing 400+ PC assets and 700+ network switches across 10 plant sites is applied inventory management — CMDB as warehouse management system, BigFix as cycle count tool.

---

## Economic Order Quantity (EOQ)

**Core principle:** Find the order size that minimizes total inventory cost (ordering cost + carrying cost).

### Formula
```
EOQ = √( (2 × D × S) / H )
```
- `D` = Annual demand (units/year)
- `S` = Ordering cost per order ($)
- `H` = Holding/carrying cost per unit per year ($)

### Key Insights
- EOQ is the inflection point where ordering cost curve and carrying cost curve intersect.
- Doubling demand does NOT double EOQ — it increases it by √2 (~41%).
- Assumptions: constant demand, instantaneous replenishment, known costs. Real-world = adjust with safety stock and lead time buffers.

### Variants
- **Production Order Quantity (POQ):** EOQ adjusted for production runs (items arrive over time, not all at once).
- **Quantity discounts:** EOQ model breaks when supplier offers price breaks — must compare total cost at each price tier.

---

## Just-in-Time (JIT)

**Core principle:** Receive or produce goods exactly when needed — minimize inventory by synchronizing supply with demand.

### Key Concepts
- Originated at Toyota (Toyota Production System / TPS). Pillar of Lean Manufacturing.
- **Pull system:** Production triggered by actual customer demand, not forecast. Kanban cards signal replenishment.
- **Takt time:** Available production time ÷ customer demand rate. Sets the drumbeat of the line.
- **Single-piece flow:** Move one unit at a time vs. batch processing. Exposes defects immediately.
- **Supplier partnership:** JIT requires high-trust, high-reliability suppliers. Long lead times or unreliable vendors break the system.

### Risks
- **Fragile to disruption:** COVID-19 exposed JIT's vulnerability — automotive chip shortage is the canonical case.
- **Requires stable demand:** High demand variability makes JIT inventory buffers necessary anyway.

### GM Analog
GM plants run modified JIT for sub-assemblies. Line-side parts replenishment via tugger trains = kanban in practice. OT network reliability is a dependency — a network outage stops parts tracking the same as a missed delivery.

---

## Bullwhip Effect

**Core principle:** Small fluctuations in consumer demand get amplified as they propagate upstream through the supply chain, causing increasingly wild swings in orders, inventory, and production.

### Root Causes (Lee, Padmanabhan & Whang, 1997)
1. **Demand signal processing:** Suppliers forecast from orders, not end-consumer demand. Amplifies noise.
2. **Order batching:** Buyers place periodic bulk orders rather than continuous small orders. Creates artificial spikes.
3. **Price fluctuations:** Forward buying during promotions or discounts distorts true demand signal.
4. **Shortage gaming:** During scarcity, buyers over-order to guarantee allocation. Orders collapse when supply stabilizes.

### Mitigation
- Share point-of-sale data upstream (vendor-managed inventory / VMI)
- Reduce order batching (more frequent, smaller orders)
- Stabilize pricing (EDLP vs. promotional spikes)
- Shorten lead times

### GM Analog
Chip shortage 2020–2023: demand signal distortion at every tier. Tier 1s over-ordered chips → Tier 2 fabs ramped overcapacity → market flooded → prices crashed. Classic bullwhip in a 4-tier supply chain.

---

## Demand Forecasting

- **Qualitative methods:** Expert opinion, Delphi method, market research. Used for new products with no history.
- **Quantitative methods:**
  - Moving average (simple, weighted)
  - Exponential smoothing (alpha = weight given to most recent period)
  - Regression analysis (demand as function of independent variables)
- **Forecast error metrics:** MAD (Mean Absolute Deviation), MAPE (Mean Absolute Percentage Error), Bias
- **Rule:** All forecasts are wrong. The goal is to be wrong in a manageable, measurable way.

---

## Supply Chain Strategy Frameworks

### Porter's Value Chain
Internal activities (inbound logistics → operations → outbound logistics → marketing/sales → service) supported by HR, IT, procurement.

### SCOR Model (Supply Chain Operations Reference)
Five processes: **Plan → Source → Make → Deliver → Return**
Standard framework for benchmarking and process improvement across supply chains.

### Fisher's Framework (1997)
| Supply Chain Type | Matches Demand Type |
|---|---|
| Efficient (cost-optimized) | Functional products (predictable demand) |
| Responsive (speed-optimized) | Innovative products (uncertain demand) |

Mismatch = root cause of most supply chain failures.

---

## Key Terms Reference

| Term | Definition |
|---|---|
| Lead time | Time from order placement to receipt |
| Fill rate | % of demand met from stock on hand |
| Throughput | Rate at which the system generates goal units |
| Bottleneck | Constraint that limits system throughput (Theory of Constraints) |
| VMI | Vendor-Managed Inventory — supplier owns replenishment decisions |
| 3PL / 4PL | Third/fourth party logistics provider |
| S&OP | Sales & Operations Planning — cross-functional demand/supply balancing |
| MRP | Material Requirements Planning — explosion of BOM to calculate component needs |
| ERP | Enterprise Resource Planning — integrated system connecting finance, inventory, production |

---

## Upcoming UMPI Courses (Starting 7/06/2026)

Placeholder — populate with actual course list once enrolled:
- [ ] SCM core courses
- [ ] Relevant PLAs to map against GM OT/logistics experience
