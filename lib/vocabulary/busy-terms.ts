import rawBank from "../content/busy-question-bank.json";
import type { VocabularyCategory, VocabularyTerm } from "./types";

const canonicalIds: Record<string, string> = {
  "basis point": "basis-point", "basis risk": "basis-risk", "breakeven": "inflation-breakeven",
  "breakeven inflation": "inflation-breakeven", "breakevens": "inflation-breakeven", "bull steepening": "bull-steepening",
  "bear steepening": "bear-steepening", "carry trade": "carry-trade", "credit spreads": "credit-spread",
  "current account": "current-account", "deleveraging": "deleveraging", "discount rate": "discount-rate",
  "dv01": "dv01", "funding cost": "funding-cost", "high-yield": "high-yield", "inflation expectations": "inflation-expectations",
  "investment-grade": "investment-grade", "liquidity risk": "liquidity-risk", "real yield": "real-yield",
  "real yields": "real-yield", "receive fixed": "receive-fixed", "short position": "short-position", "short jpy": "short-position",
  "skew": "skew", "supply shock": "supply-shock", "terms of trade": "terms-of-trade", "yield curve": "yield-curve",
};

function slug(term: string): string {
  return term.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function busyVocabularyId(term: string): string {
  return canonicalIds[term.toLowerCase()] ?? `busy-${slug(term)}`;
}

function categoryFor(questionCategory: string): VocabularyCategory {
  if (questionCategory.startsWith("FX")) return "FX";
  if (questionCategory.startsWith("Rates")) return "Rates";
  if (questionCategory.startsWith("Volatility")) return "Options";
  if (questionCategory.startsWith("Cross-Asset")) return "Macro";
  return "Risk Management";
}

const contexts = new Map<string, { category: VocabularyCategory; question: string }>();
for (const question of rawBank.questions) {
  for (const term of question.vocabulary) {
    if (!contexts.has(term)) contexts.set(term, { category: categoryFor(question.category), question: question.question });
  }
}

/** The supplied bank contains tags but no glossary definitions. */
export const busyVocabularyCatalog: VocabularyTerm[] = [...contexts.entries()]
  .filter(([term]) => !canonicalIds[term.toLowerCase()])
  .map(([term, context]) => ({
    id: busyVocabularyId(term),
    term,
    category: context.category,
    definitionEn: "Definition not yet added",
    definitionZh: "定义尚未添加",
    definitionJa: "定義はまだ追加されていません",
    practicalExplanation: "Practical explanation not yet added",
    exampleEn: "Example not yet added",
    exampleJa: "例文はまだ追加されていません",
  }));
