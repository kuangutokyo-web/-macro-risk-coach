export const mysteryAnswerKeys = ["expectedPnL", "mystery", "evidence", "nextCheck", "residual"] as const;
export type MysteryAnswerKey = (typeof mysteryAnswerKeys)[number];
export type MysteryAnswers = Record<MysteryAnswerKey, string>;

export type PnlMysteryCase = {
  id: string;
  category: "FX" | "Rates" | "Options" | "Cross-Asset" | "Risk Management";
  difficulty: "intermediate" | "challenging";
  title: string;
  marketSetup: string;
  portfolio: string;
  clues: string[];
  actualPnL: string;
  referenceAnswer: MysteryAnswers;
  vocabulary: string[];
  questions: MysteryAnswers;
};

export type PnlMysteryCaseBank = {
  version: number;
  title: string;
  count: number;
  distribution: Record<PnlMysteryCase["category"], number>;
  cases: PnlMysteryCase[];
};

export type MysteryHistoryRecord = {
  id: string;
  caseId: string;
  date: string;
  answers: MysteryAnswers;
  completedAt: string | null;
  explanationRevealed: boolean;
  updatedAt: string;
};

export type MysteryHistoryStore = { version: 1; records: MysteryHistoryRecord[] };

export const emptyMysteryAnswers = (): MysteryAnswers => ({ expectedPnL: "", mystery: "", evidence: "", nextCheck: "", residual: "" });
