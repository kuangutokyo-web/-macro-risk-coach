"use client";

import { vocabularyCatalog } from "@/lib/vocabulary/catalog";
import type { SourceContext, VocabularyReference } from "@/lib/vocabulary/types";
import { VocabularyText } from "./term";

export function CatalogVocabularyText({ text, context, savedIds, onSave }: { text:string; context:SourceContext; savedIds:Set<string>; onSave:(termId:string,context:SourceContext)=>void }) {
  return <VocabularyText text={text} references={catalogReferences(text)} context={context} savedIds={savedIds} onSave={onSave} />;
}

export function catalogReferences(text:string):VocabularyReference[] {
  const normalized = text.toLocaleLowerCase();
  return vocabularyCatalog.flatMap((term) => {
    const match = [term.term,...(term.aliases || [])].filter((candidate) => candidate.length >= 4).toSorted((a,b) => b.length-a.length).find((candidate) => normalized.includes(candidate.toLocaleLowerCase()));
    return match ? [{termId:term.id,text:match}] : [];
  });
}
