import type { LegacyVocabularyStore, ReviewResult, SourceContext, VocabularyContentOverrides, VocabularyEntry, VocabularyRepository, VocabularyStore } from "./types";
import { createReviewProgress, scheduleReview } from "./scheduler";

export const VOCABULARY_STORAGE_KEY = "mrc-vocabulary-v2";
export const LEGACY_VOCABULARY_STORAGE_KEY = "mrc-vocabulary-v1";

export interface KeyValueStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }

export class LocalStorageVocabularyRepository implements VocabularyRepository {
  constructor(private readonly storage: KeyValueStorage) {}

  private read(): VocabularyStore {
    try {
      const parsed = JSON.parse(this.storage.getItem(VOCABULARY_STORAGE_KEY) || "null") as VocabularyStore | null;
      if (parsed?.version === 2 && Array.isArray(parsed.entries)) return parsed;
      const legacy = JSON.parse(this.storage.getItem(LEGACY_VOCABULARY_STORAGE_KEY) || "null") as LegacyVocabularyStore | null;
      return legacy?.version === 1 && Array.isArray(legacy.entries) ? { version:2, entries:legacy.entries } : { version:2, entries:[] };
    } catch { return { version:2, entries:[] }; }
  }

  private write(entries: VocabularyEntry[]): VocabularyEntry[] {
    this.storage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify({ version:2, entries } satisfies VocabularyStore));
    return entries;
  }

  list() { return this.read().entries; }

  save(termId: string, context: SourceContext) {
    const entries = this.list(); const existing = entries.find((entry) => entry.termId === termId);
    if (!existing) return this.write([...entries, { termId, sourceContexts:[context], dateAdded:new Date().toISOString(), review:createReviewProgress() }]);
    const duplicate = existing.sourceContexts.some((item) => item.mode === context.mode && item.contentId === context.contentId && item.surface === context.surface && item.label === context.label);
    if (duplicate) return entries;
    return this.write(entries.map((entry) => entry.termId === termId ? { ...entry, sourceContexts:[...entry.sourceContexts, context] } : entry));
  }

  remove(termId: string) { return this.write(this.list().filter((entry) => entry.termId !== termId)); }

  recordReview(termId: string, result: ReviewResult) {
    return this.write(this.list().map((entry) => entry.termId === termId ? { ...entry, review:scheduleReview(entry.review, result) } : entry));
  }

  updateContent(termId: string, overrides: VocabularyContentOverrides) {
    return this.write(this.list().map((entry) => entry.termId === termId ? { ...entry, contentOverrides:overrides } : entry));
  }

  resetContent(termId: string) {
    return this.write(this.list().map((entry) => {
      if (entry.termId !== termId) return entry;
      const { contentOverrides: _contentOverrides, ...preserved } = entry;
      void _contentOverrides;
      return preserved;
    }));
  }
}
