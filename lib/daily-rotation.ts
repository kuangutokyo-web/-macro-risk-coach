import type { DeepCase, NormalCase, QuizQuestion } from "./content";
import type { PnlMysteryCase } from "./pnl-mystery/types";

const DAY_MS = 86_400_000;

export type DailyContent = {
  dateKey: string;
  displayDate: string;
  busyQuestions: QuizQuestion[];
  normalCase: NormalCase;
  deepCase: DeepCase;
  mysteryCase: PnlMysteryCase;
};

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

function hash(value: string): number {
  let result = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }
  return result >>> 0;
}

function ranked<T extends { id: string }>(bank: readonly T[], seed: string): T[] {
  return [...bank].sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || a.id.localeCompare(b.id));
}

/** Date-indexed blocks guarantee no consecutive overlap when bank >= 2 × count. */
export function selectBusyQuestions(bank: readonly QuizQuestion[], date: Date, count = 5): QuizQuestion[] {
  if (bank.length < count) throw new Error(`Busy question bank needs at least ${count} questions.`);
  const day = localDayNumber(date);
  const stableOrder = ranked(bank, "busy:bank-order");
  const start = ((day * count) % stableOrder.length + stableOrder.length) % stableOrder.length;
  return Array.from({ length: count }, (_, offset) => stableOrder[(start + offset) % stableOrder.length]);
}

function selectRotatingCase<T extends { id: string }>(bank: readonly T[], date: Date, daysPerCase: number, namespace: string): T {
  if (!bank.length) throw new Error(`${namespace} case bank cannot be empty.`);
  const period = Math.floor(localDayNumber(date) / daysPerCase);
  const stableOrder = ranked(bank, `${namespace}:bank-order`);
  return stableOrder[((period % stableOrder.length) + stableOrder.length) % stableOrder.length];
}

export function selectNormalCase(bank: readonly NormalCase[], date: Date): NormalCase {
  return selectRotatingCase(bank, date, 1, "normal");
}

export function selectDeepCase(bank: readonly DeepCase[], date: Date): DeepCase {
  return selectRotatingCase(bank, date, 2, "deep");
}

export function selectPnlMysteryCase(bank: readonly PnlMysteryCase[], date: Date): PnlMysteryCase {
  return selectRotatingCase(bank, date, 1, "pnl-mystery");
}

export function createDailyContent(
  date: Date,
  banks: { busy: readonly QuizQuestion[]; normal: readonly NormalCase[]; deep: readonly DeepCase[]; mystery:readonly PnlMysteryCase[] },
): DailyContent {
  return {
    dateKey: localDateKey(date),
    displayDate: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date),
    busyQuestions: selectBusyQuestions(banks.busy, date),
    normalCase: selectNormalCase(banks.normal, date),
    deepCase: selectDeepCase(banks.deep, date),
    mysteryCase: selectPnlMysteryCase(banks.mystery,date),
  };
}
