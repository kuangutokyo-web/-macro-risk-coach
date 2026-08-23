"use client";

import { useState } from "react";
import { Check } from "../icons";
import { useVocabularyContent } from "./content-context";

export function TermPanel({ termId, saved, onSave, onClose }: { termId:string; saved:boolean; onSave:() => void; onClose:() => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const { getTerm } = useVocabularyContent();
  const term = getTerm(termId); if (!term) return null;
  return <span className="term-panel" role="dialog" aria-label={`${term.term} definition`} onClick={(event) => event.stopPropagation()}><span className="term-panel-head"><span><small>{term.category}</small><strong>{term.term}</strong></span><button type="button" onClick={onClose} aria-label="Close definition">×</button></span><span className="term-definitions"><span><i>EN</i>{term.definitionEn}</span><span><i>中文</i>{term.definitionZh}</span><span><i>日本語</i>{term.definitionJa}</span></span><span className="plain-language">In practice — {term.practicalExplanation}</span>{term.whyItMatters && <span className="plain-language">Why it matters — {term.whyItMatters}</span>}<button type="button" className={`save-term ${saved || confirmed ? "saved" : ""}`} disabled={confirmed} onClick={() => { onSave(); setConfirmed(true); }}>{confirmed ? <><Check /> Source saved</> : saved ? "+ Add this source" : "+ Add to Vocabulary"}</button></span>;
}
