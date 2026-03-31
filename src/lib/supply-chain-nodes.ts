// Client-safe supply chain node types, compounding delay logic, and mock data generator.
// No Node.js imports — safe to use in both server and client components.

import type { ScorNode, CyberRiskParams } from "./scm-engine"
import { CYBER_RISK_PRESETS } from "./scm-engine"

export type { ScorNode }

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type DisruptionType =
  | "port-congestion"
  | "cyber-event"
  | "weather"
  | "labor-action"
  | "geopolitical"
  | "customs-delay"

export interface Disruption {
  type: DisruptionType
  severity: number
  daysAdded: number
  description: string
  active: boolean
}

export interface SupplyChainNode {
  id: string
  name: string
  tier: 1 | 2 | 3
  scorNode: ScorNode
  location: {
    city: string
    country: string
    lat: number
    lng: number
  }
  baseLeadTimeDays: number
  effectiveLeadTimeDays: number
  vulnerabilityScore: number
  cyberRisk: CyberRiskParams
  disruptions: Disruption[]
  totalDisruptionDays: number
  upstreamDependencies: string[]
  metadata: Record<string, string | number>
}

export interface FetchResult {
  nodes: SupplyChainNode[]
  source: "csv" | "mock"
  fetchedAt: string
  warnings: string[]
}

// ─── COMPOUNDING DELAY LOGIC ──────────────────────────────────────────────────

export function compoundDisruptions(
  disruptions: Disruption[],
  baseLeadTimeDays: number
): { totalDays: number; compoundingApplied: boolean; explanation: string[] } {
  const active = disruptions.filter((d) => d.active)
  const explanation: string[] = []

  if (active.length === 0) {
    return { totalDays: baseLeadTimeDays, compoundingApplied: false, explanation }
  }

  const simpleSum = active.reduce((sum, d) => sum + d.daysAdded, 0)
  explanation.push(`Base: ${baseLeadTimeDays}d`)
  for (const d of active) {
    explanation.push(`+ ${d.daysAdded}d (${d.type}): ${d.description}`)
  }

  const hasCongestion = active.some((d) => d.type === "port-congestion")
  const hasCyber      = active.some((d) => d.type === "cyber-event")
  const compoundingApplied = hasCongestion && hasCyber

  let totalDisruptionDays = simpleSum
  if (compoundingApplied) {
    totalDisruptionDays = Math.round(simpleSum * 1.35)
    explanation.push(
      `⚠ Compounding: port congestion × cyber event → ×1.35 (+${totalDisruptionDays - simpleSum}d extra)`
    )
  }

  explanation.push(`= ${baseLeadTimeDays + totalDisruptionDays}d total`)

  return {
    totalDays: baseLeadTimeDays + totalDisruptionDays,
    compoundingApplied,
    explanation,
  }
}

// ─── MOCK DATA GENERATOR ──────────────────────────────────────────────────────

export function generateMockNodes(): SupplyChainNode[] {
  const kaohsiungDisruptions: Disruption[] = [
    {
      type:        "port-congestion",
      severity:    6.5,
      daysAdded:   5,
      description: "Kaohsiung port congestion — vessel queue averaging 4.8 days. Container dwell above threshold.",
      active:      true,
    },
    {
      type:        "geopolitical",
      severity:    7,
      daysAdded:   3,
      description: "Taiwan Strait tension — rerouting risk adds transit buffer. Insurance premiums elevated.",
      active:      true,
    },
    {
      type:        "cyber-event",
      severity:    6,
      daysAdded:   2,
      description: "Supplier ERP vulnerability (unpatched CVE-2025-xxxx). Digital ASN processing delayed.",
      active:      false,
    },
  ]
  const kaohsiungCyber = compoundDisruptions(kaohsiungDisruptions, 2)
  const kaohsiungNode: SupplyChainNode = {
    id:                    "taiwan-kaohsiung-t2",
    name:                  "Kaohsiung, Taiwan",
    tier:                  2,
    scorNode:              "source",
    location:              { city: "Kaohsiung", country: "Taiwan", lat: 22.63, lng: 120.27 },
    baseLeadTimeDays:      2,
    effectiveLeadTimeDays: kaohsiungCyber.totalDays,
    vulnerabilityScore:    6,
    cyberRisk:             CYBER_RISK_PRESETS.supplyChainCompromise,
    disruptions:           kaohsiungDisruptions,
    totalDisruptionDays:   kaohsiungCyber.totalDays - 2,
    upstreamDependencies:  [],
    metadata: {
      port_code: "TWKHH", annual_teu: 10_000_000, strait_risk: "elevated",
      congestion_idx: 6.5, notes: "Primary semiconductor export hub. TSMC supply chain dependency.",
    },
  }

  const transitDisruptions: Disruption[] = [
    {
      type:        "port-congestion",
      severity:    4,
      daysAdded:   2,
      description: "Port of Los Angeles vessel queue — avg 1.8 day anchor wait.",
      active:      true,
    },
    {
      type:        "customs-delay",
      severity:    3,
      daysAdded:   1,
      description: "CBP enhanced inspection — electronics flagged for country of origin review.",
      active:      false,
    },
  ]
  const transitCyber = compoundDisruptions(transitDisruptions, 16)
  const transitNode: SupplyChainNode = {
    id:                    "usa-port-la-transit",
    name:                  "Port of Los Angeles, CA",
    tier:                  2,
    scorNode:              "deliver",
    location:              { city: "Los Angeles", country: "United States", lat: 33.74, lng: -118.27 },
    baseLeadTimeDays:      16,
    effectiveLeadTimeDays: transitCyber.totalDays,
    vulnerabilityScore:    4,
    cyberRisk:             CYBER_RISK_PRESETS.itOtBoundaryBreach,
    disruptions:           transitDisruptions,
    totalDisruptionDays:   transitCyber.totalDays - 16,
    upstreamDependencies:  ["taiwan-kaohsiung-t2"],
    metadata: {
      port_code: "USLAX", crossing_days: 14, drayage_miles: 1_950,
      notes: "Rail/truck drayage to Detroit Metro post-port clearance.",
    },
  }

  const romulusDisruptions: Disruption[] = [
    {
      type:        "cyber-event",
      severity:    5,
      daysAdded:   1,
      description: "Unpatched OT endpoints — BigFix shows 23 endpoints behind patch cycle. Cylance flagged 3 anomalies.",
      active:      true,
    },
    {
      type:        "labor-action",
      severity:    2,
      daysAdded:   0,
      description: "UAW contract monitoring period — no active action, risk elevated Q4.",
      active:      false,
    },
  ]
  const romulusCyber = compoundDisruptions(romulusDisruptions, 3)
  const romulusNode: SupplyChainNode = {
    id:                    "usa-romulus-mi-t3",
    name:                  "Romulus, Michigan (GM Plant)",
    tier:                  3,
    scorNode:              "make",
    location:              { city: "Romulus", country: "United States", lat: 42.22, lng: -83.40 },
    baseLeadTimeDays:      3,
    effectiveLeadTimeDays: romulusCyber.totalDays,
    vulnerabilityScore:    5,
    cyberRisk:             CYBER_RISK_PRESETS.unpatchedOtEndpoint,
    disruptions:           romulusDisruptions,
    totalDisruptionDays:   romulusCyber.totalDays - 3,
    upstreamDependencies:  ["usa-port-la-transit"],
    metadata: {
      plant_type: "automotive_assembly", ot_endpoints: 400, network_switches: 700,
      patch_lag_days: 45, fanuc_robots: 1, downtime_cost_min: 22_000,
      notes: "OT/ICS environment. FANUC robot lines. BigFix/Cylance/Qualys stack.",
    },
  }

  return [kaohsiungNode, transitNode, romulusNode]
}

export function calcChainLeadTime(nodes: SupplyChainNode[]): {
  totalDays: number
  criticalPath: Array<{ node: string; days: number; compounding: boolean }>
} {
  const criticalPath = nodes.map((n) => ({
    node:        n.name,
    days:        n.effectiveLeadTimeDays,
    compounding: n.disruptions.filter((d) => d.active).length >= 2,
  }))
  return { totalDays: criticalPath.reduce((s, p) => s + p.days, 0), criticalPath }
}
