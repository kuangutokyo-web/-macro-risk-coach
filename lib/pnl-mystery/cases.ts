import rawCaseBank from "./case-bank.json";
import type { PnlMysteryCaseBank } from "./types";

export const pnlMysteryCaseBank = rawCaseBank as PnlMysteryCaseBank;
export const pnlMysteryCases = pnlMysteryCaseBank.cases;
export const pnlMysteryById = new Map(pnlMysteryCases.map((mysteryCase) => [mysteryCase.id, mysteryCase]));
