"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { vocabularyById, vocabularyCatalog } from "@/lib/vocabulary/catalog";
import { isUnmastered, prioritizedEntries } from "@/lib/vocabulary/scheduler";
import { vocabularyCategories, type ReviewResult, type VocabularyCategory, type VocabularyEntry } from "@/lib/vocabulary/types";
import { Arrow, Clock } from "../icons";
import { VocabularyReview, type ReviewMode } from "./vocabulary-review";

type Props = { entries:VocabularyEntry[]; onRemove:(termId:string)=>void; onReview:(termId:string,result:ReviewResult)=>void; onBack:()=>void };
type Filter = "All" | VocabularyCategory | "Difficult / Unmastered";

export function VocabularyBank({ entries, onRemove, onReview, onBack }: Props) {
  const [search, setSearch] = useState(""); const deferredSearch = useDeferredValue(search); const [filter, setFilter] = useState<Filter>("All"); const [reviewMode, setReviewMode] = useState<ReviewMode | null>(null); const [expanded, setExpanded] = useState<string | null>(null);
  const queue = useMemo(() => prioritizedEntries(entries), [entries]);
  const filtered = useMemo(() => {
    const query = deferredSearch.trim().toLocaleLowerCase();
    return entries.filter((entry) => { const term = vocabularyById.get(entry.termId); if (!term) return false; const matchesFilter = filter === "All" || filter === "Difficult / Unmastered" ? filter === "All" || isUnmastered(entry) : term.category === filter; const haystack = `${term.term} ${term.definitionEn} ${term.definitionZh} ${term.definitionJa}`.toLocaleLowerCase(); return matchesFilter && (!query || haystack.includes(query)); }).toSorted((a,b) => vocabularyById.get(a.termId)!.term.localeCompare(vocabularyById.get(b.termId)!.term));
  }, [entries, deferredSearch, filter]);

  if (reviewMode) return <VocabularyReview entries={queue} mode={reviewMode} onReview={onReview} onExit={() => setReviewMode(null)} />;
  return <section className="vocabulary-page"><header className="vocabulary-hero"><button className="back" onClick={onBack}>← Dashboard</button><div><p className="kicker">PERSONAL LEARNING LAYER</p><h1>Vocabulary Bank</h1><p>Keep the language that helps you see risk faster.</p></div><div className="vocab-stat"><strong>{entries.length}</strong><span>SAVED TERMS</span></div></header>
    <div className="review-launch"><div><p className="category">SMART REVIEW</p><h2>{entries.length ? `${queue.filter((entry) => new Date(entry.review.nextReviewAt) <= new Date()).length || Math.min(5, entries.length)} terms ready to strengthen.` : "Your first review starts with one saved term."}</h2><p>Difficult and previously missed terms appear first.</p></div><div className="review-mode-buttons">{(["flashcard","multiple-choice","en-recall","asian-recall"] as ReviewMode[]).map((mode) => <button key={mode} disabled={!entries.length} onClick={() => setReviewMode(mode)}>{reviewModeLabel(mode)} <Arrow /></button>)}</div></div>
    <div className="vocab-tools"><label><span>SEARCH</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Term or definition…" /></label><div className="filter-row" aria-label="Vocabulary filters">{(["All",...vocabularyCategories,"Difficult / Unmastered"] as Filter[]).map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    {filtered.length ? <div className="vocab-list">{filtered.map((entry) => { const term = vocabularyById.get(entry.termId)!; const isOpen = expanded === entry.termId; return <article className={`vocab-entry ${isOpen ? "open" : ""}`} key={entry.termId}><button className="vocab-entry-summary" onClick={() => setExpanded(isOpen ? null : entry.termId)}><span className="term-category">{term.category}</span><span><strong>{term.term}</strong><small>{term.definitionEn}</small></span><span className={`status status-${entry.review.status}`}>{entry.review.status}</span><span className="entry-toggle">{isOpen ? "−" : "+"}</span></button>{isOpen && <div className="vocab-entry-detail"><div className="definition-grid"><p><span>ENGLISH</span>{term.definitionEn}</p><p><span>中文</span>{term.definitionZh}</p><p><span>日本語</span>{term.definitionJa}</p></div><p className="practical"><b>IN PRACTICE</b>{term.practicalExplanation}</p><div className="example-grid"><p><span>EXAMPLE / EN</span>{term.exampleEn}</p><p><span>例文 / 日本語</span>{term.exampleJa}</p></div><div className="entry-history"><p><Clock /> Added {formatDate(entry.dateAdded)} · Reviewed {entry.review.reviewCount}× · {entry.review.correctCount} correct / {entry.review.incorrectCount} incorrect · Difficulty {entry.review.difficulty}/5</p><p>Found in: {entry.sourceContexts.map((context) => context.label).join(", ")}</p><button onClick={() => onRemove(entry.termId)}>Remove</button></div></div>}</article>; })}</div> : <div className="vocab-empty"><span>V</span><h2>{entries.length ? "No terms match this view." : "Your bank is ready."}</h2><p>{entries.length ? "Try a broader search or another category." : `Click an underlined term in Busy, Normal, or Deep mode, then choose “Add to Vocabulary.” ${vocabularyCatalog.length} starter concepts are available across the current exercises.`}</p></div>}
  </section>;
}

function reviewModeLabel(mode: ReviewMode) { return ({ flashcard:"Flashcards", "multiple-choice":"Meaning quiz", "en-recall":"EN → CN / JP", "asian-recall":"CN / JP → EN" })[mode]; }
function formatDate(value:string) { return new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric"}).format(new Date(value)); }
