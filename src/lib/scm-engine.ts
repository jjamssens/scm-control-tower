// SCM Engine — hybrid logic for Automotive (GM/FANUC) and eBay micro-logistics modes
// Includes cyber-risk lead time injection based on CompTIA Security+ principles

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** GM automotive assembly line downtime cost per minute (industry benchmark) */
export const AUTOMOTIVE_DOWNTIME_COST_PER_MINUTE = 22_000

/** Z-scores for common service levels */
export const Z_SCORES = {
  0.90: 1.28,
  0.95: 1.65,
  0.98: 2.05,
  0.99: 2.33,
} as const

export type ServiceLevel = keyof typeof Z_SCORES

// ─── SHARED TYPES ─────────────────────────────────────────────────────────────

export type EngineMode = "automotive" | "ebay"

/** SCOR process nodes — cyber risk is mapped per node */
export type ScorNode = "plan" | "source" | "make" | "deliver" | "return"

export interface CyberRiskParams {
  /**
   * CVSS-style vulnerability score 0–10.
   * 0 = no risk, 10 = critical (active exploit, no patch).
   * Maps to CompTIA Security+ threat severity tiers:
   *   0–3: Low    (misconfiguration, weak passwords)
   *   4–6: Medium (unpatched CVE, phishing exposure)
   *   7–9: High   (ransomware risk, known exploit)
   *   10:  Critical (active incident)
   */
  vulnerabilityScore: number

  /**
   * Attack vector type — determines which SCOR nodes are impacted.
   * Based on Security+ attack classification.
   */
  attackType: "network" | "endpoint" | "supply-chain" | "ransomware" | "none"

  /**
   * Time-to-Survive (TTS) per node in hours.
   * How long can this node operate in isolation (no external comms/systems)?
   * JIT automotive nodes have near-zero TTS. eBay has hours to days.
   */
  ttsHours: Partial<Record<ScorNode, number>>

  /**
   * Time-to-Recover (TTR) per node in hours.
   * Based on IR phases: Identification → Containment → Eradication → Recovery.
   * NIST SP 800-61 aligned.
   */
  ttrHours: Partial<Record<ScorNode, number>>
}

export interface CyberRiskResult {
  /** Raw multiplier applied to base lead time: 1.0 = no impact, 2.5 = +150% latency */
  leadTimeMultiplier: number
  /** Adjusted lead time in days after cyber risk injection */
  adjustedLeadTimeDays: number
  /** Nodes at risk given attack type */
  affectedNodes: ScorNode[]
  /** Cost of extended lead time (mode-specific) */
  extendedLeadTimeCostUSD: number
  /** Qualitative risk tier */
  riskTier: "low" | "medium" | "high" | "critical"
  /** TTS/TTR summary per affected node */
  nodeRiskMap: Record<string, { ttsHours: number; ttrHours: number; survived: boolean }>
}

// ─── CYBER RISK ENGINE ────────────────────────────────────────────────────────

/**
 * Attack type → affected SCOR nodes.
 * Logic: network attacks hit Source/Deliver (external comms).
 * Endpoint attacks hit Make/Plan (internal systems).
 * Supply chain attacks hit Source (vendor compromise).
 * Ransomware hits all nodes.
 */
const ATTACK_NODE_MAP: Record<CyberRiskParams["attackType"], ScorNode[]> = {
  none:           [],
  network:        ["source", "deliver"],
  endpoint:       ["plan", "make"],
  "supply-chain": ["source", "plan"],
  ransomware:     ["plan", "source", "make", "deliver", "return"],
}

/**
 * Injects cyber risk into lead time.
 *
 * Why: A vulnerability score represents the probability × impact of a disruption
 * to supplier communication or internal processing. The multiplier scales linearly
 * with score, with attack type adding a floor based on blast radius.
 *
 * Formula: multiplier = 1 + (score/10) × attackImpactFactor
 *   where attackImpactFactor reflects node count and attack severity.
 */
export function applyCyberRisk(
  baseLeadTimeDays: number,
  params: CyberRiskParams,
  dailyDowntimeCostUSD: number
): CyberRiskResult {
  const { vulnerabilityScore, attackType, ttsHours, ttrHours } = params

  const affectedNodes = ATTACK_NODE_MAP[attackType]

  // Attack impact factor: ransomware hits hardest, network/endpoint are partial
  const attackImpactFactors: Record<CyberRiskParams["attackType"], number> = {
    none:           0,
    network:        0.6,
    endpoint:       0.5,
    "supply-chain": 0.8,
    ransomware:     1.2,
  }

  const score = Math.min(10, Math.max(0, vulnerabilityScore))
  const multiplier = 1 + (score / 10) * attackImpactFactors[attackType]
  const adjustedLeadTimeDays = baseLeadTimeDays * multiplier
  const extraDays = adjustedLeadTimeDays - baseLeadTimeDays
  const extendedLeadTimeCostUSD = extraDays * dailyDowntimeCostUSD

  const riskTier: CyberRiskResult["riskTier"] =
    score <= 3 ? "low" :
    score <= 6 ? "medium" :
    score <= 9 ? "high" : "critical"

  // TTS/TTR node map — determine if each node survives without resupply
  const nodeRiskMap: CyberRiskResult["nodeRiskMap"] = {}
  for (const node of affectedNodes) {
    const tts = ttsHours[node] ?? 0
    const ttr = ttrHours[node] ?? 0
    nodeRiskMap[node] = {
      ttsHours: tts,
      ttrHours: ttr,
      // Node survives if it can operate in isolation longer than it takes to recover
      survived: tts >= ttr,
    }
  }

  return {
    leadTimeMultiplier: multiplier,
    adjustedLeadTimeDays,
    affectedNodes,
    extendedLeadTimeCostUSD,
    riskTier,
    nodeRiskMap,
  }
}

// ─── SHARED FORMULAS ──────────────────────────────────────────────────────────

/**
 * Economic Order Quantity.
 * Finds the order size that minimizes total inventory cost.
 * EOQ = √( 2 × D × S / H )
 *
 * Why: Ordering cost per year = (D/Q)×S — falls as Q rises.
 * Holding cost per year = (Q/2)×H — rises as Q rises.
 * EOQ is the Q where both curves cross (derivative = 0).
 */
export function calcEOQ(annualDemand: number, orderCost: number, holdingCostPerUnit: number): number {
  if (holdingCostPerUnit <= 0) return 0
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCostPerUnit)
}

/**
 * Safety Stock.
 * Buffer against demand and lead time variability.
 * SS = Z × √(leadTimeDays) × demandStdDev
 *
 * Why: Lead time variance compounds demand variance. The √(LT) term
 * accounts for the fact that uncertainty accumulates over the replenishment window.
 */
export function calcSafetyStock(
  serviceLevel: ServiceLevel,
  leadTimeDays: number,
  demandStdDevPerDay: number
): number {
  const z = Z_SCORES[serviceLevel]
  return z * Math.sqrt(leadTimeDays) * demandStdDevPerDay
}

/**
 * Reorder Point.
 * Inventory level that triggers a new order.
 * ROP = (avgDailyDemand × leadTimeDays) + safetyStock
 */
export function calcROP(avgDailyDemand: number, leadTimeDays: number, safetyStock: number): number {
  return avgDailyDemand * leadTimeDays + safetyStock
}

// ─── AUTOMOTIVE MODE ──────────────────────────────────────────────────────────

export interface AutomotiveParams {
  /** FANUC component description (e.g., "Servo motor J4 axis") */
  componentName: string
  /** Annual demand in units */
  annualDemand: number
  /** Demand std dev per day — variability in how many units are consumed daily */
  demandStdDevPerDay: number
  /** Base lead time from supplier in days (before cyber risk injection) */
  baseLeadTimeDays: number
  /** Unit cost of the component in USD */
  unitCostUSD: number
  /**
   * Ordering cost per order in USD.
   * For FANUC components this includes: PO admin + receiving labor +
   * robot lockout/tagout procedure (LOTO time × tech hourly rate) +
   * safety inspection before reinstall.
   */
  orderCostUSD: number
  /** Annual holding rate as decimal (typically 0.20–0.30 for industrial parts) */
  holdingRate: number
  /** Target service level */
  serviceLevel: ServiceLevel
  /** Optional cyber risk injection */
  cyberRisk?: CyberRiskParams
}

export interface AutomotiveResult {
  eoq: number
  safetyStock: number
  rop: number
  annualOrderingCost: number
  annualHoldingCost: number
  totalAnnualInventoryCost: number
  /** Estimated downtime cost if a stockout occurs (1 shift = 480 min) */
  stockoutCostPerEvent: number
  cyberRisk?: CyberRiskResult
  /** Lead time used in calculations (base or cyber-adjusted) */
  effectiveLeadTimeDays: number
}

export function runAutomotiveEngine(
  params: AutomotiveParams
): AutomotiveResult {
  const holdingCostPerUnit = params.unitCostUSD * params.holdingRate

  let effectiveLeadTimeDays = params.baseLeadTimeDays
  let cyberResult: CyberRiskResult | undefined

  if (params.cyberRisk) {
    // Daily downtime cost: $22k/min × 1,440 min/day
    const dailyDowntimeCost = AUTOMOTIVE_DOWNTIME_COST_PER_MINUTE * 1_440
    cyberResult = applyCyberRisk(params.baseLeadTimeDays, params.cyberRisk, dailyDowntimeCost)
    effectiveLeadTimeDays = cyberResult.adjustedLeadTimeDays
  }

  const eoq = calcEOQ(params.annualDemand, params.orderCostUSD, holdingCostPerUnit)
  const safetyStock = calcSafetyStock(params.serviceLevel, effectiveLeadTimeDays, params.demandStdDevPerDay)
  const rop = calcROP(params.annualDemand / 365, effectiveLeadTimeDays, safetyStock)

  const annualOrderingCost = (params.annualDemand / eoq) * params.orderCostUSD
  const annualHoldingCost = (eoq / 2 + safetyStock) * holdingCostPerUnit
  const totalAnnualInventoryCost = annualOrderingCost + annualHoldingCost

  // One stockout event = production line down for one shift (480 min)
  const stockoutCostPerEvent = AUTOMOTIVE_DOWNTIME_COST_PER_MINUTE * 480

  return {
    eoq,
    safetyStock,
    rop,
    annualOrderingCost,
    annualHoldingCost,
    totalAnnualInventoryCost,
    stockoutCostPerEvent,
    cyberRisk: cyberResult,
    effectiveLeadTimeDays,
  }
}

// ─── EBAY MODE ────────────────────────────────────────────────────────────────

export type Carrier = "usps-ground" | "usps-priority" | "ups-ground" | "fedex-ground"

/** Carrier lead times and base rates (USD) — continental US estimates */
const CARRIER_MATRIX: Record<Carrier, { leadTimeDays: number; baseCostUSD: number; dimWeightDivisor: number }> = {
  "usps-ground":    { leadTimeDays: 5, baseCostUSD: 5.50,  dimWeightDivisor: 194 },
  "usps-priority":  { leadTimeDays: 2, baseCostUSD: 9.35,  dimWeightDivisor: 194 },
  "ups-ground":     { leadTimeDays: 4, baseCostUSD: 8.20,  dimWeightDivisor: 139 },
  "fedex-ground":   { leadTimeDays: 4, baseCostUSD: 7.85,  dimWeightDivisor: 139 },
}

export interface EbayParams {
  /** Purchase cost per unit (what you paid) */
  unitCostUSD: number
  /** Sale price (gross, before fees) */
  salePriceUSD: number
  /** eBay final value fee rate (typically 0.1325 for most categories) */
  ebayFeeRate: number
  /** Days item sits in inventory before selling */
  daysHeld: number
  /** Annual holding rate for home inventory (typically 0.15–0.20) */
  holdingRate: number
  /** Packaging material cost per shipment (box + bubble wrap + tape) */
  packagingCostUSD: number
  /** Units shipped per day (for burn rate calculation) */
  unitsPerDay: number
  /** Carrier selection */
  carrier: Carrier
  /** Package weight in lbs (actual) */
  weightLbs: number
  /** Package dimensions in inches */
  dimensions: { length: number; width: number; height: number }
  /** Optional cyber risk (e.g., eBay account compromise, payment processor outage) */
  cyberRisk?: CyberRiskParams
}

export interface EbayResult {
  /** Per-unit carrying cost for the days held */
  carryingCostUSD: number
  /** Packaging cost per shipment */
  packagingCostUSD: number
  /** Actual shipping cost (dim weight vs actual, whichever is greater) */
  shippingCostUSD: number
  /** Effective lead time to buyer (carrier + any cyber delay) */
  effectiveLeadTimeDays: number
  /** eBay platform fee */
  ebayFeeUSD: number
  /** Net profit after all deductions */
  netProfitUSD: number
  /** Net margin as percentage */
  netMarginPct: number
  /** Daily packaging material burn rate */
  dailyPackagingBurnUSD: number
  cyberRisk?: CyberRiskResult
  breakdown: {
    salePrice: number
    minusEbayFee: number
    minusUnitCost: number
    minusShipping: number
    minusPackaging: number
    minusCarrying: number
    net: number
  }
}

export function runEbayEngine(params: EbayParams): EbayResult {
  // Dimensional weight — carriers bill whichever is greater: actual vs dim weight
  const { length, width, height } = params.dimensions
  const { dimWeightDivisor, baseCostUSD, leadTimeDays } = CARRIER_MATRIX[params.carrier]
  const dimWeightLbs = (length * width * height) / dimWeightDivisor
  const billableWeight = Math.max(params.weightLbs, dimWeightLbs)
  const shippingCostUSD = baseCostUSD + Math.max(0, billableWeight - 1) * 0.30

  // Carrying cost: how much does it cost to hold this unit while it waits to sell?
  const dailyHoldingCostUSD = (params.unitCostUSD * params.holdingRate) / 365
  const carryingCostUSD = dailyHoldingCostUSD * params.daysHeld

  const ebayFeeUSD = params.salePriceUSD * params.ebayFeeRate

  let effectiveLeadTimeDays = leadTimeDays
  let cyberResult: CyberRiskResult | undefined

  if (params.cyberRisk) {
    // eBay cyber risk daily cost: lost revenue per day of platform disruption
    const dailyRevenue = params.salePriceUSD * params.unitsPerDay
    cyberResult = applyCyberRisk(leadTimeDays, params.cyberRisk, dailyRevenue)
    effectiveLeadTimeDays = cyberResult.adjustedLeadTimeDays
  }

  const netProfitUSD =
    params.salePriceUSD
    - ebayFeeUSD
    - params.unitCostUSD
    - shippingCostUSD
    - params.packagingCostUSD
    - carryingCostUSD

  const netMarginPct = (netProfitUSD / params.salePriceUSD) * 100
  const dailyPackagingBurnUSD = params.packagingCostUSD * params.unitsPerDay

  return {
    carryingCostUSD,
    packagingCostUSD: params.packagingCostUSD,
    shippingCostUSD,
    effectiveLeadTimeDays,
    ebayFeeUSD,
    netProfitUSD,
    netMarginPct,
    dailyPackagingBurnUSD,
    cyberRisk: cyberResult,
    breakdown: {
      salePrice: params.salePriceUSD,
      minusEbayFee: params.salePriceUSD - ebayFeeUSD,
      minusUnitCost: params.salePriceUSD - ebayFeeUSD - params.unitCostUSD,
      minusShipping: params.salePriceUSD - ebayFeeUSD - params.unitCostUSD - shippingCostUSD,
      minusPackaging: params.salePriceUSD - ebayFeeUSD - params.unitCostUSD - shippingCostUSD - params.packagingCostUSD,
      minusCarrying: netProfitUSD,
      net: netProfitUSD,
    },
  }
}

// ─── DEFAULT CYBER RISK PRESETS ───────────────────────────────────────────────

/**
 * Preset cyber risk configs for common scenarios.
 * Based on CompTIA Security+ threat landscape.
 */
export const CYBER_RISK_PRESETS: Record<string, CyberRiskParams> = {
  /** Clean environment — no known vulnerabilities */
  none: {
    vulnerabilityScore: 0,
    attackType: "none",
    ttsHours: {},
    ttrHours: {},
  },

  /**
   * Unpatched Windows endpoint in OT network (common in GM plant environments).
   * BigFix shows missing patches; Cylance flagged but not remediated.
   * Security+ Domain: Threats, Attacks & Vulnerabilities
   */
  unpatchedOtEndpoint: {
    vulnerabilityScore: 5,
    attackType: "endpoint",
    ttsHours: { plan: 2, make: 4 },
    ttrHours: { plan: 8, make: 12 },
  },

  /**
   * Ransomware incident on supplier's ERP system.
   * Supplier cannot process POs or send ASNs.
   * Security+ Domain: Incident Response
   * TTR includes: identification (2h) + containment (4h) + eradication (24h) + recovery (48h)
   */
  supplierRansomware: {
    vulnerabilityScore: 9,
    attackType: "ransomware",
    ttsHours: { plan: 1, source: 0, make: 8, deliver: 4, return: 24 },
    ttrHours: { plan: 78, source: 78, make: 78, deliver: 78, return: 78 },
  },

  /**
   * SolarWinds-style supply chain compromise.
   * Malicious update propagated through vendor software.
   * Security+ Domain: Supply Chain Risk Management
   */
  supplyChainCompromise: {
    vulnerabilityScore: 8,
    attackType: "supply-chain",
    ttsHours: { source: 2, plan: 4 },
    ttrHours: { source: 48, plan: 24 },
  },

  /**
   * Network segmentation failure — IT/OT boundary breach.
   * Common in legacy plant environments without proper DMZ.
   * Security+ Domain: Architecture & Design
   */
  itOtBoundaryBreach: {
    vulnerabilityScore: 7,
    attackType: "network",
    ttsHours: { source: 6, deliver: 8 },
    ttrHours: { source: 16, deliver: 12 },
  },
}
