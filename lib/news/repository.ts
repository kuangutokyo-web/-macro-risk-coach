import type { NewsDrillRecord, NewsDrillStore } from "./types";

export const NEWS_STORAGE_KEY = "mrc-news-drills-v1";
export interface NewsStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }

export class LocalStorageNewsRepository {
  constructor(private readonly storage:NewsStorage) {}
  private read():NewsDrillStore { try { const parsed = JSON.parse(this.storage.getItem(NEWS_STORAGE_KEY) || "null") as NewsDrillStore|null; return parsed?.version === 1 && Array.isArray(parsed.records) ? parsed : {version:1,records:[]}; } catch { return {version:1,records:[]}; } }
  private write(records:NewsDrillRecord[]) { this.storage.setItem(NEWS_STORAGE_KEY,JSON.stringify({version:1,records} satisfies NewsDrillStore)); return records; }
  list() { return this.read().records.toSorted((a,b) => b.updatedAt.localeCompare(a.updatedAt)); }
  save(record:NewsDrillRecord) { const records = this.list(); const exists = records.some((item) => item.id === record.id); return this.write(exists ? records.map((item) => item.id === record.id ? record : item) : [record,...records]); }
  remove(id:string) { return this.write(this.list().filter((record) => record.id !== id)); }
}
