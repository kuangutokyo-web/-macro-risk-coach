"use client";

import { useEffect, useMemo, useState } from "react";
import { busyVocabularyId } from "@/lib/vocabulary/busy-terms";
import { vocabularyById } from "@/lib/vocabulary/catalog";
import type { SourceContext, VocabularyReference } from "@/lib/vocabulary/types";
import { pnlMysteryById } from "@/lib/pnl-mystery/cases";
import { LocalStorageMysteryRepository } from "@/lib/pnl-mystery/repository";
import { emptyMysteryAnswers, mysteryAnswerKeys, type MysteryAnswerKey, type MysteryHistoryRecord, type PnlMysteryCase } from "@/lib/pnl-mystery/types";
import { Arrow, Check, Clock } from "../icons";
import { VocabularyText } from "../vocabulary/term";

const requiredKeys:MysteryAnswerKey[] = ["expectedPnL","mystery","evidence","nextCheck"];
const fieldLabels:Record<MysteryAnswerKey,string> = { expectedPnL:"Expected P&L", mystery:"Mystery", evidence:"Evidence", nextCheck:"Next Check", residual:"Residual" };

export function mysteryReferences(text:string,tags:string[]):VocabularyReference[] {
  const normalized = text.toLocaleLowerCase("en-US");
  return tags.flatMap((tag) => {
    const termId = busyVocabularyId(tag); const catalogTerm = vocabularyById.get(termId);
    const match = [tag,catalogTerm?.term || "",...(catalogTerm?.aliases || [])].filter(Boolean).toSorted((a,b) => b.length-a.length).find((candidate) => normalized.includes(candidate.toLocaleLowerCase("en-US")));
    return match ? [{termId,text:match}] : [];
  });
}

function createRecord(mysteryCase:PnlMysteryCase,dateKey:string):MysteryHistoryRecord {
  const now = new Date().toISOString();
  return {id:`${dateKey}:${mysteryCase.id}`,caseId:mysteryCase.id,date:dateKey,answers:emptyMysteryAnswers(),completedAt:null,explanationRevealed:false,updatedAt:now};
}

type Props = { todayCase:PnlMysteryCase; dateKey:string; displayDate:string; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void; onBack:()=>void };

export function PnlMystery({todayCase,dateKey,displayDate,savedIds,onSaveTerm,onBack}:Props) {
  const [record,setRecord] = useState<MysteryHistoryRecord>(() => createRecord(todayCase,dateKey));
  const [records,setRecords] = useState<MysteryHistoryRecord[]>([]);
  const [hydrated,setHydrated] = useState(false);
  const activeCase = pnlMysteryById.get(record.caseId) || todayCase;
  const isToday = record.caseId === todayCase.id && record.date === dateKey;
  const complete = requiredKeys.every((key) => record.answers[key].trim().length > 0);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const repository = new LocalStorageMysteryRepository(window.localStorage); const saved = repository.list();
      setRecords(saved); setRecord(saved.find((item) => item.id === `${dateKey}:${todayCase.id}`) || createRecord(todayCase,dateKey)); setHydrated(true);
    },0);
    return () => window.clearTimeout(restore);
  },[dateKey,todayCase]);

  const save = (next:MysteryHistoryRecord) => { const saved = new LocalStorageMysteryRepository(window.localStorage).save(next); setRecord(next); setRecords(saved); };
  const updateAnswer = (key:MysteryAnswerKey,value:string) => save({...record,answers:{...record.answers,[key]:value},updatedAt:new Date().toISOString()});
  const completeMystery = () => { if (!complete) return; save({...record,completedAt:record.completedAt || new Date().toISOString(),updatedAt:new Date().toISOString()}); };
  const reveal = () => save({...record,explanationRevealed:true,updatedAt:new Date().toISOString()});
  const reopen = (saved:MysteryHistoryRecord) => { setRecord(saved); window.scrollTo({top:0,behavior:"smooth"}); };
  const remove = (id:string) => {
    const next = new LocalStorageMysteryRepository(window.localStorage).remove(id); setRecords(next);
    if (record.id === id) setRecord(next.find((item) => item.id === `${dateKey}:${todayCase.id}`) || createRecord(todayCase,dateKey));
  };
  const context = (surface:SourceContext["surface"],excerpt:string):SourceContext => ({mode:"pnl-mystery",contentId:activeCase.id,label:`P&L Mystery: ${activeCase.title}`,surface,excerpt});
  const tagged = (text:string,surface:SourceContext["surface"]) => <VocabularyText text={text} references={mysteryReferences(text,activeCase.vocabulary)} context={context(surface,text)} savedIds={savedIds} onSave={onSaveTerm} />;
  const tagReferences = useMemo(() => activeCase.vocabulary.map((term) => ({termId:busyVocabularyId(term),text:term})),[activeCase.vocabulary]);

  return <section className="mystery-page">
    <header className="mystery-header"><button className="back" onClick={onBack}>← Today</button><div><p className="kicker"><span /> DAILY P&amp;L INVESTIGATION</p><h1>P&amp;L Mystery</h1><p>Reverse-engineer the gap between the book you thought you had and the P&amp;L you actually received.</p></div><p className="daily-date">DAILY CASE<br /><b>{displayDate}</b></p></header>
    <div className="mystery-meta"><span>{activeCase.category}</span><span>{activeCase.difficulty}</span><span>{activeCase.id}</span>{!isToday && <span className="history-marker">History review</span>}</div>
    <div className="mystery-workspace">
      <aside className="mystery-brief">
        <section><span>MARKET</span><h2>Market Setup</h2><p>{tagged(activeCase.marketSetup,"market-setup")}</p></section>
        <section><span>BOOK</span><h2>Portfolio</h2><p>{tagged(activeCase.portfolio,"portfolio")}</p></section>
        <section><span>CLUES</span><h2>What you know</h2><ul>{activeCase.clues.map((clue) => <li key={clue}>{tagged(clue,"clue")}</li>)}</ul></section>
        <section className="actual-pnl"><span>ACTUAL P&amp;L</span><strong>{activeCase.actualPnL}</strong></section>
        <div className="vocab-term-strip"><span>CASE TERMS</span><VocabularyText text={activeCase.vocabulary.join(" · ")} references={tagReferences} context={context("case",activeCase.vocabulary.join(", "))} savedIds={savedIds} onSave={onSaveTerm} /></div>
      </aside>
      <section className="mystery-analysis">
        <div className="investigation-path"><span>EXPECTATION</span><i>→</i><span>BREAK</span><i>→</i><span>EVIDENCE</span><i>→</i><span>CHECK</span></div>
        {mysteryAnswerKeys.map((key,index) => <label className={`mystery-field ${key === "residual" ? "optional" : ""}`} key={key}>
          <span className="mystery-number">0{index+1}</span><span className="mystery-field-copy"><b>{fieldLabels[key]}</b><small>{activeCase.questions[key]}{key === "residual" ? " (Optional)" : ""}</small></span>
          <textarea rows={key === "mystery" ? 5 : 4} value={record.answers[key]} onChange={(event) => updateAnswer(key,event.target.value)} disabled={!hydrated} placeholder="Write your investigation note…" />
        </label>)}
        <div className="mystery-complete-row"><p>{record.completedAt ? <><Check /> Mystery completed {new Date(record.completedAt).toLocaleDateString()}</> : complete ? <><Check /> Ready to complete</> : "Complete the first 4 sections to continue."}</p><button className="primary" disabled={!complete || Boolean(record.completedAt)} onClick={completeMystery}>{record.completedAt ? "Completed" : "Complete Mystery"} <Arrow /></button></div>
        {record.completedAt && <section className="mystery-reveal">
          {!record.explanationRevealed ? <><div><p className="category">SELF-REVIEW</p><h2>Test your investigation</h2><p>The reference explanation stays hidden until you choose to compare it with your reasoning.</p></div><button className="primary" onClick={reveal}>Reveal Explanation <Arrow /></button></> : <div className="reference-answer"><p className="category">REFERENCE ANSWER</p><h2>Explanation</h2>{mysteryAnswerKeys.map((key,index) => <article key={key}><span>0{index+1}</span><div><b>{fieldLabels[key]}</b><p>{tagged(activeCase.referenceAnswer[key],"reference-answer")}</p></div></article>)}</div>}
        </section>}
      </section>
    </div>
    <section className="mystery-history"><details open><summary>P&amp;L Mystery History <b>{records.length}</b></summary>{records.length ? <div>{records.map((saved) => { const savedCase = pnlMysteryById.get(saved.caseId); return <article className={saved.id === record.id ? "active" : ""} key={saved.id}><div><span>{saved.date} · {savedCase?.category} · {saved.completedAt ? "Completed" : "Draft"}</span><h3>{savedCase?.title || saved.caseId}</h3><p>{saved.explanationRevealed ? "Explanation revealed" : saved.completedAt ? "Ready for self-review" : "Investigation in progress"}</p></div><div><button onClick={() => reopen(saved)}><Clock /> Reopen</button><button onClick={() => remove(saved.id)}>Delete</button></div></article>})}</div> : <p className="history-empty">Your autosaved investigations will appear here.</p>}</details></section>
  </section>;
}
