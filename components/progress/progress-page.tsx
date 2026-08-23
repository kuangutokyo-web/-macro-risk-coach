"use client";

import { weeklyProgressSummary } from "@/lib/progress/summary";
import type { ProgressActivity, ProgressMode, VocabularyProgressEvent } from "@/lib/progress/types";
import { Arrow, Clock } from "../icons";

const modeLabels:Record<ProgressMode,string> = {busy:"Busy",normal:"Normal",deep:"Deep",news:"News","pnl-mystery":"P&L Mystery","vocabulary-review":"Vocabulary Review"};
const reopenable = new Set<ProgressMode>(["normal","deep","news","pnl-mystery"]);

export function ProgressPage({activities,vocabularyEvents,hydrated,onReopen,onBack}:{activities:ProgressActivity[];vocabularyEvents:VocabularyProgressEvent[];hydrated:boolean;onReopen:(activity:ProgressActivity)=>void;onBack:()=>void}) {
  const summary = weeklyProgressSummary(activities,vocabularyEvents);
  const recent = activities.toSorted((a,b) => b.date.localeCompare(a.date)).slice(0,20);
  const busyAccuracy = summary.busyTotal ? `${Math.round(summary.busyCorrect/summary.busyTotal*100)}%` : "—";
  return <section className="progress-page">
    <header className="progress-hero"><button className="back" onClick={onBack}>← Today</button><div><p className="kicker"><span /> LOCAL LEARNING RECORD</p><h1>Progress</h1><p>One lightweight record of the work that continues after the daily set rotates.</p></div><div className="progress-days"><strong>{summary.daysPracticed}</strong><span>DAYS THIS WEEK</span></div></header>
    <section className="weekly-summary"><div className="progress-section-title"><p className="category">THIS WEEK</p><h2>Practice at a glance</h2></div><div className="summary-grid">
      <article><span>DAYS PRACTICED</span><strong>{summary.daysPracticed}</strong></article><article><span>BUSY ACCURACY</span><strong>{busyAccuracy}</strong><small>{summary.busyCorrect} / {summary.busyTotal} correct</small></article>
      <article><span>CASES COMPLETED</span><strong>{summary.modeCounts.normal+summary.modeCounts.deep+summary.modeCounts.news+summary.modeCounts["pnl-mystery"]}</strong><small>{summary.modeCounts.normal} Normal · {summary.modeCounts.deep} Deep · {summary.modeCounts["pnl-mystery"]} Mystery · {summary.modeCounts.news} News</small></article>
      <article><span>VOCABULARY</span><strong>{summary.vocabularyAdded+summary.vocabularyReviewed}</strong><small>{summary.vocabularyAdded} added · {summary.vocabularyReviewed} reviewed</small></article>
    </div></section>
    <section className="progress-body"><div className="recent-activity"><div className="progress-section-title"><p className="category">RECENT ACTIVITY</p><h2>Your learning trail</h2></div>{!hydrated ? <p className="history-empty">Loading local progress…</p> : recent.length ? <div>{recent.map((activity) => <ActivityRow key={activity.id} activity={activity} onReopen={onReopen} />)}</div> : <div className="progress-empty"><span>01</span><h3>Your first completion will appear here.</h3><p>Finish a drill or review a vocabulary term to begin the record.</p></div>}</div>
      <aside className="weak-topics"><p className="category">WEAK TOPICS</p><h2>Where misses cluster</h2>{summary.weakTopics.length ? <ol>{summary.weakTopics.map((topic,index) => <li key={topic.category}><span>0{index+1}</span><b>{topic.category}</b><em>{topic.wrongCount} wrong</em></li>)}</ol> : <p>No Busy misses recorded this week.</p>}<small>Based only on completed Busy sets this week.</small></aside>
    </section>
  </section>;
}

function ActivityRow({activity,onReopen}:{activity:ProgressActivity;onReopen:(activity:ProgressActivity)=>void}) {
  const detail = activity.busy ? `${activity.busy.score}/${activity.busy.questionIds.length} · ${activity.busy.wrongQuestionIds.length} wrong` : activity.mode === "vocabulary-review" ? "Review recorded" : activity.referenceAnswerRevealed ? "Reference revealed" : `${Object.keys(activity.answers || {}).length} answers saved`;
  return <article className="progress-row"><div className={`progress-mode mode-${activity.mode}`}>{modeLabels[activity.mode]}</div><div><span><Clock /> {formatDate(activity.date)}</span><h3>{activity.title || activity.contentId}</h3><p>{detail}{activity.vocabularyTermIds.length ? ` · ${activity.vocabularyTermIds.length} vocabulary term${activity.vocabularyTermIds.length === 1 ? "" : "s"}` : ""}</p></div>{reopenable.has(activity.mode) && <button onClick={() => onReopen(activity)}>Reopen <Arrow /></button>}</article>;
}

function formatDate(value:string) { const date = new Date(value); return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(date); }
