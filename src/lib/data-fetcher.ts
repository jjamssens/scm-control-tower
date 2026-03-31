// Server-side only — CSV parser + fetch orchestrator.
// Uses Node.js fs. Do NOT import this from client components.
// For types and mock data, use supply-chain-nodes.ts instead.

import { promises as fs } from "fs"
import path from "path"
import type { ScorNode, CyberRiskParams } from "./scm-engine"
import {
  compoundDisruptions,
  generateMockNodes,
  type Disruption,
  type SupplyChainNode,
  type FetchResult,
} from "./supply-chain-nodes"

// ─── CSV PARSER ───────────────────────────────────────────────────────────────

function resolveColumn(headers: string[], ...candidates: string[]): number {
  const normalized = headers.map((h) => h.toLowerCase().replace(/[\s_-]/g, ""))
  for (const c of candidates) {
    const idx = normalized.indexOf(c.toLowerCase().replace(/[\s_-]/g, ""))
    if (idx !== -1) return idx
  }
  return -1
}

function safeFloat(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseFloat(val.trim())
  return isNaN(n) ? fallback : n
}

function safeInt(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseInt(val.trim(), 10)
  return isNaN(n) ? fallback : n
}

function countryToLatLng(country: string): { lat: number; lng: number } {
  const map: Record<string, { lat: number; lng: number }> = {
    taiwan:          { lat: 23.70, lng: 120.96 },
    china:           { lat: 35.86, lng: 104.19 },
    "united states": { lat: 37.09, lng: -95.71 },
    usa:             { lat: 37.09, lng: -95.71 },
    japan:           { lat: 36.20, lng: 138.25 },
    "south korea":   { lat: 35.91, lng: 127.76 },
    germany:         { lat: 51.16, lng: 10.45 },
    mexico:          { lat: 23.63, lng: -102.55 },
    canada:          { lat: 56.13, lng: -106.35 },
  }
  return map[country.toLowerCase().trim()] ?? { lat: 0, lng: 0 }
}

function inferScorNode(row: string[], headers: string[]): ScorNode {
  const typeIdx = resolveColumn(headers, "node_type", "facility_type", "type", "category")
  const typeVal = (typeIdx >= 0 ? row[typeIdx] : "").toLowerCase()
  if (typeVal.includes("port") || typeVal.includes("source")) return "source"
  if (typeVal.includes("plant") || typeVal.includes("manufactur") || typeVal.includes("make")) return "make"
  if (typeVal.includes("distribut") || typeVal.includes("deliver") || typeVal.includes("warehouse")) return "deliver"
  if (typeVal.includes("return") || typeVal.includes("reverse")) return "return"
  return "source"
}

export async function parseSupplyChainCSV(csvPath: string): Promise<{
  nodes: SupplyChainNode[]
  warnings: string[]
}> {
  const warnings: string[] = []
  const text = await fs.readFile(csvPath, "utf-8")
  const lines = text.split(/\r?\n/).filter(Boolean)

  if (lines.length < 2) {
    warnings.push("CSV has fewer than 2 lines — falling back to mock data")
    return { nodes: [], warnings }
  }

  const headers = lines[0].split(",")
  const colCountry     = resolveColumn(headers, "country", "Country", "nation")
  const colCity        = resolveColumn(headers, "port", "city", "Port", "City", "location", "hub")
  const colRisk        = resolveColumn(headers, "risk_score", "RiskScore", "risk", "score")
  const colDisruptProb = resolveColumn(headers, "disruption_probability", "disruptionprob", "prob", "probability")
  const colLeadTime    = resolveColumn(headers, "lead_time_days", "leadtime", "lead_time", "transit_days")
  const colVuln        = resolveColumn(headers, "vulnerability_index", "vulnerability", "vuln_score", "cyber_risk")
  const colCongestion  = resolveColumn(headers, "port_congestion", "congestion", "congestion_index")

  if (colCountry === -1) warnings.push("No country column — city used as fallback")
  if (colLeadTime === -1) warnings.push("No lead_time_days column — using 14d default")

  const nodes: SupplyChainNode[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",")
    if (row.length < 2) continue

    const country       = colCountry >= 0 ? row[colCountry].trim() : "Unknown"
    const city          = colCity    >= 0 ? row[colCity].trim()    : `Node-${i}`
    const riskScore     = safeFloat(colRisk        >= 0 ? row[colRisk]        : undefined, 3)
    const disruptProb   = safeFloat(colDisruptProb >= 0 ? row[colDisruptProb] : undefined, 0.1)
    const leadTimeDays  = safeInt  (colLeadTime    >= 0 ? row[colLeadTime]    : undefined, 14)
    const vulnScore     = safeFloat(colVuln        >= 0 ? row[colVuln]        : undefined, riskScore)
    const congestionIdx = safeFloat(colCongestion  >= 0 ? row[colCongestion]  : undefined, 0)

    const scorNode = inferScorNode(row, headers)
    const coords   = countryToLatLng(country)
    const disruptions: Disruption[] = []

    if (congestionIdx > 3) {
      const congestionDays = Math.round(congestionIdx * 0.8)
      disruptions.push({
        type: "port-congestion", severity: Math.min(10, congestionIdx),
        daysAdded: congestionDays,
        description: `Port congestion index ${congestionIdx.toFixed(1)} — avg dwell +${congestionDays}d`,
        active: congestionIdx > 5,
      })
    }
    if (vulnScore > 5) {
      disruptions.push({
        type: "cyber-event", severity: vulnScore,
        daysAdded: Math.round(vulnScore * 0.5),
        description: `Cyber vulnerability score ${vulnScore.toFixed(1)} — potential system latency`,
        active: vulnScore > 7,
      })
    }

    const { totalDays } = compoundDisruptions(disruptions, leadTimeDays)
    const cyberRisk: CyberRiskParams = {
      vulnerabilityScore: vulnScore,
      attackType:         vulnScore > 7 ? "ransomware" : vulnScore > 5 ? "endpoint" : "none",
      ttsHours:           { [scorNode]: Math.max(0, 24 - vulnScore * 2) },
      ttrHours:           { [scorNode]: vulnScore * 8 },
    }

    nodes.push({
      id:                    `${country.toLowerCase().replace(/\s+/g, "-")}-${city.toLowerCase().replace(/\s+/g, "-")}-${i}`,
      name:                  `${city}, ${country}`,
      tier:                  scorNode === "make" ? 3 : 2,
      scorNode, location: { city, country, ...coords },
      baseLeadTimeDays:      leadTimeDays,
      effectiveLeadTimeDays: totalDays,
      vulnerabilityScore:    vulnScore, cyberRisk, disruptions,
      totalDisruptionDays:   totalDays - leadTimeDays,
      upstreamDependencies:  [],
      metadata: { risk_score: riskScore, disruption_probability: disruptProb, source_row: i },
    })
  }

  return { nodes, warnings }
}

// ─── MAIN ENTRY POINT ─────────────────────────────────────────────────────────

export async function fetchSupplyChainData(): Promise<FetchResult> {
  const csvPath = path.join(process.cwd(), "public", "data", "supply-chain-risk.csv")
  const warnings: string[] = []

  try {
    await fs.access(csvPath)
    const { nodes, warnings: pw } = await parseSupplyChainCSV(csvPath)
    if (nodes.length === 0) { warnings.push("CSV empty — using mock data"); throw new Error("empty") }
    return { nodes, source: "csv", fetchedAt: new Date().toISOString(), warnings: [...pw, ...warnings] }
  } catch {
    warnings.push("CSV not found — using mock data (Kaohsiung + Romulus chain)")
    return { nodes: generateMockNodes(), source: "mock", fetchedAt: new Date().toISOString(), warnings }
  }
}
