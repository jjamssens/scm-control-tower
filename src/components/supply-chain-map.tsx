// Interactive supply chain map — Automotive (global) and eBay (US) scale modes
// Nodes pulse; connecting vectors change color based on active disruption type.
"use client"

import { useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps"
import { generateMockNodes, type SupplyChainNode } from "@/lib/supply-chain-nodes"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const WORLD_TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const US_TOPO    = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

/** Electric Red — cyber risk */
const COLOR_CYBER    = "#FF003C"
/** Warning Orange — physical/port/weather delay */
const COLOR_PHYSICAL = "#FF6B2B"
/** Clean blue — no active disruption */
const COLOR_CLEAN    = "#3b82f6"
/** Muted — geography fill */
const COLOR_GEO      = "#1e2d3d"
/** Faint border */
const COLOR_GEO_BORDER = "#2d3f52"

// Automotive projection: rotate so 150°W (central Pacific) is at map center.
// This puts Taiwan left-of-center and the US right-of-center.
const AUTOMOTIVE_PROJ = {
  rotate: [150, 0, 0] as [number, number, number],
  scale: 130,
}

// eBay projection: zoom to continental US
const EBAY_PROJ = {
  center: [-95, 39] as [number, number],
  scale: 850,
}

// ─── EBAY SHIPPING HUBS ───────────────────────────────────────────────────────

interface Hub {
  id: string
  name: string
  coords: [number, number]   // [lng, lat]
  carrier: string
  days: number
}

const EBAY_ORIGIN: Hub = {
  id: "origin",
  name: "Belleville, MI",
  coords: [-83.48, 42.20],
  carrier: "Origin",
  days: 0,
}

const EBAY_HUBS: Hub[] = [
  { id: "chi", name: "Chicago, IL",    coords: [-87.63, 41.88], carrier: "USPS Ground",    days: 2 },
  { id: "nyc", name: "Newark, NJ",     coords: [-74.17, 40.73], carrier: "USPS Priority",  days: 2 },
  { id: "lax", name: "Los Angeles, CA",coords: [-118.24, 34.05],carrier: "USPS Ground",    days: 5 },
  { id: "dfw", name: "Dallas, TX",     coords: [-96.80, 32.78], carrier: "UPS Ground",     days: 4 },
  { id: "atl", name: "Atlanta, GA",    coords: [-84.39, 33.75], carrier: "USPS",           days: 3 },
  { id: "sea", name: "Seattle, WA",    coords: [-122.33, 47.61],carrier: "USPS Priority",  days: 4 },
]

// ─── UTILS ────────────────────────────────────────────────────────────────────

function getLineColor(from: SupplyChainNode, to: SupplyChainNode): string {
  const all = [...from.disruptions, ...to.disruptions]
  if (all.some((d) => d.type === "cyber-event" && d.active)) return COLOR_CYBER
  if (all.some((d) => ["port-congestion", "geopolitical", "weather"].includes(d.type) && d.active)) return COLOR_PHYSICAL
  return COLOR_CLEAN
}

function disruption_summary(node: SupplyChainNode): string {
  const active = node.disruptions.filter((d) => d.active)
  if (active.length === 0) return "No active disruptions"
  return active.map((d) => `${d.type}: +${d.daysAdded}d`).join(" · ")
}

// ─── NODE MARKER ─────────────────────────────────────────────────────────────

interface NodeMarkerProps {
  node: SupplyChainNode
  coords: [number, number]
  isHovered: boolean
  onHover: (id: string | null) => void
}

function NodeMarker({ node, coords, isHovered, onHover }: NodeMarkerProps) {
  const hasCyber    = node.disruptions.some((d) => d.type === "cyber-event" && d.active)
  const hasPhysical = node.disruptions.some((d) => ["port-congestion","geopolitical","weather"].includes(d.type) && d.active)
  const color = hasCyber ? COLOR_CYBER : hasPhysical ? COLOR_PHYSICAL : COLOR_CLEAN

  return (
    <Marker
      coordinates={coords}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Pulse ring */}
      <circle
        r={isHovered ? 14 : 10}
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth={1}
        className="supply-chain-pulse"
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />
      {/* Inner solid dot */}
      <circle
        r={5}
        fill={color}
        stroke="#0f1117"
        strokeWidth={1.5}
      />
      {/* Label */}
      <text
        textAnchor="middle"
        y={-14}
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "9px",
          fill: "#e2e8f0",
          pointerEvents: "none",
        }}
      >
        {node.location.city}
      </text>
    </Marker>
  )
}

// ─── HUB MARKER (eBay mode) ───────────────────────────────────────────────────

function HubMarker({ hub, isOrigin, isHovered, onHover }: {
  hub: Hub
  isOrigin: boolean
  isHovered: boolean
  onHover: (id: string | null) => void
}) {
  const color = isOrigin ? COLOR_CLEAN : "#8b5cf6"

  return (
    <Marker
      coordinates={hub.coords}
      onMouseEnter={() => onHover(hub.id)}
      onMouseLeave={() => onHover(null)}
    >
      {isOrigin && (
        <circle
          r={isHovered ? 16 : 12}
          fill={color}
          fillOpacity={0.15}
          stroke={color}
          strokeWidth={1}
          className="supply-chain-pulse"
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
      )}
      <circle
        r={isOrigin ? 6 : 4}
        fill={color}
        stroke="#0f1117"
        strokeWidth={1.5}
      />
      <text
        textAnchor="middle"
        y={isOrigin ? -16 : -10}
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: isOrigin ? "9px" : "8px",
          fill: isOrigin ? "#e2e8f0" : "#94a3b8",
          pointerEvents: "none",
        }}
      >
        {hub.name.split(",")[0]}
      </text>
      {!isOrigin && (
        <text
          textAnchor="middle"
          y={-2}
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "7px",
            fill: "#64748b",
            pointerEvents: "none",
          }}
        >
          {hub.days}d
        </text>
      )}
    </Marker>
  )
}

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────

function NodeTooltip({ node }: { node: SupplyChainNode }) {
  return (
    <div className="absolute top-4 right-4 bg-card border border-border/60 rounded-lg p-3 max-w-xs shadow-lg pointer-events-none z-10">
      <p className="text-xs font-mono font-bold text-foreground mb-1">{node.name}</p>
      <div className="flex gap-1 flex-wrap mb-2">
        <Badge variant="outline" className="text-[9px] font-mono">{node.scorNode.toUpperCase()}</Badge>
        <Badge variant="outline" className="text-[9px] font-mono">Tier {node.tier}</Badge>
        <Badge variant="outline" className="text-[9px] font-mono">
          Vuln {node.vulnerabilityScore.toFixed(1)}/10
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground mb-1">
        Base: {node.baseLeadTimeDays}d → Effective: {node.effectiveLeadTimeDays}d
      </p>
      <p className="text-[10px] text-muted-foreground/70">{disruption_summary(node)}</p>
    </div>
  )
}

// ─── LEGEND ───────────────────────────────────────────────────────────────────

function Legend({ scale }: { scale: "automotive" | "ebay" }) {
  return (
    <div className="absolute bottom-4 left-4 bg-card/80 border border-border/60 rounded-lg p-3 backdrop-blur-sm">
      <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
        {scale === "automotive" ? "Route Vectors" : "Carrier Routes"}
      </p>
      <div className="flex flex-col gap-1.5">
        <LegendItem color={COLOR_CYBER}    label="Cyber risk active" />
        <LegendItem color={COLOR_PHYSICAL} label="Physical delay active" />
        <LegendItem color={COLOR_CLEAN}    label="Clean / nominal" />
        {scale === "automotive" && (
          <LegendItem color="#8b5cf6" label="Compounding (×1.35)" />
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function SupplyChainMap() {
  const [scale, setScale] = useState<"automotive" | "ebay">("automotive")
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const nodes = generateMockNodes()

  // Build ordered pairs for connecting lines
  const automotiveSegments: [SupplyChainNode, SupplyChainNode][] = [
    [nodes[0], nodes[1]],  // Kaohsiung → Port of LA
    [nodes[1], nodes[2]],  // Port of LA → Romulus
  ]

  const hoveredNode = nodes.find((n) => n.id === hoveredId) ?? null
  const hoveredHub  = EBAY_HUBS.find((h) => h.id === hoveredId) ?? null

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-border/60 bg-[#0a0e17]"
      style={{ height: "480px" }}
    >
      {/* Embedded keyframe animations */}
      <style>{`
        @keyframes supply-pulse {
          0%, 100% { opacity: 0.15; r: 10; }
          50%       { opacity: 0.35; r: 15; }
        }
        .supply-chain-pulse {
          animation: supply-pulse 2.4s ease-in-out infinite;
        }
        @keyframes line-flow {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        .supply-chain-line {
          stroke-dasharray: 6 4;
          animation: line-flow 1.2s linear infinite;
        }
        .supply-chain-line-clean {
          stroke-dasharray: none;
          animation: none;
        }
      `}</style>

      {/* Scale toggle */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setScale("automotive")}
          className={cn(
            "px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors",
            scale === "automotive"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card/80 text-muted-foreground border-border/60 hover:border-primary/40 backdrop-blur-sm"
          )}
        >
          Automotive — Global
        </button>
        <button
          onClick={() => setScale("ebay")}
          className={cn(
            "px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors",
            scale === "ebay"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card/80 text-muted-foreground border-border/60 hover:border-primary/40 backdrop-blur-sm"
          )}
        >
          eBay — USPS Routing
        </button>
      </div>

      {/* Chain stats (automotive mode) */}
      {scale === "automotive" && (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
          {nodes.map((n) => {
            const hasActive = n.disruptions.some((d) => d.active)
            return (
              <div key={n.id} className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      n.disruptions.some((d) => d.type === "cyber-event" && d.active) ? COLOR_CYBER :
                      n.disruptions.some((d) => d.active) ? COLOR_PHYSICAL : COLOR_CLEAN
                  }}
                />
                {n.location.city}: {n.effectiveLeadTimeDays}d
                {hasActive && <span className="text-muted-foreground/50">(+{n.totalDisruptionDays}d)</span>}
              </div>
            )
          })}
        </div>
      )}

      {/* ─── AUTOMOTIVE MAP ─────────────────────────────────────────────── */}
      {scale === "automotive" && (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={AUTOMOTIVE_PROJ}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={WORLD_TOPO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={COLOR_GEO}
                  stroke={COLOR_GEO_BORDER}
                  strokeWidth={0.4}
                  style={{ default: { outline: "none" } }}
                />
              ))
            }
          </Geographies>

          {/* Connecting lines */}
          {automotiveSegments.map(([from, to], i) => {
            const color       = getLineColor(from, to)
            const hasCyber    = [from, to].flatMap((n) => n.disruptions).some((d) => d.type === "cyber-event" && d.active)
            const hasPhysical = [from, to].flatMap((n) => n.disruptions).some((d) => ["port-congestion","geopolitical","weather"].includes(d.type) && d.active)
            const animated    = hasCyber || hasPhysical

            return (
              <Line
                key={i}
                from={[from.location.lng, from.location.lat]}
                to={[to.location.lng, to.location.lat]}
                stroke={color}
                strokeWidth={animated ? 2 : 1.5}
                strokeOpacity={0.85}
                fill="none"
                className={animated ? "supply-chain-line" : "supply-chain-line-clean"}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <NodeMarker
              key={node.id}
              node={node}
              coords={[node.location.lng, node.location.lat]}
              isHovered={hoveredId === node.id}
              onHover={setHoveredId}
            />
          ))}
        </ComposableMap>
      )}

      {/* ─── EBAY MAP ───────────────────────────────────────────────────── */}
      {scale === "ebay" && (
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={EBAY_PROJ}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={US_TOPO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={COLOR_GEO}
                  stroke={COLOR_GEO_BORDER}
                  strokeWidth={0.5}
                  style={{ default: { outline: "none" } }}
                />
              ))
            }
          </Geographies>

          {/* Routes from Belleville to each hub */}
          {EBAY_HUBS.map((hub) => {
            const isPriority = hub.carrier.includes("Priority")
            return (
              <Line
                key={hub.id}
                from={EBAY_ORIGIN.coords}
                to={hub.coords}
                stroke={isPriority ? "#8b5cf6" : "#3b82f6"}
                strokeWidth={isPriority ? 2 : 1.5}
                strokeOpacity={0.6}
                fill="none"
              />
            )
          })}

          {/* Hub markers */}
          {EBAY_HUBS.map((hub) => (
            <HubMarker
              key={hub.id}
              hub={hub}
              isOrigin={false}
              isHovered={hoveredId === hub.id}
              onHover={setHoveredId}
            />
          ))}

          {/* Origin marker */}
          <HubMarker
            hub={EBAY_ORIGIN}
            isOrigin
            isHovered={hoveredId === EBAY_ORIGIN.id}
            onHover={setHoveredId}
          />
        </ComposableMap>
      )}

      {/* Tooltip */}
      {scale === "automotive" && hoveredNode && <NodeTooltip node={hoveredNode} />}

      {/* eBay hub tooltip */}
      {scale === "ebay" && hoveredHub && (
        <div className="absolute top-4 right-4 bg-card border border-border/60 rounded-lg p-3 pointer-events-none z-10">
          <p className="text-xs font-mono font-bold text-foreground mb-1">{hoveredHub.name}</p>
          <p className="text-[10px] text-muted-foreground">{hoveredHub.carrier}</p>
          <p className="text-[10px] text-muted-foreground">{hoveredHub.days}d transit</p>
        </div>
      )}

      <Legend scale={scale} />
    </div>
  )
}
