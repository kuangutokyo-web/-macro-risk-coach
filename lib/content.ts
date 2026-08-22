export type Language = "en" | "ja";
export type Mode = "home" | "busy" | "normal" | "deep" | "review";

export type QuizQuestion = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanations: string[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "real-yields",
    category: "Rates → Equities",
    question: "US real yields jump 25bp while inflation expectations barely move. Which equity exposure is most directly vulnerable?",
    options: ["Long-duration growth stocks", "Floating-rate banks", "Cash-rich value stocks", "Commodity producers"],
    correct: 0,
    explanations: [
      "Correct. Higher real discount rates reduce the present value of distant cash flows most sharply.",
      "Banks may benefit from higher rates, though the curve and credit cycle still matter.",
      "Nearer-term cash flows and strong balance sheets make this group relatively less duration-sensitive.",
      "Commodity producers respond more directly to spot prices, demand, and inflation expectations.",
    ],
  },
  {
    id: "yen-carry",
    category: "FX → Cross-asset",
    question: "A rapid yen rally is most likely to create immediate stress through which channel?",
    options: ["Higher US inflation breakevens", "Unwinding of yen-funded carry trades", "Lower Japanese import costs", "A steeper US yield curve"],
    correct: 1,
    explanations: [
      "A yen rally does not mechanically raise US inflation expectations.",
      "Correct. Yen strength raises the funding cost of short-yen positions and can force deleveraging across risk assets.",
      "This is a medium-term economic benefit for Japan, not the primary immediate market-stress channel.",
      "The US curve could move for many reasons, but yen appreciation does not directly steepen it.",
    ],
  },
  {
    id: "oil-shock",
    category: "Commodities → Macro",
    question: "Oil rises 20% on a supply shock. For an oil-importing economy, what is the cleanest first-order macro effect?",
    options: ["Better terms of trade", "Lower headline inflation", "Higher inflation and weaker real income", "Stronger current account balance"],
    correct: 2,
    explanations: [
      "Importers pay more for the same energy, so their terms of trade deteriorate.",
      "Energy feeds directly into headline inflation, so the initial effect is higher, not lower.",
      "Correct. The economy pays more for imported energy, lifting prices and reducing household purchasing power.",
      "A larger energy import bill usually weakens the current account, all else equal.",
    ],
  },
  {
    id: "curve-inversion",
    category: "Rates → Cycle",
    question: "The yield curve bull-steepens after weak payrolls. What does that usually mean?",
    options: ["Long yields rise faster than short yields", "Short yields fall faster than long yields", "All yields rise equally", "Inflation expectations surge"],
    correct: 1,
    explanations: [
      "That would be a bear steepening because yields are rising.",
      "Correct. Yields fall (bull), with the front end falling more as markets price policy easing.",
      "A parallel move changes the level of rates, not the curve slope.",
      "Weak payrolls more often reduce growth and policy-rate expectations than cause an inflation surge.",
    ],
  },
  {
    id: "credit-spreads",
    category: "Credit → Risk",
    question: "Credit spreads widen sharply while government yields fall. What is the strongest interpretation?",
    options: ["Risk-free and risky assets are both rallying", "Credit risk is improving", "Growth or default concerns are overriding the rates rally", "Corporate funding conditions are easing"],
    correct: 2,
    explanations: [
      "Government bonds may rally, but wider spreads mean corporate credit is under pressure.",
      "Improving credit risk would usually compress, not widen, spreads.",
      "Correct. The flight to government bonds is not enough to offset rising compensation for corporate risk.",
      "Wider spreads raise the cost of corporate borrowing and tighten funding conditions.",
    ],
  },
];

export const normalCase = {
  tag: { en: "POLICY DIVERGENCE", ja: "金融政策の乖離" },
  title: { en: "The hawkish surprise", ja: "タカ派サプライズ" },
  scenario: {
    en: "The ECB unexpectedly signals that rates may stay restrictive for longer. Two-year German yields rise 18bp, EUR/USD gains 1.1%, and European bank equities outperform while rate-sensitive real estate falls 3.4%. Your portfolio holds European exporters, a long EUR/USD position, and investment-grade property bonds.",
    ja: "ECBは予想外に、政策金利を長期間引き締め的に維持する可能性を示唆。ドイツ2年債利回りは18bp上昇、EUR/USDは1.1%上昇。欧州銀行株はアウトパフォームする一方、金利敏感な不動産株は3.4%下落。ポートフォリオは欧州輸出企業、EUR/USDロング、投資適格不動産社債を保有。",
  },
  fields: [
    { key: "exposure", label: { en: "Relevant Exposure", ja: "関連エクスポージャー" }, hint: { en: "What in the portfolio is actually exposed?", ja: "ポートフォリオの何が実際に影響を受けるか？" } },
    { key: "drivers", label: { en: "Main P&L Drivers", ja: "主な損益要因" }, hint: { en: "Name the dominant market transmission channels.", ja: "主要な市場伝達チャネルを特定してください。" } },
    { key: "check", label: { en: "Further Check", ja: "追加確認" }, hint: { en: "What fact or sensitivity would you verify next?", ja: "次に確認すべき事実や感応度は？" } },
  ],
};

export const deepCase = {
  tag: { en: "CROSS-ASSET SHOCK", ja: "クロスアセット・ショック" },
  title: { en: "Oil, inflation, and the curve", ja: "原油、インフレ、イールドカーブ" },
  scenario: {
    en: "A major shipping route is disrupted overnight. Brent rises 14%, US 5y5y inflation swaps add 22bp, and the Treasury curve bear-steepens. Airlines and consumer discretionary sell off; energy credit rallies. Your book is long US airlines, receives fixed in 10-year swaps, holds a short CAD position, and owns high-yield energy bonds.",
    ja: "主要航路が一夜にして寸断。ブレント原油は14%上昇、米国5年先5年インフレスワップは22bp上昇し、米国債カーブはベア・スティープ化。航空・一般消費財株は売られ、エネルギー社債は上昇。ブックは米航空株ロング、10年スワップ固定受け、CADショート、ハイイールド・エネルギー債を保有。",
  },
  fields: [
    { key: "marketMove", label: { en: "Market Move", ja: "市場変動" }, hint: { en: "Describe the shock and cross-asset reaction.", ja: "ショックとクロスアセットの反応を記述。" } },
    { key: "exposure", label: { en: "Relevant Exposure", ja: "関連エクスポージャー" }, hint: { en: "Map each position to the shock.", ja: "各ポジションをショックに対応付ける。" } },
    { key: "pnl", label: { en: "Expected P&L", ja: "予想損益" }, hint: { en: "Direction first; magnitude where defensible.", ja: "まず方向、可能であれば規模も。" } },
    { key: "risk", label: { en: "Key Risk", ja: "主要リスク" }, hint: { en: "Identify the concentration or nonlinear outcome.", ja: "集中リスクまたは非線形な結果を特定。" } },
    { key: "action", label: { en: "Risk Action", ja: "リスク対応" }, hint: { en: "Recommend a proportionate, executable action.", ja: "実行可能で適切な対応を提案。" } },
  ],
};
