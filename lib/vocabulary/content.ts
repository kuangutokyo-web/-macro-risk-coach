import { vocabularyById } from "./catalog";
import type { VocabularyContentOverrides, VocabularyEntry, VocabularyTerm } from "./types";

export function resolveVocabularyTerm(termId: string, entry?: VocabularyEntry): VocabularyTerm | undefined {
  const canonical = vocabularyById.get(termId);
  if (!canonical) return undefined;
  return entry?.contentOverrides ? { ...canonical, ...entry.contentOverrides } : canonical;
}

export function contentOverridesFrom(defaultTerm: VocabularyTerm, editedTerm: VocabularyTerm): VocabularyContentOverrides {
  const fields: Array<keyof VocabularyContentOverrides> = ["term", "definitionEn", "definitionZh", "definitionJa", "practicalExplanation", "exampleEn", "exampleJa", "category"];
  return Object.fromEntries(fields.filter((field) => editedTerm[field] !== defaultTerm[field]).map((field) => [field, editedTerm[field]])) as VocabularyContentOverrides;
}
