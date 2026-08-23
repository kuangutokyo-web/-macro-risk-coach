"use client";

import { useEffect, useMemo, useState } from "react";
import { Arrow, Check, Clock, Mark, Spark } from "./icons";
import { busyQuestionBank, deepCaseBank, type DeepCase, type Language, type Mode, normalCaseBank, type NormalCase, quizQuestions, type QuizQuestion } from "@/lib/content";
import { createDailyContent, type DailyContent } from "@/lib/daily-rotation";
import { readNormalDraft, saveNormalDraft } from "@/lib/normal-drafts";
import { pnlMysteryCases } from "@/lib/pnl-mystery/cases";
import { vocabularyById } from "@/lib/vocabulary/catalog";
import type { SourceContext, VocabularyReference } from "@/lib/vocabulary/types";
import { useVocabulary } from "@/lib/vocabulary/use-vocabulary";
import { VocabularyBank } from "./vocabulary/vocabulary-bank";
import { VocabularyContentProvider } from "./vocabulary/content-context";
import { VocabularyText } from "./vocabulary/term";
import { CatalogVocabularyText } from "./vocabulary/catalog-text";
import { NewsDrill } from "./news/news-drill";
import { PnlMystery } from "./pnl-mystery/pnl-mystery";
import { ProgressPage } from "./progress/progress-page";
import { useProgress } from "@/lib/progress/use-progress";
import type { BusyProgressResult, ProgressActivity } from "@/lib/progress/types";

type WrongAnswer = { questionId: string; selected: number; savedAt: string };
type Evaluation = { overallScore: number; summary: string; strengths: string[]; improvements: string[]; stepFeedback: { step: string; score: number; feedback: string }[] };

const modes = [
  { id: "busy" as const, eyebrow: "BUSY MODE", time: "5–10 min", title: "Sharpen your market sense.", body: "Five fast questions. Instant explanations. Wrong answers return for review.", tone: "lime", action: "Start quick drill" },
  { id: "normal" as const, eyebrow: "NORMAL MODE", time: "20–30 min", title: "Read the risk that matters.", body: "A focused macro case. Isolate exposure, P&L drivers, and the next check.", tone: "blue", action: "Open today’s case" },
  { id: "deep" as const, eyebrow: "DEEP MODE", time: "45–60 min", title: "Build the full risk view.", body: "Work a five-step case from market move to action, then ask AI to challenge it.", tone: "coral", action: "Begin deep analysis" },
  { id: "mystery" as const, eyebrow: "P&L MYSTERY", time: "20–30 min", title: "Explain the unexplained.", body: "Work backward from actual P&L to the exposure, hedge, Greek, basis, or valuation break.", tone: "mystery", action: "Open today’s mystery" },
  { id: "news" as const, eyebrow: "NEWS DRILL", time: "20–40 min", title: "Turn headlines into risk views.", body: "Paste one story, work the transmission chain, then take a complete prompt to your preferred AI.", tone: "news", action: "Analyze a story" },
];

function readWrongAnswers(): WrongAnswer[] {
  try { return JSON.parse(localStorage.getItem("mrc-wrong-answers") || "[]"); } catch { return []; }
}

export function RiskCoach() {
  const [mode, setMode] = useState<Mode>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [reopenActivity,setReopenActivity] = useState<ProgressActivity|null>(null);
  const vocabulary = useVocabulary();
  const progress = useProgress();

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      setWrongAnswers(readWrongAnswers());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);
  useEffect(() => {
    let midnightTimer = 0;
    const refreshDailyContent = () => {
      const now = new Date();
      setDailyContent(createDailyContent(now, { busy: busyQuestionBank, normal: normalCaseBank, deep: deepCaseBank, mystery:pnlMysteryCases }));
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnightTimer = window.setTimeout(refreshDailyContent, nextMidnight.getTime() - now.getTime() + 1_000);
    };
    const hydrationTimer = window.setTimeout(refreshDailyContent, 0);
    return () => { window.clearTimeout(hydrationTimer); window.clearTimeout(midnightTimer); };
  }, []);
  const navigate = (next: Mode) => { setReopenActivity(null); setMode(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openProgressActivity = (activity:ProgressActivity) => { setReopenActivity(activity); setMode(activity.mode === "pnl-mystery" ? "mystery" : activity.mode as Mode); window.scrollTo({top:0,behavior:"smooth"}); };
  const saveVocabularyTerm = (termId:string,context:SourceContext) => { vocabulary.save(termId,context); progress.vocabularySaved(termId,context); };
  const reviewVocabularyTerm = (termId:string,result:Parameters<typeof vocabulary.recordReview>[1]) => { progress.vocabularyReviewed(termId); vocabulary.recordReview(termId,result); };

  const saveWrong = (entry: WrongAnswer) => {
    const next = [...wrongAnswers.filter((item) => item.questionId !== entry.questionId), entry];
    setWrongAnswers(next);
    localStorage.setItem("mrc-wrong-answers", JSON.stringify(next));
  };
  const clearWrong = () => { setWrongAnswers([]); localStorage.removeItem("mrc-wrong-answers"); };

  return (
    <VocabularyContentProvider entries={vocabulary.entries}><main>
      <header className="topbar">
        <button className="brand" onClick={() => navigate("home")} aria-label="Macro Risk Coach home"><span className="brand-mark"><Mark /></span><span>MACRO RISK COACH</span></button>
        <nav aria-label="Primary navigation">
          <button className={mode === "home" ? "active" : ""} onClick={() => navigate("home")}>Today</button>
          <button className={mode === "review" ? "active" : ""} onClick={() => navigate("review")}>Weekly review <span className="count">{hydrated ? wrongAnswers.length : 0}</span></button>
          <button className={mode === "news" ? "active" : ""} onClick={() => navigate("news")}>News</button>
          <button className={mode === "mystery" ? "active" : ""} onClick={() => navigate("mystery")}>P&amp;L Mystery</button>
          <button className={mode === "progress" ? "active" : ""} onClick={() => navigate("progress")}>Progress</button>
          <button className={mode === "vocabulary" ? "active" : ""} onClick={() => navigate("vocabulary")}>Vocabulary <span className="count vocab-count">{vocabulary.hydrated ? vocabulary.entries.length : 0}</span></button>
        </nav>
      </header>

      {mode === "home" && <Home onSelect={navigate} reviewCount={wrongAnswers.length} dailyLabel={dailyContent?.displayDate} />}
      {mode === "busy" && dailyContent && <BusyMode key={dailyContent.dateKey} questions={dailyContent.busyQuestions} dailyLabel={dailyContent.displayDate} onBack={() => navigate("home")} onSaveWrong={saveWrong} onComplete={(results) => progress.complete({id:`busy:${dailyContent.dateKey}`,date:new Date().toISOString(),mode:"busy",contentId:dailyContent.dateKey,title:`Busy daily set · ${dailyContent.displayDate}`,status:"completed",busy:{questionIds:results.map((result) => result.questionId),results,score:results.filter((result) => result.correct).length,correctCount:results.filter((result) => result.correct).length,wrongQuestionIds:results.filter((result) => !result.correct).map((result) => result.questionId)}})} savedIds={vocabulary.savedIds} onSaveTerm={saveVocabularyTerm} />}
      {mode === "normal" && dailyContent && <CaseMode key={`normal:${reopenActivity?.id || dailyContent.dateKey}`} kind="normal" data={reopenActivity?.mode === "normal" ? normalCaseBank.find((item) => item.id === reopenActivity.contentId) || dailyContent.normalCase : dailyContent.normalCase} dailyLabel={dailyContent.displayDate} language={language} setLanguage={setLanguage} onBack={() => navigate(reopenActivity ? "progress" : "home")} savedIds={vocabulary.savedIds} onSaveTerm={saveVocabularyTerm} historyActivity={reopenActivity?.mode === "normal" ? reopenActivity : null} onComplete={(data,answers) => progress.complete({id:`normal:${dailyContent.dateKey}:${data.id}`,date:new Date().toISOString(),mode:"normal",contentId:data.id,title:data.title.en,status:"completed",answers,referenceAnswerRevealed:true})} />}
      {mode === "deep" && dailyContent && <CaseMode key={`deep:${reopenActivity?.id || dailyContent.dateKey}`} kind="deep" data={reopenActivity?.mode === "deep" ? deepCaseBank.find((item) => item.id === reopenActivity.contentId) || dailyContent.deepCase : dailyContent.deepCase} dailyLabel={dailyContent.displayDate} language={language} setLanguage={setLanguage} onBack={() => navigate(reopenActivity ? "progress" : "home")} savedIds={vocabulary.savedIds} onSaveTerm={saveVocabularyTerm} historyActivity={reopenActivity?.mode === "deep" ? reopenActivity : null} onComplete={(data,answers) => progress.complete({id:`deep:${dailyContent.dateKey}:${data.id}`,date:new Date().toISOString(),mode:"deep",contentId:data.id,title:data.title.en,status:"completed",answers,referenceAnswerRevealed:false})} />}
      {mode === "news" && <NewsDrill savedIds={vocabulary.savedIds} onSaveTerm={saveVocabularyTerm} onBack={() => navigate(reopenActivity ? "progress" : "home")} reopenId={reopenActivity?.mode === "news" ? reopenActivity.sourceRecordId : undefined} onComplete={(record) => progress.complete({id:`news:${record.id}`,date:record.updatedAt,mode:"news",contentId:record.id,title:record.headline,status:"completed",answers:record.answers,sourceRecordId:record.id})} onDeleteRecord={(id) => progress.removeSource("news",id)} />}
      {mode === "mystery" && dailyContent && <PnlMystery todayCase={dailyContent.mysteryCase} dateKey={dailyContent.dateKey} displayDate={dailyContent.displayDate} savedIds={vocabulary.savedIds} onSaveTerm={saveVocabularyTerm} onBack={() => navigate(reopenActivity ? "progress" : "home")} reopenId={reopenActivity?.mode === "pnl-mystery" ? reopenActivity.sourceRecordId : undefined} onComplete={(record,title) => progress.complete({id:`pnl-mystery:${record.id}`,date:record.completedAt!,mode:"pnl-mystery",contentId:record.caseId,title,status:"completed",answers:record.answers,referenceAnswerRevealed:record.explanationRevealed,sourceRecordId:record.id})} onDeleteRecord={(id) => progress.removeSource("pnl-mystery",id)} />}
      {mode === "progress" && <ProgressPage activities={progress.store.activities} vocabularyEvents={progress.store.vocabularyEvents} hydrated={progress.hydrated} onReopen={openProgressActivity} onBack={() => navigate("home")} />}
      {mode === "review" && <Review wrongAnswers={wrongAnswers} onClear={clearWrong} onPractice={() => navigate("busy")} />}
      {mode === "vocabulary" && <VocabularyBank entries={vocabulary.entries} onRemove={vocabulary.remove} onReview={reviewVocabularyTerm} onUpdateContent={vocabulary.updateContent} onResetContent={vocabulary.resetContent} onBack={() => navigate("home")} />}
    </main></VocabularyContentProvider>
  );
}

function Home({ onSelect, reviewCount, dailyLabel }: { onSelect: (mode: Mode) => void; reviewCount: number; dailyLabel?: string }) {
  return <>
    <section className="hero">
      <div className="hero-copy"><p className="kicker"><span /> DAILY RISK PRACTICE</p><h1>Think clearly<br />when markets<br /><em>don’t.</em></h1><p className="lede">Train the judgment that sits between a market move and a risk decision. Choose the depth that fits your day.</p></div>
      <div className="market-board" aria-label="Illustrative cross-asset market signals">
        <div className="board-head"><span>MARKET PULSE</span><span className="live"><i /> CASE DATA</span></div>
        <div className="pulse-row"><span>US 10Y</span><strong>4.28%</strong><span className="up">+8 bp</span></div>
        <div className="pulse-row"><span>BRENT</span><strong>$84.12</strong><span className="up">+2.4%</span></div>
        <div className="pulse-row"><span>USD / JPY</span><strong>148.60</strong><span className="down">−0.7%</span></div>
        <div className="pulse-row"><span>VIX</span><strong>18.42</strong><span className="up">+1.8</span></div>
        <div className="signal"><span>Today’s signal</span><p>Rates and oil are moving together. Which exposures feel both?</p></div>
      </div>
    </section>
    <section className="mode-section">
      <div className="section-heading"><p className="kicker">TODAY’S SET{dailyLabel ? ` · ${dailyLabel}` : ""}</p><p>{reviewCount ? `${reviewCount} item${reviewCount === 1 ? "" : "s"} waiting in weekly review.` : "Consistency beats intensity. Start where you are."}</p></div>
      <div className="mode-grid">{modes.map((item, index) => <button key={item.id} className={`mode-card ${item.tone}`} onClick={() => onSelect(item.id)}><span className="mode-index">0{index + 1}</span><div className="mode-meta"><span>{item.eyebrow}</span><span><Clock /> {item.time}</span></div><h2>{item.title}</h2><p>{item.body}</p><span className="card-action">{item.action} <Arrow /></span></button>)}</div>
    </section>
  </>;
}

function BusyMode({ questions, dailyLabel, onBack, onSaveWrong, onComplete, savedIds, onSaveTerm }: { questions:QuizQuestion[]; dailyLabel:string; onBack: () => void; onSaveWrong: (entry: WrongAnswer) => void; onComplete:(results:BusyProgressResult[])=>void; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void }) {
  const [index, setIndex] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [score, setScore] = useState(0); const [complete, setComplete] = useState(false); const [results,setResults] = useState<BusyProgressResult[]>([]);
  const q = questions[index];
  const choose = (option: number) => {
    if (selected !== null) return; setSelected(option);
    const correct = option === q.correct; setResults((current) => [...current,{questionId:q.id,correct,category:q.category}]);
    if (correct) setScore((s) => s + 1); else onSaveWrong({ questionId: q.id, selected: option, savedAt: new Date().toISOString() });
  };
  const next = () => { if (index === questions.length - 1) { setComplete(true); onComplete(results); } else { setIndex((i) => i + 1); setSelected(null); } };
  if (complete) return <SessionShell eyebrow="BUSY MODE / COMPLETE" title="Signal captured." onBack={onBack} dailyLabel={dailyLabel}><div className="result-panel"><span className="score-ring">{score}<small>/ {questions.length}</small></span><div><h2>{score >= 4 ? "Strong market sense." : "Useful misses."}</h2><p>{questions.length - score ? `${questions.length - score} question${questions.length - score === 1 ? " was" : "s were"} saved for weekly review.` : "A clean run. Come back tomorrow for another pass."}</p><button className="primary" onClick={onBack}>Return to dashboard <Arrow /></button></div></div></SessionShell>;
  return <SessionShell eyebrow={`BUSY MODE / QUESTION ${index + 1} OF ${questions.length}`} title="What moves next?" onBack={onBack} dailyLabel={dailyLabel}>
    <div className="progress"><span style={{ width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} /></div>
    <div className="quiz-card"><p className="category">{q.category} · {q.difficulty}</p><h2><VocabularyText text={q.question} references={q.vocabulary} context={{mode:"busy",contentId:q.id,label:`Busy question: ${q.category}`,surface:"question",excerpt:q.question}} savedIds={savedIds} onSave={onSaveTerm} /></h2><VocabularyTermStrip references={q.vocabulary} context={{mode:"busy",contentId:q.id,label:`Busy question: ${q.category}`,surface:"question",excerpt:q.question}} savedIds={savedIds} onSave={onSaveTerm} /><div className="options">{q.options.map((option, i) => { const state = selected === null ? "" : i === q.correct ? "correct" : i === selected ? "wrong" : "muted"; return <BusyOption key={option} option={option} index={i} state={state} explanation={selected !== null ? q.explanations[i] : null} optionReferences={q.optionVocabulary[i]} explanationReferences={q.explanationVocabulary[i]} questionId={q.id} category={q.category} correct={i === q.correct} selected={i === selected} savedIds={savedIds} onSaveTerm={onSaveTerm} onChoose={choose} />; })}</div>{selected !== null && <div className="feedback-footer"><p><Check /> {selected === q.correct ? "Correct — keep the transmission chain explicit." : "Saved to weekly review — this is where the learning compounds."}</p><button className="primary" onClick={next}>{index === questions.length - 1 ? "See result" : "Next question"} <Arrow /></button></div>}</div>
  </SessionShell>;
}

function LanguageToggle({ language, setLanguage }: { language: Language; setLanguage: (l: Language) => void }) {
  return <div className="language-toggle" aria-label="Output language"><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><button className={language === "ja" ? "active" : ""} onClick={() => setLanguage("ja")}>日本語</button></div>;
}

function BusyOption({ option, index, state, explanation, optionReferences, explanationReferences, questionId, category, correct, selected, savedIds, onSaveTerm, onChoose }: { option:string; index:number; state:string; explanation:string|null; optionReferences:VocabularyReference[]; explanationReferences:VocabularyReference[]; questionId:string; category:string; correct:boolean; selected:boolean; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void; onChoose:(index:number)=>void }) {
  const optionContext:SourceContext = { mode:"busy", contentId:`${questionId}:option:${index}`, label:`Busy option ${String.fromCharCode(65+index)}: ${category}`, surface:"option", excerpt:option };
  const explanationContext:SourceContext = { mode:"busy", contentId:`${questionId}:explanation:${index}`, label:`Busy ${correct ? "correct" : "wrong"} explanation ${String.fromCharCode(65+index)}: ${category}`, surface:"explanation", excerpt:explanation || undefined };
  return <div className={`option-row ${state}`}><button type="button" className="option-hit" aria-label={`Select ${option}`} onClick={() => onChoose(index)} disabled={Boolean(explanation)} /><span className="option-letter">{String.fromCharCode(65+index)}</span><b><VocabularyText text={option} references={optionReferences} context={optionContext} savedIds={savedIds} onSave={onSaveTerm} /></b>{explanation && <small data-explanation-kind={correct ? "correct" : selected ? "selected-wrong" : "wrong"}><VocabularyText text={explanation} references={explanationReferences} context={explanationContext} savedIds={savedIds} onSave={onSaveTerm} /></small>}</div>;
}

function CaseMode({ kind, data, dailyLabel, language, setLanguage, onBack, savedIds, onSaveTerm, historyActivity, onComplete }: { kind: "normal" | "deep"; data:NormalCase | DeepCase; dailyLabel:string; language: Language; setLanguage: (l: Language) => void; onBack: () => void; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void; historyActivity:ProgressActivity|null; onComplete:(data:NormalCase|DeepCase,answers:Record<string,string>)=>void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({}); const [evaluation, setEvaluation] = useState<Evaluation | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [submitted, setSubmitted] = useState(false);
  const [draftReady,setDraftReady] = useState(kind !== "normal");
  const fieldKeys = useMemo(() => data.fields.map((field) => field.key),[data.fields]);
  useEffect(() => {
    if (historyActivity) { const restore = window.setTimeout(() => { setAnswers(historyActivity.answers || {}); setDraftReady(true); setSubmitted(true); },0); return () => window.clearTimeout(restore); }
    if (kind !== "normal") return;
    const restore = window.setTimeout(() => { setAnswers(readNormalDraft(window.localStorage,data.id,fieldKeys)); setDraftReady(true); },0);
    return () => window.clearTimeout(restore);
  },[kind,data.id,fieldKeys,historyActivity]);
  const updateAnswer = (key:string,value:string) => {
    const next = {...answers,[key]:value};
    setAnswers(next);
    if (kind === "normal" && draftReady) saveNormalDraft(window.localStorage,data.id,next);
  };
  const nonEmptyFields = data.fields.filter((field) => (answers[field.key] || "").trim().length > 0).length;
  const developedFields = data.fields.filter((field) => (answers[field.key] || "").trim().length > 15).length;
  const complete = kind === "normal" ? nonEmptyFields === data.fields.length : developedFields === data.fields.length;
  const evaluate = async () => {
    if (kind === "normal") { setSubmitted(true); onComplete(data,answers); return; }
    setLoading(true); setError("");
    try { const response = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, scenario: data.scenario[language], answers }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Evaluation failed."); setEvaluation(result); setSubmitted(true); onComplete(data,answers); } catch (err) { setError(err instanceof Error ? err.message : "Evaluation failed."); } finally { setLoading(false); }
  };
  return <SessionShell eyebrow={`${kind.toUpperCase()} MODE / ${kind === "normal" ? "FOCUSED CASE" : "FULL ANALYSIS"}`} title={data.title[language]} onBack={onBack} dailyLabel={dailyLabel} headerExtra={<LanguageToggle language={language} setLanguage={setLanguage} />}>
    <div className="case-layout"><aside className="case-brief"><p className="category">{data.tag[language]}</p><h2>{language === "en" ? "The setup" : "シナリオ"}</h2><p><VocabularyText text={data.scenario[language]} references={data.vocabulary.map((reference) => ({termId:reference.termId,text:reference.text[language]}))} context={{mode:kind,contentId:data.id,label:`${kind === "normal" ? "Normal" : "Deep"} case: ${data.title.en}`,surface:"case",excerpt:data.scenario.en}} savedIds={savedIds} onSave={onSaveTerm} /></p><div className="case-note"><span>{kind === "normal" ? "3" : "5"}</span><p>{language === "en" ? "questions only. Keep the causal chain concise and testable." : "問のみ。因果関係を簡潔かつ検証可能に。"}</p></div></aside>
      <section className="analysis-form">{data.fields.map((field, i) => <label key={field.key}><span className="step-no">0{i + 1}</span><span className="field-copy"><b>{field.label[language]}</b><small>{field.hint[language]}</small></span><textarea value={answers[field.key] || ""} onChange={(e) => updateAnswer(field.key,e.target.value)} placeholder={language === "en" ? "Write your view…" : "見解を入力…"} rows={4} disabled={kind === "normal" && !draftReady} /></label>)}
        <div className="submit-row"><p>{historyActivity ? <><Check /> Completed activity</> : complete ? <><Check /> Ready to submit</> : kind === "normal" ? `Complete all ${data.fields.length} sections to continue.` : `${developedFields} of ${data.fields.length} steps developed`}</p><button className="primary" disabled={Boolean(historyActivity) || !complete || (kind === "deep" && loading)} onClick={evaluate}>{historyActivity ? "Completed" : loading ? "Evaluating…" : kind === "deep" ? <><Spark /> Evaluate with OpenAI</> : "Complete case"} {!loading && kind === "normal" && <Arrow />}</button></div>
        {submitted && <><div className="completion-note"><Check /><div><h3>{language === "en" ? "Case complete" : "ケース完了"}</h3><p>{language === "en" ? "Your analysis is saved in this session. Re-read it once for hidden assumptions and unpriced second-order effects." : "分析が完了しました。暗黙の前提と織り込まれていない二次的影響を再確認してください。"}</p></div></div>{kind === "normal" && <ModelAnswer data={data as NormalCase} language={language} savedIds={savedIds} onSaveTerm={onSaveTerm} />}</>}
        {error && <div className="error-note"><b>Evaluation unavailable</b><p>{error}</p><small>Your analysis is still intact. Configure OPENAI_API_KEY in Vercel to enable AI feedback.</small></div>}
        {evaluation && <EvaluationPanel evaluation={evaluation} language={language} contentId={data.id} savedIds={savedIds} onSaveTerm={onSaveTerm} />}
      </section></div>
  </SessionShell>;
}

function EvaluationPanel({ evaluation, language, contentId, savedIds, onSaveTerm }: { evaluation: Evaluation; language:Language; contentId:string; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void }) {
  const render = (text:string,label:string) => <CatalogVocabularyText text={text} context={{mode:"deep",contentId:`${contentId}:feedback:${label}`,label:`Deep AI feedback: ${label}`,surface:"ai-feedback",excerpt:text}} savedIds={savedIds} onSave={onSaveTerm} />;
  return <div className="evaluation"><div className="evaluation-head"><div><p className="category">OPENAI EVALUATION</p><h2>{evaluation.overallScore}<span>/100</span></h2></div><p>{render(evaluation.summary,"summary")}</p></div><div className="eval-columns"><div><h3>{language === "ja" ? "良い点" : "What works"}</h3>{evaluation.strengths.map((x,index) => <p key={x}><Check /> {render(x,`strength-${index+1}`)}</p>)}</div><div><h3>{language === "ja" ? "改善点" : "Push further"}</h3>{evaluation.improvements.map((x,index) => <p key={x}><Arrow /> {render(x,`improvement-${index+1}`)}</p>)}</div></div><div className="step-scores">{evaluation.stepFeedback.map((x,index) => <div key={x.step}><span>{x.step}</span><b>{x.score}/20</b><p>{render(x.feedback,`step-${index+1}`)}</p></div>)}</div></div>;
}

function ModelAnswer({ data, language, savedIds, onSaveTerm }: { data:NormalCase; language:Language; savedIds:Set<string>; onSaveTerm:(termId:string,context:SourceContext)=>void }) {
  return <div className="model-answer"><p className="category">MODEL ANSWER</p><h3>{language === "en" ? "A concise risk view" : "簡潔なリスク見解"}</h3>{data.modelAnswer[language].map((line,index) => <p key={line}><span>0{index+1}</span><CatalogVocabularyText text={line} context={{mode:"normal",contentId:`${data.id}:model-answer:${index+1}`,label:`Normal model answer ${index+1}: ${data.title.en}`,surface:"model-answer",excerpt:line}} savedIds={savedIds} onSave={onSaveTerm} /></p>)}</div>;
}

function Review({ wrongAnswers, onClear, onPractice }: { wrongAnswers: WrongAnswer[]; onClear: () => void; onPractice: () => void }) {
  const items = useMemo(() => wrongAnswers.map((entry) => ({ entry, question: quizQuestions.find((q) => q.id === entry.questionId) })).filter((x) => x.question), [wrongAnswers]);
  return <SessionShell eyebrow="WEEKLY REVIEW" title="Turn misses into signals." onBack={() => history.back()}><div className="review-panel">{items.length === 0 ? <div className="empty-state"><Mark /><h2>No questions waiting.</h2><p>Wrong answers from Busy mode will collect here for deliberate review.</p><button className="primary" onClick={onPractice}>Start a quick drill <Arrow /></button></div> : <><div className="review-head"><p>{items.length} concept{items.length === 1 ? "" : "s"} to revisit. Explain each answer aloud before revealing the note.</p><button className="text-button" onClick={onClear}>Clear review</button></div>{items.map(({ entry, question }) => question && <article className="review-item" key={entry.questionId}><p className="category">{question.category}</p><h2>{question.question}</h2><div className="review-compare"><div><span>Your answer</span><p>{question.options[entry.selected]}</p></div><div><span>Correct answer</span><p>{question.options[question.correct]}</p></div></div><p className="review-explain">{question.explanations[question.correct]}</p></article>)}</>}</div></SessionShell>;
}

function SessionShell({ eyebrow, title, onBack, dailyLabel, headerExtra, children }: { eyebrow: string; title: string; onBack: () => void; dailyLabel?:string; headerExtra?: React.ReactNode; children: React.ReactNode }) {
  return <section className="session"><div className="session-header"><button className="back" onClick={onBack}>← Dashboard</button><div><p className="kicker">{eyebrow}</p><h1>{title}</h1>{dailyLabel && <p className="daily-set-label">TODAY’S SET · {dailyLabel}</p>}</div>{headerExtra || <span />}</div>{children}</section>;
}

function VocabularyTermStrip({ references, context, savedIds, onSave }: { references:VocabularyReference[]; context:SourceContext; savedIds:Set<string>; onSave:(termId:string,context:SourceContext)=>void }) {
  const unique = [...new Set(references.map((reference) => reference.termId))]; const text = unique.map((id) => vocabularyById.get(id)?.term).filter(Boolean).join(" · "); const normalized = unique.map((termId) => ({termId,text:vocabularyById.get(termId)?.term}));
  return <p className="vocab-term-strip"><span>KEY TERMS</span><VocabularyText text={text} references={normalized} context={context} savedIds={savedIds} onSave={onSave} /></p>;
}
