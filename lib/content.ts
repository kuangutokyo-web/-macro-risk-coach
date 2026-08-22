export type Language = "en" | "ja";
import type { VocabularyReference } from "./vocabulary/types";
import { importedBusyQuestionBank } from "./content/busy-bank";
import { legacyBusyQuestionBank } from "./content/legacy-busy-bank";

export type Mode = "home" | "busy" | "normal" | "deep" | "news" | "review" | "vocabulary";

export type QuizQuestion = {
  id: string;
  category: string;
  difficulty?: "foundational" | "intermediate" | "challenging";
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


export const busyQuestionBank: QuizQuestion[] = importedBusyQuestionBank;

/** Daily content uses only busyQuestionBank; legacy records remain reviewable. */
export const reviewQuestionBank = [...busyQuestionBank, ...legacyBusyQuestionBank];
export const quizQuestions = reviewQuestionBank;

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
