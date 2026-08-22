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

type LocalizedText = { en: string; ja: string };
type CaseField = { key: string; label: LocalizedText; hint: LocalizedText };
export type NormalCase = { id: string; tag: LocalizedText; title: LocalizedText; scenario: LocalizedText; vocabulary: Array<{ termId: string; text: LocalizedText }>; modelAnswer: { en: string[]; ja: string[] }; fields: CaseField[] };
export type DeepCase = Omit<NormalCase, "modelAnswer">;

export const busyQuestionBank: QuizQuestion[] = [
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
  {
    id: "duration-shock",
    category: "Rates → Risk",
    question: "Government yields rise 40bp in a parallel move. Which position is likely to lose the most, all else equal?",
    options: ["A high-DV01 long bond position", "A floating-rate note near reset", "A short-duration cash portfolio", "A receive-floating interest-rate swap"],
    correct: 0,
    explanations: [
      "Correct. A larger DV01 means a larger price loss for the same rise in yields.",
      "A floating-rate note resets its coupon, so its price is usually less sensitive to a parallel yield rise.",
      "Short-duration cash flows have limited rate sensitivity compared with long bonds.",
      "Receiving floating generally benefits as the reference rate resets higher; it is not the clearest loss exposure here.",
    ],
    vocabulary: [{ termId:"dv01", text:"DV01" }, { termId:"basis-point", text:"40bp" }],
    optionVocabulary: [[{termId:"dv01",text:"high-DV01"}],[{termId:"floating-rate",text:"floating-rate note"}],[{termId:"long-duration",text:"short-duration"}],[]],
    explanationVocabulary: [[{termId:"dv01",text:"DV01"}],[{termId:"floating-rate",text:"floating-rate note"}],[{termId:"long-duration",text:"Short-duration"}],[]],
  },
  {
    id: "hawkish-fx",
    category: "Macro → FX",
    question: "A central bank delivers an unexpected hawkish hike while peers remain unchanged. What is the cleanest immediate FX channel?",
    options: ["The currency strengthens as its yield advantage widens", "The currency must weaken because growth will slow", "The current account improves immediately", "FX volatility must fall"],
    correct: 0,
    explanations: [
      "Correct. Wider expected rate differentials can attract capital and support the currency, at least initially.",
      "Slower growth may matter later, but it does not erase the immediate policy-divergence channel.",
      "Monetary policy does not mechanically change trade flows or the current account on impact.",
      "A policy surprise can increase, rather than necessarily reduce, FX volatility.",
    ],
    vocabulary: [{ termId:"policy-divergence", text:"policy" }, { termId:"current-account", text:"current account" }],
    optionVocabulary: [[{termId:"policy-divergence",text:"yield advantage"}],[],[{termId:"current-account",text:"current account"}],[]],
    explanationVocabulary: [[{termId:"policy-divergence",text:"rate differentials"}],[{termId:"policy-divergence",text:"policy-divergence"}],[{termId:"current-account",text:"current account"}],[]],
  },
  {
    id: "equity-skew",
    category: "Options → Equities",
    question: "Equity index downside skew steepens sharply. What does that most directly indicate?",
    options: ["Downside puts became richer relative to comparable calls", "All implied volatility fell", "The index delta became zero", "Credit spreads must tighten"],
    correct: 0,
    explanations: [
      "Correct. Steeper downside skew means the market is charging more for downside protection relative to upside options.",
      "The overall volatility level can rise or fall independently of the relative pricing across strikes.",
      "Skew describes relative option prices, not a requirement that the portfolio delta is zero.",
      "Option skew and credit spreads can co-move in stress, but one does not mechanically force the other to tighten.",
    ],
    vocabulary: [{ termId:"skew", text:"downside skew" }],
    optionVocabulary: [[{termId:"skew",text:"Downside puts"}],[],[],[{termId:"credit-spread",text:"Credit spreads"}]],
    explanationVocabulary: [[{termId:"skew",text:"downside skew"}],[{termId:"skew",text:"relative pricing across strikes"}],[{termId:"skew",text:"Skew"}],[{termId:"credit-spread",text:"credit spreads"}]],
  },
  {
    id: "credit-basis",
    category: "Credit → Hedging",
    question: "A corporate-bond book is duration-hedged with Treasury futures but loses as credit spreads widen. What remains?",
    options: ["Basis risk between corporate credit and the government-rate hedge", "No market risk because duration is hedged", "Only settlement risk", "A guaranteed gain from lower government yields"],
    correct: 0,
    explanations: [
      "Correct. The hedge offsets government-rate duration, not a widening corporate credit spread.",
      "Duration hedging removes only one driver; spread, liquidity, and issuer risks remain.",
      "Settlement risk is unrelated to the described mark-to-market loss.",
      "Lower government yields can help the bond, but widening spreads may more than offset that gain.",
    ],
    vocabulary: [{ termId:"basis-risk", text:"duration-hedged" }, { termId:"credit-spread", text:"credit spreads" }],
    optionVocabulary: [[{termId:"basis-risk",text:"Basis risk"},{termId:"credit-spread",text:"corporate credit"}],[],[],[]],
    explanationVocabulary: [[{termId:"basis-risk",text:"hedge"},{termId:"credit-spread",text:"credit spread"}],[{termId:"credit-spread",text:"spread"}],[],[{termId:"credit-spread",text:"widening spreads"}]],
  },
  {
    id: "liquidity-stress",
    category: "Risk → Liquidity",
    question: "Bid–ask spreads widen and market depth falls during a sell-off. Which risk is rising most directly?",
    options: ["Liquidity risk and the cost of exiting positions", "Coupon reinvestment income", "The accounting face value of cash", "A guaranteed decline in realized volatility"],
    correct: 0,
    explanations: [
      "Correct. Wider bid–ask spreads and thinner depth make trades costlier and increase market impact.",
      "Coupon reinvestment is not what bid–ask width and depth measure.",
      "Cash face value is not changed by thinner secondary-market liquidity.",
      "Poor liquidity can amplify price moves; it does not guarantee lower realized volatility.",
    ],
    vocabulary: [{ termId:"liquidity-risk", text:"market depth" }],
    optionVocabulary: [[{termId:"liquidity-risk",text:"Liquidity risk"}],[],[],[]],
    explanationVocabulary: [[{termId:"liquidity-risk",text:"bid–ask spreads"}],[],[{termId:"liquidity-risk",text:"liquidity"}],[{termId:"liquidity-risk",text:"Poor liquidity"}]],
  },
];

/** Full bank used by weekly review; retained as a compatibility export. */
export const quizQuestions = busyQuestionBank;

export const normalCase: NormalCase = {
  id: "ecb-hawkish-surprise",
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

export const deepCase: DeepCase = {
  id: "oil-inflation-curve",
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

export const normalCaseBank: NormalCase[] = [
  normalCase,
  {
    id: "us-cpi-downside",
    tag: { en: "INFLATION SURPRISE", ja: "インフレ・サプライズ" },
    title: { en: "The softer CPI print", ja: "弱いCPI" },
    scenario: { en: "US core CPI is below consensus. Two-year Treasury yields fall 16bp, the dollar weakens, and rate-sensitive equities rally. Your portfolio receives fixed in five-year swaps, holds US bank equities, and is long USD/JPY.", ja: "米コアCPIが市場予想を下回り、米2年債利回りは16bp低下、ドル安となり、金利敏感株が上昇。ポートフォリオは5年スワップ固定受け、米銀行株、USD/JPYロングを保有。" },
    vocabulary: [{termId:"basis-point",text:{en:"16bp",ja:"16bp"}},{termId:"receive-fixed",text:{en:"receives fixed",ja:"固定受け"}},{termId:"pnl-driver",text:{en:"P&L",ja:"損益"}}],
    modelAnswer: { en:["Relevant Exposure — The receive-fixed swap benefits from lower yields; long USD/JPY loses as the dollar weakens; bank equities face a mixed curve and growth signal.","Main P&L Drivers — Front-end rates, USD/JPY, yield-curve shape, and the banks’ net-interest-income sensitivity.","Further Check — Confirm DV01, FX hedge ratios, curve exposure, and whether the inflation surprise changes the policy path."], ja:["関連エクスポージャー — 金利低下で固定受けスワップは利益、ドル安でUSD/JPYロングは損失。銀行株はカーブと成長シグナルの影響が混在する。","主な損益要因 — 短期金利、USD/JPY、イールドカーブ形状、銀行の純金利収益感応度。","追加確認 — DV01、FXヘッジ比率、カーブ・エクスポージャー、インフレ下振れが政策経路を変えるか確認する。"] },
    fields: normalCase.fields,
  },
  {
    id: "china-demand-slowdown",
    tag: { en: "GROWTH SHOCK", ja: "成長ショック" },
    title: { en: "China demand disappoints", ja: "中国需要の下振れ" },
    scenario: { en: "China activity data misses expectations. Copper falls 5%, AUD/USD drops 1.3%, and Asian industrial equities underperform. Your portfolio is long Australian miners, short AUD/USD, and holds investment-grade Asian industrial bonds.", ja: "中国の景気指標が市場予想を下回り、銅は5%下落、AUD/USDは1.3%下落、アジア工業株はアンダーパフォーム。ポートフォリオは豪鉱山株ロング、AUD/USDショート、アジア工業企業の投資適格債を保有。" },
    vocabulary: [{termId:"short-position",text:{en:"short AUD/USD",ja:"AUD/USDショート"}},{termId:"investment-grade",text:{en:"investment-grade",ja:"投資適格債"}},{termId:"credit-spread",text:{en:"industrial bonds",ja:"工業企業"}}],
    modelAnswer: { en:["Relevant Exposure — Miners face weaker commodity earnings; short AUD/USD gains; industrial bonds may suffer spread widening.","Main P&L Drivers — Copper, AUD, China growth expectations, and Asian industrial credit spreads.","Further Check — Measure commodity beta, FX hedge ratios, issuer concentration, liquidity, and policy-response scenarios."], ja:["関連エクスポージャー — 鉱山株は商品収益悪化、AUD/USDショートは利益、工業社債はスプレッド拡大の可能性。","主な損益要因 — 銅、豪ドル、中国成長期待、アジア工業企業のクレジットスプレッド。","追加確認 — 商品ベータ、FXヘッジ比率、発行体集中、流動性、政策対応シナリオを確認する。"] },
    fields: normalCase.fields,
  },
];

export const deepCaseBank: DeepCase[] = [
  deepCase,
  {
    id: "yen-carry-unwind",
    tag: { en: "VOLATILITY SHOCK", ja: "ボラティリティ・ショック" },
    title: { en: "The yen carry unwind", ja: "円キャリーの巻き戻し" },
    scenario: { en: "The Bank of Japan tightens unexpectedly. The yen rallies 4%, global equities fall, implied volatility jumps, and cross-currency basis widens. Your book is short JPY, long technology equities, short index volatility, and holds leveraged emerging-market credit.", ja: "日銀が予想外に引き締め。円は4%上昇し、世界株は下落、インプライド・ボラティリティは急上昇、クロスカレンシー・ベーシスは拡大。ブックは円ショート、テクノロジー株ロング、株価指数ボラティリティ・ショート、レバレッジをかけた新興国社債を保有。" },
    vocabulary: [{termId:"carry-trade",text:{en:"carry unwind",ja:"キャリーの巻き戻し"}},{termId:"short-position",text:{en:"short JPY",ja:"円ショート"}},{termId:"deleveraging",text:{en:"leveraged",ja:"レバレッジ"}},{termId:"basis-risk",text:{en:"cross-currency basis",ja:"クロスカレンシー・ベーシス"}}],
    fields: deepCase.fields,
  },
  {
    id: "growth-scare-rally",
    tag: { en: "GROWTH SCARE", ja: "景気後退懸念" },
    title: { en: "Rates rally, risk sells off", ja: "金利低下とリスク資産下落" },
    scenario: { en: "Weak payrolls and falling surveys trigger a Treasury rally, wider credit spreads, lower oil, and a stronger yen. Your book is long cyclical equities, pays fixed in ten-year swaps, owns high-yield credit, and is long USD/JPY options with downside skew exposure.", ja: "弱い雇用統計と景況感指数の低下で米国債は上昇、クレジットスプレッドは拡大、原油は下落、円は上昇。ブックは景気敏感株ロング、10年スワップ固定払い、ハイイールド債、ダウンサイド・スキューを持つUSD/JPYオプションを保有。" },
    vocabulary: [{termId:"credit-spread",text:{en:"credit spreads",ja:"クレジットスプレッド"}},{termId:"high-yield",text:{en:"high-yield credit",ja:"ハイイールド債"}},{termId:"skew",text:{en:"downside skew",ja:"ダウンサイド・スキュー"}},{termId:"yield-curve",text:{en:"Treasury",ja:"米国債"}}],
    fields: deepCase.fields,
  },
];
