"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LocalStorageNewsRepository } from "./repository";
import type { NewsDrillRecord } from "./types";

export function useNewsDrills() {
  const [records,setRecords] = useState<NewsDrillRecord[]>([]); const [hydrated,setHydrated] = useState(false);
  const repository = useMemo(() => typeof window === "undefined" ? null : new LocalStorageNewsRepository(window.localStorage),[]);
  useEffect(() => { const hydration = window.setTimeout(() => { setRecords(repository?.list() || []); setHydrated(true); },0); return () => window.clearTimeout(hydration); },[repository]);
  const save = useCallback((record:NewsDrillRecord) => { if (repository) setRecords(repository.save(record)); },[repository]);
  const remove = useCallback((id:string) => { if (repository) setRecords(repository.remove(id)); },[repository]);
  return {records,hydrated,save,remove};
}
