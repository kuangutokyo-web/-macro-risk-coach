# Macro Risk Coach

A focused practice app for building macro market-risk judgment at three time depths:

- **Busy (5–10 min):** five market-sense questions, instant option-by-option explanations, and persistent weekly review.
- **Normal (20–30 min):** a short bilingual case covering only Relevant Exposure, Main P&L Drivers, and Further Check.
- **Deep (45–60 min):** a bilingual five-step analysis with optional OpenAI evaluation.
- **Vocabulary Bank:** save clickable terms from every learning mode, search multilingual definitions, and review them with prioritized spaced repetition.

## Local development

```bash
npm install
npm run dev
```

Busy and Normal modes work without an API key. Deep analysis also works without one; only the final AI evaluation call requires a key.

Vocabulary entries and review history are stored locally in a versioned repository format. The storage adapter can later be replaced by a database implementation without changing the learning UI or scheduling logic.

## OpenAI evaluation

The browser calls `POST /api/evaluate`. The route runs on the server and reads `process.env.OPENAI_API_KEY`; the key is never sent to the client.

In Vercel, add `OPENAI_API_KEY` under **Project Settings → Environment Variables**. You can optionally set `OPENAI_EVALUATION_MODEL`; it defaults to `gpt-5.6-luna`.

Never place a real key in source files. `.env*` files are ignored except for the safe `.env.example` template.

## Commands

```bash
npm run dev     # local development
npm run build   # production build
npm run lint    # static checks
```

Deployments are automatically built from the `main` branch by Vercel.
