"use client";

import { Fragment, useMemo, useState } from "react";
import { vocabularyById } from "@/lib/vocabulary/catalog";
import type { SourceContext, VocabularyReference } from "@/lib/vocabulary/types";
import { TermPanel } from "./term-panel";

type VocabularyTextProps = {
  text: string;
  references: VocabularyReference[];
  context: SourceContext;
  savedIds: Set<string>;
  onSave: (termId: string, context: SourceContext) => void;
};

type Segment = { text: string; termId?: string };

function splitTerms(text: string, references: VocabularyReference[]): Segment[] {
  const matches = references.flatMap((reference) => {
    const term = vocabularyById.get(reference.termId); const needles = reference.text ? [reference.text] : [term?.term || "", ...(term?.aliases || [])];
    return needles.filter(Boolean).flatMap((needle) => {
      const positions: { start:number; end:number; termId:string }[] = []; let from = 0;
      while (from < text.length) { const start = text.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase(), from); if (start < 0) break; positions.push({ start, end:start + needle.length, termId:reference.termId }); from = start + needle.length; }
      return positions;
    });
  }).toSorted((a, b) => a.start - b.start || b.end - a.end);
  const segments: Segment[] = []; let cursor = 0;
  for (const match of matches) { if (match.start < cursor) continue; if (match.start > cursor) segments.push({ text:text.slice(cursor, match.start) }); segments.push({ text:text.slice(match.start, match.end), termId:match.termId }); cursor = match.end; }
  if (cursor < text.length) segments.push({ text:text.slice(cursor) });
  return segments.length ? segments : [{ text }];
}

export function VocabularyText({ text, references, context, savedIds, onSave }: VocabularyTextProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const segments = useMemo(() => splitTerms(text, references), [text, references]);
  return <>{segments.map((segment, index) => { const occurrenceKey = `${segment.termId}-${index}`; return segment.termId ? <Fragment key={occurrenceKey}><button type="button" className={`vocab-term ${savedIds.has(segment.termId) ? "saved" : ""}`} onClick={(event) => { event.stopPropagation(); setActiveKey(occurrenceKey); }}>{segment.text}</button>{activeKey === occurrenceKey && <TermPanel termId={segment.termId} saved={savedIds.has(segment.termId)} onSave={() => onSave(segment.termId!, context)} onClose={() => setActiveKey(null)} />}</Fragment> : <Fragment key={index}>{segment.text}</Fragment>; })}</>;
}
