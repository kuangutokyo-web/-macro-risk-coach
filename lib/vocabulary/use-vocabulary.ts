"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalStorageVocabularyRepository } from "./repository";
import type { ReviewResult, SourceContext, VocabularyContentOverrides, VocabularyEntry } from "./types";

export function useVocabulary() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const repository = useMemo(() => typeof window === "undefined" ? null : new LocalStorageVocabularyRepository(window.localStorage), []);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      setEntries(repository?.list() || []);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, [repository]);

  const save = useCallback((termId: string, context: SourceContext) => {
    if (repository) setEntries(repository.save(termId, context));
  }, [repository]);

  const remove = useCallback((termId: string) => {
    if (repository) setEntries(repository.remove(termId));
  }, [repository]);

  const recordReview = useCallback((termId: string, result: ReviewResult) => {
    if (repository) setEntries(repository.recordReview(termId, result));
  }, [repository]);

  const updateContent = useCallback((termId: string, overrides: VocabularyContentOverrides) => {
    if (repository) setEntries(repository.updateContent(termId, overrides));
  }, [repository]);

  const resetContent = useCallback((termId: string) => {
    if (repository) setEntries(repository.resetContent(termId));
  }, [repository]);

  const savedIds = useMemo(() => new Set(entries.map((entry) => entry.termId)), [entries]);
  return { entries, hydrated, savedIds, save, remove, recordReview, updateContent, resetContent };
}
