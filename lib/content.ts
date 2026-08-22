export type Language = "en" | "ja";
import type { VocabularyReference } from "./vocabulary/types";

export type Mode = "home" | "busy" | "normal" | "deep" | "news" | "review" | "vocabulary";

export type QuizQuestion = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanations: string[];
  vocabulary: VocabularyReference[];
  optionVocabulary: VocabularyReference[][];
  explanationVocabulary: VocabularyReference[][];
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
    vocabulary: [{ termId:"real-yield", text:"real yields" }, { termId:"inflation-expectations" }, { termId:"long-duration", text:"Long-duration growth stocks" }, { termId:"basis-point", text:"25bp" }],
    optionVocabulary: [[{termId:"long-duration",text:"Long-duration growth stocks"}],[{termId:"floating-rate",text:"Floating-rate banks"}],[],[]],
    explanationVocabulary: [[{termId:"discount-rate",text:"discount rates"}],[],[],[{termId:"inflation-expectations"}]],
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
    vocabulary: [{ termId:"carry-trade", text:"yen-funded carry trades" }, { termId:"deleveraging" }],
    optionVocabulary: [[{termId:"inflation-breakeven",text:"inflation breakevens"}],[{termId:"carry-trade",text:"yen-funded carry trades"}],[],[{termId:"yield-curve",text:"yield curve"}]],
    explanationVocabulary: [[{termId:"inflation-expectations"}],[{termId:"funding-cost",text:"funding cost"},{termId:"deleveraging"}],[],[]],
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
    vocabulary: [{ termId:"supply-shock" }, { termId:"terms-of-trade", text:"terms of trade" }, { termId:"current-account", text:"current account balance" }],
    optionVocabulary: [[{termId:"terms-of-trade",text:"terms of trade"}],[],[],[{termId:"current-account",text:"current account balance"}]],
    explanationVocabulary: [[{termId:"terms-of-trade",text:"terms of trade"}],[{termId:"inflation-expectations",text:"headline inflation"}],[],[{termId:"current-account",text:"current account"}]],
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
    vocabulary: [{ termId:"yield-curve", text:"yield curve" }, { termId:"bull-steepening", text:"bull-steepens" }],
    optionVocabulary: [[],[],[],[{termId:"inflation-expectations"}]],
    explanationVocabulary: [[{termId:"bear-steepening",text:"bear steepening"}],[{termId:"bull-steepening",text:"bull"}],[],[]],
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
    vocabulary: [{ termId:"credit-spread", text:"Credit spreads" }],
    optionVocabulary: [[],[{termId:"default-risk",text:"Credit risk"}],[{termId:"default-risk",text:"default concerns"}],[{termId:"funding-cost",text:"funding conditions"}]],
    explanationVocabulary: [[{termId:"credit-spread",text:"wider spreads"}],[{termId:"credit-spread",text:"spreads"}],[{termId:"default-risk",text:"corporate risk"}],[{termId:"credit-spread",text:"Wider spreads"},{termId:"funding-cost",text:"funding conditions"}]],
  },
];

export const normalCase = {
  tag: { en: "POLICY DIVERGENCE", ja: "金融政策の乖離" },
  title: { en: "The hawkish surprise", ja: "タカ派サプライズ" },
  scenario: {
    en: "The ECB unexpectedly signals that rates may stay restrictive for longer. Two-year German yields rise 18bp, EUR/USD gains 1.1%, and European bank equities outperform while rate-sensitive real estate falls 3.4%. Your portfolio holds European exporters, a long EUR/USD position, and investment-grade property bonds.",
    ja: "ECBは予想外に、政策金利を長期間引き締め的に維持する可能性を示唆。ドイツ2年債利回りは18bp上昇、EUR/USDは1.1%上昇。欧州銀行株はアウトパフォームする一方、金利敏感な不動産株は3.4%下落。ポートフォリオは欧州輸出企業、EUR/USDロング、投資適格不動産社債を保有。",
  },
  vocabulary: [
    { termId:"basis-point", text:{ en:"18bp", ja:"18bp" } },
    { termId:"policy-divergence", text:{ en:"restrictive for longer", ja:"長期間引き締め的" } },
    { termId:"investment-grade", text:{ en:"investment-grade property bonds", ja:"投資適格不動産社債" } },
    { termId:"pnl-driver", text:{ en:"P&L Drivers", ja:"損益要因" } },
  ],
  modelAnswer: {
    en: [
      "Relevant Exposure — European exporters face a stronger euro; the long EUR/USD position benefits; investment-grade property bonds face both duration and spread pressure.",
      "Main P&L Drivers — EUR appreciation, higher front-end discount rates, and any widening in property credit spreads.",
      "Further Check — Verify FX hedge ratios, bond duration, spread sensitivity, and whether exporter revenues are naturally hedged.",
    ],
    ja: [
      "関連エクスポージャー — 欧州輸出企業はユーロ高の逆風、EUR/USDロングは利益、投資適格不動産社債はデュレーションとスプレッドの両面で圧力を受ける。",
      "主な損益要因 — ユーロ上昇、短期の割引率上昇、不動産クレジットスプレッドの拡大。",
      "追加確認 — FXヘッジ比率、債券デュレーション、スプレッド感応度、輸出企業売上の自然ヘッジを確認する。",
    ],
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
  vocabulary: [
    { termId:"supply-shock", text:{ en:"disrupted overnight", ja:"一夜にして寸断" } },
    { termId:"inflation-swap", text:{ en:"5y5y inflation swaps", ja:"5年先5年インフレスワップ" } },
    { termId:"bear-steepening", text:{ en:"bear-steepens", ja:"ベア・スティープ化" } },
    { termId:"receive-fixed", text:{ en:"receives fixed", ja:"固定受け" } },
    { termId:"short-position", text:{ en:"short CAD position", ja:"CADショート" } },
    { termId:"high-yield", text:{ en:"high-yield energy bonds", ja:"ハイイールド・エネルギー債" } },
  ],
  fields: [
    { key: "marketMove", label: { en: "Market Move", ja: "市場変動" }, hint: { en: "Describe the shock and cross-asset reaction.", ja: "ショックとクロスアセットの反応を記述。" } },
    { key: "exposure", label: { en: "Relevant Exposure", ja: "関連エクスポージャー" }, hint: { en: "Map each position to the shock.", ja: "各ポジションをショックに対応付ける。" } },
    { key: "pnl", label: { en: "Expected P&L", ja: "予想損益" }, hint: { en: "Direction first; magnitude where defensible.", ja: "まず方向、可能であれば規模も。" } },
    { key: "risk", label: { en: "Key Risk", ja: "主要リスク" }, hint: { en: "Identify the concentration or nonlinear outcome.", ja: "集中リスクまたは非線形な結果を特定。" } },
    { key: "action", label: { en: "Risk Action", ja: "リスク対応" }, hint: { en: "Recommend a proportionate, executable action.", ja: "実行可能で適切な対応を提案。" } },
  ],
};
