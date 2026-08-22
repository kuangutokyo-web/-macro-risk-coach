export const vocabularyCategories = ["FX", "Rates", "Options", "Credit", "Macro", "Risk Management"] as const;

export type VocabularyCategory = (typeof vocabularyCategories)[number];
export type ReviewStatus = "new" | "learning" | "mastered";
export type ReviewResult = "correct" | "incorrect" | "know" | "again";
export type VocabularySourceMode = "busy" | "normal" | "deep" | "news";
export type VocabularySourceSurface = "question" | "option" | "explanation" | "case" | "model-answer" | "ai-feedback";

export type VocabularyTerm = {
  id: string;
  term: string;
  aliases?: string[];
  definitionEn: string;
  definitionZh: string;
  definitionJa: string;
  practicalExplanation: string;
  exampleEn: string;
  exampleJa: string;
  category: VocabularyCategory;
};

export type VocabularyReference = { termId: string; text?: string };

export type SourceContext = {
  mode: VocabularySourceMode;
  contentId: string;
  label: string;
  surface?: VocabularySourceSurface;
  excerpt?: string;
};

export type ReviewProgress = {
  status: ReviewStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt: string | null;
  nextReviewAt: string;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
};

export type VocabularyEntry = {
  termId: string;
  sourceContexts: SourceContext[];
  dateAdded: string;
  review: ReviewProgress;
};

export type VocabularyStore = { version: 1; entries: VocabularyEntry[] };

export interface VocabularyRepository {
  list(): VocabularyEntry[];
  save(termId: string, context: SourceContext): VocabularyEntry[];
  remove(termId: string): VocabularyEntry[];
  recordReview(termId: string, result: ReviewResult): VocabularyEntry[];
}
