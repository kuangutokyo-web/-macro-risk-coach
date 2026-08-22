import rawBank from "./busy-question-bank.json";
import type { QuizQuestion } from "../content";
import { busyVocabularyId } from "../vocabulary/busy-terms";
import type { VocabularyReference } from "../vocabulary/types";

type RawOption = { id: "A" | "B" | "C" | "D"; text: string };
type RawQuestion = {
  id: string;
  category: string;
  difficulty: "foundational" | "intermediate" | "challenging";
  question: string;
  options: RawOption[];
  correctAnswer: RawOption["id"];
  explanations: Record<RawOption["id"], string>;
  vocabulary: string[];
};

const optionIds: RawOption["id"][] = ["A", "B", "C", "D"];

function referencesForText(terms: string[], text: string): VocabularyReference[] {
  const normalizedText = text.toLocaleLowerCase("en-US");
  return terms
    .filter((term) => normalizedText.includes(term.toLocaleLowerCase("en-US")))
    .map((term) => ({ termId: busyVocabularyId(term), text: term }));
}

function adaptQuestion(question: RawQuestion): QuizQuestion {
  return {
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question,
    options: optionIds.map((id) => question.options.find((option) => option.id === id)?.text ?? ""),
    correct: optionIds.indexOf(question.correctAnswer),
    explanations: optionIds.map((id) => question.explanations[id]),
    vocabulary: question.vocabulary.map((term) => ({ termId: busyVocabularyId(term), text: term })),
    optionVocabulary: optionIds.map((id) => referencesForText(question.vocabulary, question.options.find((option) => option.id === id)?.text ?? "")),
    explanationVocabulary: optionIds.map((id) => referencesForText(question.vocabulary, question.explanations[id])),
  };
}

function validateBank(questions: RawQuestion[]): void {
  if (questions.length !== rawBank.questionCount) throw new Error(`Busy bank count mismatch: expected ${rawBank.questionCount}, received ${questions.length}.`);
  const ids = new Set<string>();
  for (const question of questions) {
    if (ids.has(question.id)) throw new Error(`Duplicate Busy question id: ${question.id}`);
    ids.add(question.id);
    if (question.options.length !== 4 || optionIds.some((id, index) => question.options[index]?.id !== id)) throw new Error(`${question.id} must have ordered A–D options.`);
    if (!optionIds.includes(question.correctAnswer)) throw new Error(`${question.id} has an invalid correct answer.`);
    if (optionIds.some((id) => !question.explanations[id])) throw new Error(`${question.id} must explain all four options.`);
  }
}

export const busyQuestionBankMetadata = {
  version: rawBank.version,
  title: rawBank.title,
  declaredQuestionCount: rawBank.questionCount,
  distribution: rawBank.distribution,
} as const;

const rawQuestions = rawBank.questions as RawQuestion[];
validateBank(rawQuestions);
export const importedBusyQuestionBank = rawQuestions.map(adaptQuestion);
