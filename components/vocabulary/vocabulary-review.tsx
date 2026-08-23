"use client";

import { useMemo, useState } from "react";
import type { ReviewResult, VocabularyEntry, VocabularyTerm } from "@/lib/vocabulary/types";
import { Arrow, Check } from "../icons";
import { useVocabularyContent } from "./content-context";

export type ReviewMode = "flashcard" | "multiple-choice" | "en-recall" | "asian-recall";

export function VocabularyReview({ entries, mode, onReview, onExit }: { entries:VocabularyEntry[]; mode:ReviewMode; onReview:(termId:string,result:ReviewResult)=>void; onExit:()=>void }) {
  const { getTerm, resolvedCatalog } = useVocabularyContent();
  const [sessionEntries] = useState(() => entries.slice(0, 10));
  const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false); const [selected, setSelected] = useState<string | null>(null); const [finished, setFinished] = useState(false);
  const entry = sessionEntries[index % sessionEntries.length]; const term = entry ? getTerm(entry.termId) : undefined;
  const choices = useMemo(() => { if (!term) return []; const same = resolvedCatalog.filter((item) => item.id !== term.id && item.category === term.category); const pool = same.length >= 3 ? same : resolvedCatalog.filter((item) => item.id !== term.id); return [term,...pool.slice(0,3)].toSorted((a,b) => stableOrder(a.id,term.id)-stableOrder(b.id,term.id)); }, [term, resolvedCatalog]);
  const advance = (result?:ReviewResult) => { if (result && term) onReview(term.id,result); if (index >= sessionEntries.length-1) setFinished(true); else { setIndex((value) => value+1); setRevealed(false); setSelected(null); } };
  if (!term || finished) return <section className="vocab-review"><button className="back" onClick={onExit}>← Vocabulary Bank</button><div className="review-finished"><Check /><h1>Review complete.</h1><p>Your next intervals now reflect what felt easy and what needs another pass.</p><button className="primary" onClick={onExit}>Return to bank <Arrow /></button></div></section>;
  return <section className="vocab-review"><header><button className="back" onClick={onExit}>← Vocabulary Bank</button><div><p className="kicker">{modeLabel(mode)} / {index+1} OF {sessionEntries.length}</p><div className="review-progress"><span style={{width:`${((index+1)/sessionEntries.length)*100}%`}} /></div></div><span className="difficulty">DIFFICULTY {entry.review.difficulty}/5</span></header>
    <div className="review-card"><p className="category">{term.category}</p>{mode === "flashcard" && <><h1>{term.term}</h1><p className="review-prompt">Explain it in your own words, then reveal.</p>{revealed && <ReviewAnswer term={term} />}</>}{mode === "multiple-choice" && <><h2>What does “{term.term}” mean?</h2><div className="meaning-choices">{choices.map((choice) => <button key={choice.id} disabled={selected !== null} className={selected ? choice.id === term.id ? "correct" : selected === choice.id ? "wrong" : "muted" : ""} onClick={() => { setSelected(choice.id); onReview(term.id,choice.id === term.id ? "correct" : "incorrect"); }}>{choice.definitionEn}</button>)}</div>{selected && <p className="answer-note">{selected === term.id ? "Correct." : `Not quite — ${term.definitionEn}`}</p>}</>}{mode === "en-recall" && <><h1>{term.term}</h1><p className="review-prompt">Recall the Chinese and Japanese meanings.</p>{revealed && <div className="recall-answer"><p><span>中文</span>{term.definitionZh}</p><p><span>日本語</span>{term.definitionJa}</p></div>}</>}{mode === "asian-recall" && <><div className="recall-question"><p><span>中文</span>{term.definitionZh}</p><p><span>日本語</span>{term.definitionJa}</p></div><p className="review-prompt">Recall the English market term.</p>{revealed && <div className="term-reveal">{term.term}<small>{term.definitionEn}</small></div>}</>}
      <footer>{mode === "multiple-choice" && selected ? <button className="primary" onClick={() => advance()}>Next term <Arrow /></button> : !revealed ? <button className="primary" onClick={() => setRevealed(true)}>Reveal answer</button> : <div className="self-grade"><button onClick={() => advance("again")}>Review again</button><button onClick={() => advance("know")}><Check /> I know this</button></div>}</footer></div>
  </section>;
}

function ReviewAnswer({ term }: { term: VocabularyTerm }) { return <div className="review-answer"><p>{term.definitionEn}</p><p>{term.practicalExplanation}</p>{term.whyItMatters && <p>{term.whyItMatters}</p>}<div><span>中文 — {term.definitionZh}</span><span>日本語 — {term.definitionJa}</span></div></div>; }
function modeLabel(mode:ReviewMode) { return ({flashcard:"FLASHCARDS","multiple-choice":"MEANING QUIZ","en-recall":"EN → CN / JP","asian-recall":"CN / JP → EN"})[mode]; }
function stableOrder(id:string,seed:string) { return [...`${id}${seed}`].reduce((sum,char) => sum+char.charCodeAt(0),0)%97; }
