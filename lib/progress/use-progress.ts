"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalStorageProgressRepository } from "./repository";
import type { ProgressActivity, ProgressCompletion, ProgressStore } from "./types";
import type { SourceContext } from "../vocabulary/types";

const emptyStore:ProgressStore = {version:1,activities:[],vocabularyEvents:[]};

export function useProgress() {
  const [store,setStore] = useState<ProgressStore>(emptyStore); const [hydrated,setHydrated] = useState(false);
  const repository = useMemo(() => typeof window === "undefined" ? null : new LocalStorageProgressRepository(window.localStorage),[]);
  useEffect(() => { const hydration = window.setTimeout(() => { setStore(repository?.load() || emptyStore); setHydrated(true); },0); return () => window.clearTimeout(hydration); },[repository]);
  const complete = useCallback((activity:ProgressCompletion) => { if (repository) setStore(repository.complete(activity)); },[repository]);
  const vocabularySaved = useCallback((termId:string,context:SourceContext) => { if (repository) setStore(repository.recordVocabularySaved(termId,context)); },[repository]);
  const vocabularyReviewed = useCallback((termId:string) => { if (repository) setStore(repository.recordVocabularyReview(termId)); },[repository]);
  const removeSource = useCallback((mode:ProgressActivity["mode"],sourceRecordId:string) => { if (repository) setStore(repository.removeSource(mode,sourceRecordId)); },[repository]);
  return {store,hydrated,complete,vocabularySaved,vocabularyReviewed,removeSource};
}
