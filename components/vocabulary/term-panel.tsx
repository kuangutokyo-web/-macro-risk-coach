"use client";

import { vocabularyById } from "@/lib/vocabulary/catalog";
import { Check } from "../icons";

export function TermPanel({ termId, saved, onSave, onClose }: { termId:string; saved:boolean; onSave:() => void; onClose:() => void }) {
  const term = vocabularyById.get(termId); if (!term) return null;
  return <span className="term-panel" role="dialog" aria-label={`${term.term} definition`} onClick={(event) => event.stopPropagation()}><span className="term-panel-head"><span><small>{term.category}</small><strong>{term.term}</strong></span><button type="button" onClick={onClose} aria-label="Close definition">×</button></span><span className="term-definitions"><span><i>EN</i>{term.definitionEn}</span><span><i>中文</i>{term.definitionZh}</span><span><i>日本語</i>{term.definitionJa}</span></span><span className="plain-language">In practice — {term.practicalExplanation}</span><button type="button" className={`save-term ${saved ? "saved" : ""}`} disabled={saved} onClick={onSave}>{saved ? <><Check /> Saved to Vocabulary</> : "+ Add to Vocabulary"}</button></span>;
}
