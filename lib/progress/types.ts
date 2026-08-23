import type { SourceContext } from "../vocabulary/types";

export type ProgressMode = "busy" | "normal" | "deep" | "news" | "pnl-mystery" | "vocabulary-review";
export type ProgressStatus = "completed";

export type BusyProgressResult = { questionId:string; correct:boolean; category:string };

export type ProgressActivity = {
  id: string;
  date: string;
  mode: ProgressMode;
  contentId: string;
  title?: string;
  status: ProgressStatus;
  answers?: Record<string,string>;
  busy?: {
    questionIds:string[];
    results:BusyProgressResult[];
    score:number;
    correctCount:number;
    wrongQuestionIds:string[];
  };
  referenceAnswerRevealed?: boolean;
  vocabularyTermIds:string[];
  sourceRecordId?:string;
};

export type VocabularyProgressEvent = {
  id:string;
  date:string;
  type:"added" | "reviewed";
  termId:string;
  count:number;
  sourceContext?:SourceContext;
};

export type ProgressStore = { version:1; activities:ProgressActivity[]; vocabularyEvents:VocabularyProgressEvent[] };
export type ProgressCompletion = Omit<ProgressActivity,"vocabularyTermIds"> & { vocabularyTermIds?:string[] };

export type WeeklyProgressSummary = {
  daysPracticed:number;
  busyCorrect:number;
  busyTotal:number;
  modeCounts:Record<"normal"|"deep"|"news"|"pnl-mystery",number>;
  vocabularyAdded:number;
  vocabularyReviewed:number;
  weakTopics:Array<{category:string;wrongCount:number}>;
};
