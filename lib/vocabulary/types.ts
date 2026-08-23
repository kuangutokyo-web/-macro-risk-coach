export const vocabularyCategories = ["FX", "Rates", "Options", "Credit", "Macro", "P&L", "Risk Management"] as const;

export type VocabularyCategory = (typeof vocabularyCategories)[number];
export type ReviewStatus = "new" | "learning" | "mastered";
export type ReviewResult = "correct" | "incorrect" | "know" | "again";
export type VocabularySourceMode = "busy" | "normal" | "deep" | "news";
export type VocabularySourceSurface = "question" | "option" | "explanation" | "case" | "model-answer" | "ai-feedback" | "news-text" | "ai-review";

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
  whyItMatters?: string;
};

export type VocabularyContentOverrides = Partial<Omit<VocabularyTerm, "id" | "aliases">>;

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
  contentOverrides?: VocabularyContentOverrides;
};

export type VocabularyStore = { version: 2; entries: VocabularyEntry[] };
export type LegacyVocabularyStore = { version: 1; entries: Omit<VocabularyEntry, "contentOverrides">[] };

export interface VocabularyRepository {
  list(): VocabularyEntry[];
  save(termId: string, context: SourceContext): VocabularyEntry[];
  remove(termId: string): VocabularyEntry[];
  recordReview(termId: string, result: ReviewResult): VocabularyEntry[];
  updateContent(termId: string, overrides: VocabularyContentOverrides): VocabularyEntry[];
  resetContent(termId: string): VocabularyEntry[];
}
