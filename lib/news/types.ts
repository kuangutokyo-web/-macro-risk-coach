export type NewsAnswers = {
  retell: string;
  whyItMatters: string;
  riskView: string;
  whatNext: string;
};

export type ExtractedReview = {
  overallScore?: number;
  biggestGap?: string;
  lesson?: string;
  vocabularySuggestions: string[];
};

export type NewsDrillRecord = {
  id: string;
  date: string;
  updatedAt: string;
  headline: string;
  source: string;
  url: string;
  newsText: string;
  answers: NewsAnswers;
  copiedReviewPrompt: string;
  aiReview: string;
  extractedReview: ExtractedReview;
};

export type NewsDrillStore = { version: 1; records: NewsDrillRecord[] };

export const emptyNewsAnswers: NewsAnswers = { retell:"", whyItMatters:"", riskView:"", whatNext:"" };
