import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  language: z.enum(["en", "ja"]),
  scenario: z.string().min(20).max(5000),
  answers: z.object({ marketMove: z.string().min(10), exposure: z.string().min(10), pnl: z.string().min(10), risk: z.string().min(10), action: z.string().min(10) }),
});

const evaluationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
    improvements: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
    stepFeedback: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, properties: { step: { type: "string" }, score: { type: "integer", minimum: 0, maximum: 20 }, feedback: { type: "string" } }, required: ["step", "score", "feedback"] } },
  },
  required: ["overallScore", "summary", "strengths", "improvements", "stepFeedback"],
} as const;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OpenAI evaluation is not configured yet." }, { status: 503 });
  try {
    const payload = requestSchema.parse(await request.json());
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: process.env.OPENAI_EVALUATION_MODEL || "gpt-5.6-luna",
      store: false,
      instructions: `You are a demanding but constructive senior macro risk manager. Evaluate the user's five-step analysis for causal clarity, portfolio mapping, P&L direction, material risk identification, and executable action. Do not give investment advice. Respond in ${payload.language === "ja" ? "Japanese" : "English"}. Scores for the five steps must sum to overallScore.`,
      input: `SCENARIO\n${payload.scenario}\n\nUSER ANALYSIS\n${JSON.stringify(payload.answers, null, 2)}`,
      text: { format: { type: "json_schema", name: "risk_evaluation", strict: true, schema: evaluationSchema } },
      max_output_tokens: 1600,
    });
    return NextResponse.json(JSON.parse(response.output_text));
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Please complete all five analysis steps." }, { status: 400 });
    console.error("Evaluation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "The evaluation service could not complete this request." }, { status: 502 });
  }
}
