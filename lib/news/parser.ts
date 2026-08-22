import type { ExtractedReview } from "./types";

export function extractReviewFields(text: string): ExtractedReview {
  const scoreMatch = text.match(/Overall score\s*:\s*(\d{1,3})/i);
  const gapMatch = text.match(/Biggest gap\s*[:\-]\s*([^\n]+)/i);
  const lessonMatch = text.match(/One[- ]sentence lesson\s*[:\-]\s*([^\n]+)/i);
  const vocabularyBlock = text.match(/(?:^|\n)Vocabulary\s*\n([\s\S]*?)(?=\n[A-Z][A-Za-z ]+\s*\n|$)/i)?.[1] || "";
  const vocabularySuggestions = vocabularyBlock.split("\n").map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim()).filter(Boolean).slice(0, 5);
  return {
    overallScore: scoreMatch ? Math.min(100, Number(scoreMatch[1])) : undefined,
    biggestGap: gapMatch?.[1]?.trim(),
    lesson: lessonMatch?.[1]?.trim(),
    vocabularySuggestions,
  };
}
