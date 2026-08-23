import type { MysteryHistoryRecord, MysteryHistoryStore } from "./types";

export const MYSTERY_STORAGE_KEY = "mrc-pnl-mystery-v1";
export interface MysteryStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }

export class LocalStorageMysteryRepository {
  constructor(private readonly storage:MysteryStorage) {}
  private read():MysteryHistoryStore {
    try {
      const parsed = JSON.parse(this.storage.getItem(MYSTERY_STORAGE_KEY) || "null") as MysteryHistoryStore|null;
      return parsed?.version === 1 && Array.isArray(parsed.records) ? parsed : {version:1,records:[]};
    } catch { return {version:1,records:[]}; }
  }
  private write(records:MysteryHistoryRecord[]) {
    this.storage.setItem(MYSTERY_STORAGE_KEY,JSON.stringify({version:1,records} satisfies MysteryHistoryStore));
    return records;
  }
  list() { return this.read().records.toSorted((a,b) => b.updatedAt.localeCompare(a.updatedAt)); }
  save(record:MysteryHistoryRecord) {
    const records = this.list();
    return this.write(records.some((item) => item.id === record.id) ? records.map((item) => item.id === record.id ? record : item) : [record,...records]);
  }
  remove(id:string) { return this.write(this.list().filter((record) => record.id !== id)); }
}
