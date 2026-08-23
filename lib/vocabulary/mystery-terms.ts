import { pnlMysteryCases } from "../pnl-mystery/cases";
import type { VocabularyCategory, VocabularyTerm } from "./types";
import { busyVocabularyId } from "./busy-terms";

function categoryFor(category:string):VocabularyCategory {
  if (category === "FX") return "FX";
  if (category === "Rates") return "Rates";
  if (category === "Options") return "Options";
  if (category === "Cross-Asset") return "Macro";
  return "Risk Management";
}

const terms = new Map<string,{term:string;category:VocabularyCategory}>();
for (const mysteryCase of pnlMysteryCases) {
  for (const term of mysteryCase.vocabulary) {
    const id = busyVocabularyId(term);
    if (!terms.has(id)) terms.set(id,{term,category:categoryFor(mysteryCase.category)});
  }
}

export const mysteryVocabularyCatalog:VocabularyTerm[] = [...terms.entries()].map(([id,{term,category}]) => ({
  id,
  term,
  category,
  definitionEn:"Definition not yet added",
  definitionZh:"定义尚未添加",
  definitionJa:"定義はまだ追加されていません",
  practicalExplanation:"Practical explanation not yet added",
  exampleEn:"Example not yet added",
  exampleJa:"例文はまだ追加されていません",
}));
