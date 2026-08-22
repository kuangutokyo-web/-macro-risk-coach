import type { ReviewProgress, ReviewResult, VocabularyEntry } from "./types";

const DAY = 86_400_000;

export function createReviewProgress(now = new Date()): ReviewProgress {
  return { status:"new", difficulty:3, lastReviewedAt:null, nextReviewAt:now.toISOString(), reviewCount:0, correctCount:0, incorrectCount:0, consecutiveCorrect:0 };
}

export function scheduleReview(progress: ReviewProgress, result: ReviewResult, now = new Date()): ReviewProgress {
  const positive = result === "correct" || result === "know";
  const correctCount = progress.correctCount + (positive ? 1 : 0);
  const incorrectCount = progress.incorrectCount + (positive ? 0 : 1);
  const consecutiveCorrect = positive ? progress.consecutiveCorrect + 1 : 0;
  const difficulty = Math.max(1, Math.min(5, progress.difficulty + (positive ? -1 : 1))) as ReviewProgress["difficulty"];
  const baseDays = positive ? Math.min(30, Math.max(2, 2 ** consecutiveCorrect)) : result === "again" ? 1 : 2;
  const intervalDays = Math.max(1, Math.round(baseDays / (0.7 + difficulty * 0.3)));
  return {
    status: consecutiveCorrect >= 4 && difficulty <= 2 ? "mastered" : "learning",
    difficulty,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: new Date(now.getTime() + intervalDays * DAY).toISOString(),
    reviewCount: progress.reviewCount + 1,
    correctCount,
    incorrectCount,
    consecutiveCorrect,
  };
}

export function priorityScore(entry: VocabularyEntry, now = new Date()): number {
  const dueDays = Math.max(0, (now.getTime() - new Date(entry.review.nextReviewAt).getTime()) / DAY);
  return dueDays * 10 + entry.review.difficulty * 4 + entry.review.incorrectCount * 3 - entry.review.consecutiveCorrect * 2 + (entry.review.status === "new" ? 20 : 0);
}

export function prioritizedEntries(entries: VocabularyEntry[], now = new Date()): VocabularyEntry[] {
  return entries.toSorted((a, b) => priorityScore(b, now) - priorityScore(a, now));
}

export function isUnmastered(entry: VocabularyEntry): boolean {
  return entry.review.status !== "mastered" || entry.review.difficulty >= 4;
}
