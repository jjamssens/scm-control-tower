// POST /api/feynman/evaluate — grades a user's explanation against ASCM/UMPI standards via Claude
export const runtime = "nodejs" // Anthropic SDK requires Node.js runtime (not Edge)

import Anthropic from "@anthropic-ai/sdk"
import { getFeynmanEntry } from "@/lib/feynman-content"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a rigorous ASCM-certified Supply Chain Management exam evaluator preparing a student for UMPI (University of Maine Presque Isle) undergraduate SCM coursework.

Your job is to evaluate a student's free-recall explanation of an SCM concept against the authoritative textbook definition and return a structured grade.

Grading rubric:
- A (90-100): Captures the core definition accurately, uses correct terminology, demonstrates conceptual depth (knows WHY not just WHAT), may include formula or quantitative understanding.
- B (80-89): Mostly correct, core concept present, minor gaps in precision or completeness.
- C (70-79): Partially correct — main idea is there but missing key elements, vague on mechanics, or conflates with related concepts.
- D (60-69): Significant misconception or critical omission of the core idea. Student has surface-level awareness but would not pass a written exam question.
- F (0-59): Fundamentally incorrect, off-topic, or explanation demonstrates no real understanding of the concept.

Be strict. This is exam prep. A student who barely understands should get a C or D, not a B. Reward depth and precision.

Return ONLY valid JSON — no markdown, no prose, no code fences. Exactly this structure:
{
  "grade": "B",
  "score": 84,
  "strength": "One sentence: what the student clearly got right.",
  "correction": "One sentence: the single most important gap, error, or imprecision to fix for exam success."
}`

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set in .env.local — add it and restart the dev server." },
      { status: 500 }
    )
  }

  let body: { termId?: string; explanation?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { termId, explanation } = body

  if (!termId || typeof termId !== "string") {
    return NextResponse.json({ error: "termId is required" }, { status: 400 })
  }
  if (!explanation || typeof explanation !== "string" || explanation.trim().length < 20) {
    return NextResponse.json({ error: "explanation must be at least 20 characters" }, { status: 400 })
  }

  const entry = getFeynmanEntry(termId)
  if (!entry) {
    return NextResponse.json({ error: `Unknown term: ${termId}` }, { status: 404 })
  }

  const userPrompt = `
Term being tested: ${entry.term}

Authoritative textbook definition:
${entry.textbookDef}
${entry.formula ? `\nKey formula: ${entry.formula}\n${entry.formulaBreakdown ?? ""}` : ""}
${entry.examTips.length > 0 ? `\nCritical exam points:\n${entry.examTips.map((t, i) => `${i + 1}. ${t}`).join("\n")}` : ""}

Student's explanation (evaluate this):
"${explanation.trim()}"

Grade the student's explanation now.`.trim()

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    })

    const rawText = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("")
      .trim()

    let parsed: { grade: string; score: number; strength: string; correction: string }
    try {
      parsed = JSON.parse(rawText)
    } catch {
      // Attempt to extract JSON from any surrounding text
      const match = rawText.match(/\{[\s\S]*\}/)
      if (!match) throw new Error("Model returned non-JSON response")
      parsed = JSON.parse(match[0])
    }

    // Validate required fields
    if (!parsed.grade || typeof parsed.score !== "number" || !parsed.strength || !parsed.correction) {
      throw new Error("Incomplete grade response from model")
    }

    return NextResponse.json({
      grade:      parsed.grade,
      score:      parsed.score,
      strength:   parsed.strength,
      correction: parsed.correction,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Evaluation failed: ${message}` }, { status: 500 })
  }
}
