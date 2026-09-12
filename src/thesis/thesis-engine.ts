import {
  ResearchEvidence,
  ConfidenceLevel,
} from "../research/research-record";

export type ThesisScenario =
  | "BULL"
  | "BASE"
  | "BEAR";

export interface TradingThesis {
  tokenAddress: string;

  opportunity: string;
  whyNow: string;

  supportingEvidence: ResearchEvidence[];
  contradictingEvidence: ResearchEvidence[];

  uncertainties: string[];

  scenarios: {
    bull: string;
    base: string;
    bear: string;
  };

  risks: string[];

  invalidationConditions: string[];

  confidence: ConfidenceLevel;

  createdAt: string;
}

export class ThesisEngine {
  createThesis(
    tokenAddress: string,
    opportunity: string,
    whyNow: string,
    supportingEvidence: ResearchEvidence[],
    contradictingEvidence: ResearchEvidence[],
    uncertainties: string[],
    scenarios: TradingThesis["scenarios"],
    risks: string[],
    invalidationConditions: string[],
    confidence: ConfidenceLevel,
  ): TradingThesis {
    return {
      tokenAddress,
      opportunity,
      whyNow,
      supportingEvidence,
      contradictingEvidence,
      uncertainties,
      scenarios,
      risks,
      invalidationConditions,
      confidence,
      createdAt: new Date().toISOString(),
    };
  }
}