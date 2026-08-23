export const NORMAL_DRAFT_STORAGE_KEY = "mrc-normal-drafts-v1";

type NormalDraft = { answers:Record<string,string>; updatedAt:string };
type NormalDraftStore = { version:1; drafts:Record<string,NormalDraft> };
type DraftStorage = { getItem(key:string):string|null; setItem(key:string,value:string):void };

function readStore(storage:DraftStorage):NormalDraftStore {
  try {
    const parsed = JSON.parse(storage.getItem(NORMAL_DRAFT_STORAGE_KEY) || "null") as NormalDraftStore|null;
    return parsed?.version === 1 && parsed.drafts && typeof parsed.drafts === "object" ? parsed : {version:1,drafts:{}};
  } catch { return {version:1,drafts:{}}; }
}

export function readNormalDraft(storage:DraftStorage,caseId:string,fieldKeys:string[]):Record<string,string> {
  const saved = readStore(storage).drafts[caseId]?.answers || {};
  return Object.fromEntries(fieldKeys.map((key) => [key,typeof saved[key] === "string" ? saved[key] : ""]));
}

export function saveNormalDraft(storage:DraftStorage,caseId:string,answers:Record<string,string>):void {
  const current = readStore(storage);
  storage.setItem(NORMAL_DRAFT_STORAGE_KEY,JSON.stringify({version:1,drafts:{...current.drafts,[caseId]:{answers,updatedAt:new Date().toISOString()}}} satisfies NormalDraftStore));
}
