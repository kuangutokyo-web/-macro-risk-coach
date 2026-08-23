import type { VocabularyEntry, VocabularySourceMode } from "../vocabulary/types";
import type { MysteryHistoryRecord } from "../pnl-mystery/types";
import { pnlMysteryById } from "../pnl-mystery/cases";
import type { NewsDrillRecord } from "../news/types";
import type { ProgressActivity, ProgressCompletion, ProgressStore, VocabularyProgressEvent } from "./types";

export const PROGRESS_STORAGE_KEY = "mrc-progress-v1";
const NEWS_STORAGE_KEY = "mrc-news-drills-v1";
const MYSTERY_STORAGE_KEY = "mrc-pnl-mystery-v1";
const VOCABULARY_STORAGE_KEY = "mrc-vocabulary-v2";
export interface ProgressStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }

type LegacyNewsStore = {version:1;records:NewsDrillRecord[]};
type LegacyMysteryStore = {version:1;records:MysteryHistoryRecord[]};
type LegacyVocabularyStore = {version:2;entries:VocabularyEntry[]};

function readJson<T>(storage:ProgressStorage,key:string):T|null { try { return JSON.parse(storage.getItem(key) || "null") as T|null; } catch { return null; } }

function eventMatchesActivity(event:VocabularyProgressEvent,activity:ProgressActivity):boolean {
  if (event.type !== "added" || !event.sourceContext) return false;
  const {mode,contentId} = event.sourceContext;
  if (activity.mode === "busy") return mode === "busy" && Boolean(activity.busy?.questionIds.some((id) => contentId === id || contentId.startsWith(`${id}:`)));
  if (activity.mode === "pnl-mystery") return mode === "pnl-mystery" && contentId === activity.contentId;
  return mode === activity.mode as VocabularySourceMode && (contentId === activity.contentId || contentId.startsWith(`${activity.contentId}:`) || contentId.startsWith(`${activity.mode}-feedback-${activity.contentId}:`));
}

function withVocabulary(activity:ProgressActivity,events:VocabularyProgressEvent[]):ProgressActivity {
  return {...activity,vocabularyTermIds:[...new Set([...activity.vocabularyTermIds,...events.filter((event) => eventMatchesActivity(event,activity)).map((event) => event.termId)])]};
}

export class LocalStorageProgressRepository {
  constructor(private readonly storage:ProgressStorage) {}
  private readBase():ProgressStore {
    const parsed = readJson<ProgressStore>(this.storage,PROGRESS_STORAGE_KEY);
    return parsed?.version === 1 && Array.isArray(parsed.activities) && Array.isArray(parsed.vocabularyEvents) ? parsed : {version:1,activities:[],vocabularyEvents:[]};
  }
  private write(store:ProgressStore):ProgressStore { this.storage.setItem(PROGRESS_STORAGE_KEY,JSON.stringify(store)); return store; }
  private importLegacy(store:ProgressStore):ProgressStore {
    const activities = [...store.activities]; const vocabularyEvents = [...store.vocabularyEvents];
    const vocabulary = readJson<LegacyVocabularyStore>(this.storage,VOCABULARY_STORAGE_KEY);
    for (const entry of vocabulary?.version === 2 && Array.isArray(vocabulary.entries) ? vocabulary.entries : []) {
      const contexts = entry.sourceContexts.length ? entry.sourceContexts : [undefined];
      contexts.forEach((sourceContext,index) => {
        const addedId = `legacy:vocabulary-added:${entry.termId}:${index}`;
        if (!vocabularyEvents.some((event) => event.id === addedId)) vocabularyEvents.push({id:addedId,date:entry.dateAdded,type:"added",termId:entry.termId,count:index === 0 ? 1 : 0,sourceContext});
      });
      if (entry.review.reviewCount > 0 && entry.review.lastReviewedAt) {
        const reviewId = `legacy:vocabulary-reviewed:${entry.termId}:${entry.review.lastReviewedAt}`;
        if (!vocabularyEvents.some((event) => event.type === "reviewed" && event.termId === entry.termId)) vocabularyEvents.push({id:reviewId,date:entry.review.lastReviewedAt,type:"reviewed",termId:entry.termId,count:entry.review.reviewCount});
      }
    }
    for (const event of vocabularyEvents.filter((item) => item.type === "reviewed")) {
      const id = `activity:${event.id}`;
      if (!activities.some((activity) => activity.id === id)) activities.push({id,date:event.date,mode:"vocabulary-review",contentId:event.termId,title:`Vocabulary review · ${event.termId}`,status:"completed",vocabularyTermIds:[event.termId]});
    }
    const news = readJson<LegacyNewsStore>(this.storage,NEWS_STORAGE_KEY);
    for (const record of news?.version === 1 && Array.isArray(news.records) ? news.records : []) {
      if (!record.aiReview.trim()) continue; const id = `news:${record.id}`;
      if (!activities.some((activity) => activity.id === id)) activities.push({id,date:record.updatedAt,mode:"news",contentId:record.id,title:record.headline,status:"completed",answers:record.answers,referenceAnswerRevealed:false,vocabularyTermIds:[],sourceRecordId:record.id});
    }
    const mystery = readJson<LegacyMysteryStore>(this.storage,MYSTERY_STORAGE_KEY);
    for (const record of mystery?.version === 1 && Array.isArray(mystery.records) ? mystery.records : []) {
      if (!record.completedAt) continue; const id = `pnl-mystery:${record.id}`;
      if (!activities.some((activity) => activity.id === id)) activities.push({id,date:record.completedAt,mode:"pnl-mystery",contentId:record.caseId,title:pnlMysteryById.get(record.caseId)?.title,status:"completed",answers:record.answers,referenceAnswerRevealed:record.explanationRevealed,vocabularyTermIds:[],sourceRecordId:record.id});
    }
    return {version:1,activities:activities.map((activity) => withVocabulary(activity,vocabularyEvents)),vocabularyEvents};
  }
  load():ProgressStore { const imported = this.importLegacy(this.readBase()); return this.write(imported); }
  complete(input:ProgressCompletion):ProgressStore {
    const store = this.load(); const activity = withVocabulary({...input,vocabularyTermIds:input.vocabularyTermIds || []},store.vocabularyEvents);
    const activities = store.activities.some((item) => item.id === activity.id) ? store.activities.map((item) => item.id === activity.id ? {...item,...activity,vocabularyTermIds:[...new Set([...item.vocabularyTermIds,...activity.vocabularyTermIds])]} : item) : [activity,...store.activities];
    return this.write({...store,activities});
  }
  recordVocabularySaved(termId:string,sourceContext:VocabularyProgressEvent["sourceContext"],date=new Date().toISOString()):ProgressStore {
    const store = this.load(); const id = `vocabulary-added:${termId}:${sourceContext?.mode}:${sourceContext?.contentId}:${sourceContext?.surface || "unknown"}`;
    const firstAddition = !store.vocabularyEvents.some((event) => event.type === "added" && event.termId === termId);
    const vocabularyEvents = store.vocabularyEvents.some((event) => event.id === id) ? store.vocabularyEvents : [{id,date,type:"added" as const,termId,count:firstAddition ? 1 : 0,sourceContext},...store.vocabularyEvents];
    return this.write({...store,vocabularyEvents,activities:store.activities.map((activity) => withVocabulary(activity,vocabularyEvents))});
  }
  recordVocabularyReview(termId:string,date=new Date().toISOString()):ProgressStore {
    const store = this.load(); const id = `vocabulary-reviewed:${date}:${termId}:${store.vocabularyEvents.length}`;
    const activity:ProgressActivity = {id:`activity:${id}`,date,mode:"vocabulary-review",contentId:termId,title:`Vocabulary review · ${termId}`,status:"completed",vocabularyTermIds:[termId]};
    return this.write({...store,activities:[activity,...store.activities],vocabularyEvents:[{id,date,type:"reviewed",termId,count:1},...store.vocabularyEvents]});
  }
  removeSource(mode:ProgressActivity["mode"],sourceRecordId:string):ProgressStore {
    const store = this.load(); return this.write({...store,activities:store.activities.filter((activity) => activity.mode !== mode || activity.sourceRecordId !== sourceRecordId)});
  }
}
