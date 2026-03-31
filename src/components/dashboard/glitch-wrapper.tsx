// Framer Motion glitch animation — wraps dashboard content, fires once when risk score crosses 80%
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface GlitchWrapperProps {
  children: React.ReactNode
  isGlitching: boolean
  onGlitchComplete?: () => void
}

const GLITCH_VARIANTS = {
  normal: { x: 0, y: 0, skewX: 0, filter: "none" },
  glitch: {
    x:     [-4,  6, -2,  3, -5,  2, 0],
    y:     [ 2, -3,  1, -2,  3, -1, 0],
    skewX: [-1,  2, -1,  1, -2,  1, 0],
    filter: [
      "hue-rotate(90deg) saturate(3) brightness(1.1)",
      "hue-rotate(270deg) saturate(2) brightness(1.4)",
      "hue-rotate(180deg) saturate(2) brightness(0.9)",
      "hue-rotate(0deg) saturate(1) brightness(1.2)",
      "hue-rotate(135deg) saturate(3) brightness(0.8)",
      "hue-rotate(45deg) saturate(2) brightness(1.1)",
      "none",
    ],
    transition: {
      duration: 0.45,
      times: [0, 0.18, 0.35, 0.5, 0.65, 0.82, 1],
      ease: "linear" as const,
    },
  },
}

export function GlitchWrapper({ children, isGlitching, onGlitchComplete }: GlitchWrapperProps) {
  const [showOverlay, setShowOverlay] = useState(false)
  const prevRef = useRef(false)

  useEffect(() => {
    if (isGlitching && !prevRef.current) {
      prevRef.current = true
      setShowOverlay(true)
      const t = setTimeout(() => {
        setShowOverlay(false)
        onGlitchComplete?.()
      }, 450)
      return () => clearTimeout(t)
    }
    if (!isGlitching) prevRef.current = false
  }, [isGlitching, onGlitchComplete])

  return (
    <div className="relative">
      {/* Red threat overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="overlay"
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.18, 0.04, 0.14, 0.02, 0.10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, times: [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1] }}
            style={{ background: "radial-gradient(ellipse at center, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.05) 70%)" }}
          />
        )}
      </AnimatePresence>

      {/* Scanline overlay during glitch */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="scanlines"
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Content with jitter */}
      <motion.div
        variants={GLITCH_VARIANTS}
        animate={isGlitching ? "glitch" : "normal"}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  )
}
