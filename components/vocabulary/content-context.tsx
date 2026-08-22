"use client";

import { createContext, useContext, useMemo } from "react";
import { vocabularyCatalog } from "@/lib/vocabulary/catalog";
import { resolveVocabularyTerm } from "@/lib/vocabulary/content";
import type { VocabularyEntry, VocabularyTerm } from "@/lib/vocabulary/types";

type VocabularyContentContextValue = { getTerm:(termId:string)=>VocabularyTerm|undefined; resolvedCatalog:VocabularyTerm[] };
const VocabularyContentContext = createContext<VocabularyContentContextValue | null>(null);

export function VocabularyContentProvider({ entries, children }: { entries:VocabularyEntry[]; children:React.ReactNode }) {
  const value = useMemo(() => {
    const entriesById = new Map(entries.map((entry) => [entry.termId, entry]));
    const resolvedCatalog = vocabularyCatalog.map((term) => resolveVocabularyTerm(term.id, entriesById.get(term.id)) ?? term);
    const resolvedById = new Map(resolvedCatalog.map((term) => [term.id, term]));
    return { getTerm:(termId:string) => resolvedById.get(termId), resolvedCatalog };
  }, [entries]);
  return <VocabularyContentContext value={value}>{children}</VocabularyContentContext>;
}

export function useVocabularyContent() {
  const value = useContext(VocabularyContentContext);
  if (!value) throw new Error("VocabularyContentProvider is missing.");
  return value;
}
