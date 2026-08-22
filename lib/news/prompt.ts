import type { NewsDrillRecord } from "./types";

export function buildNewsReviewPrompt(record: NewsDrillRecord): string {
  return `You are a demanding but constructive senior macro market-risk mentor. Review the following manual news drill. Be precise, challenge generic reasoning, distinguish fact from interpretation, and do not assume facts that are not in the supplied news.

NEWS
Headline: ${record.headline}
Source: ${record.source || "Not provided"}
URL: ${record.url || "Not provided"}

News/article text or summary:
${record.newsText}

USER ANSWERS

1. Retell — What happened?
${record.answers.retell}

2. Why It Matters — Why does this matter for markets?
${record.answers.whyItMatters}

3. Risk View — What should a market-risk manager check?
${record.answers.riskView}

4. What Next — What would you watch next?
${record.answers.whatNext}

EVALUATION STANDARD

Retell:
- factual accuracy
- key facts omitted
- fact vs opinion
- clarity
- concision
- whether the answer is genuinely paraphrased

Why It Matters:
- causal logic
- transmission mechanism
- missing intermediate steps
- missing variables
- unsupported assumptions
- correlation vs causation
- whether reasoning is too generic

Risk View:
- relevant exposures
- position → market move → P&L logic
- missing risk factors
- concentration
- liquidity
- hedging
- optionality / convexity where relevant
- stress behavior
- cross-asset implications
- escalation / further checks

What Next:
- relevance of catalysts / indicators
- whether they can confirm or challenge the thesis
- missing signals
- whether the answer is too headline-focused

RETURN FEEDBACK IN EXACTLY THIS STRUCTURE

Overall score: 0–100

Retell
- Score
- What was good
- Problems
- Missing points
- Better version

Why It Matters
- Score
- What was good
- Problems
- Missing links
- Senior challenge
- Better reasoning

Risk View
- Score
- What was good
- Problems
- Missing risks
- Senior challenge
- Better reasoning

What Next
- Score
- What was good
- Problems
- Missing watch items
- Better version

Overall
- Biggest gap
- One-sentence lesson
- Next drill

Model Answer
1. What happened
2. Market transmission
3. Risk implications
4. What to watch next

Vocabulary
- suggest 3–5 useful financial / macro / risk terms from this news`;
}
