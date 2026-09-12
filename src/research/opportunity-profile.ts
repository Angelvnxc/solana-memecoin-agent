import { MarketData } from "../market/market-data";

export type ResearchPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface OpportunityProfile {
  tokenAddress: string;

  market: MarketData;

  discoverySignals: string[];

  supportingFactors: string[];

  contradictingFactors: string[];

  unknowns: string[];

  researchPriority: ResearchPriority;

  requiresDeepResearch: boolean;

  createdAt: string;
}

export class OpportunityProfileEngine {
  createProfile(
    tokenAddress: string,
    market: MarketData,
  ): OpportunityProfile {
    return {
      tokenAddress,

      market,

      discoverySignals: [],

      supportingFactors: [],

      contradictingFactors: [],

      unknowns: [],

      researchPriority: "LOW",

      requiresDeepResearch: false,

      createdAt: new Date().toISOString(),
    };
  }

  addDiscoverySignal(
    profile: OpportunityProfile,
    signal: string,
  ): OpportunityProfile {
    return {
      ...profile,
      discoverySignals: [
        ...profile.discoverySignals,
        signal,
      ],
    };
  }

  addSupportingFactor(
    profile: OpportunityProfile,
    factor: string,
  ): OpportunityProfile {
    return {
      ...profile,
      supportingFactors: [
        ...profile.supportingFactors,
        factor,
      ],
    };
  }

  addContradictingFactor(
    profile: OpportunityProfile,
    factor: string,
  ): OpportunityProfile {
    return {
      ...profile,
      contradictingFactors: [
        ...profile.contradictingFactors,
        factor,
      ],
    };
  }

  addUnknown(
    profile: OpportunityProfile,
    unknown: string,
  ): OpportunityProfile {
    return {
      ...profile,
      unknowns: [
        ...profile.unknowns,
        unknown,
      ],
    };
  }

  setResearchPriority(
    profile: OpportunityProfile,
    priority: ResearchPriority,
  ): OpportunityProfile {
    return {
      ...profile,
      researchPriority: priority,
      requiresDeepResearch:
        priority === "HIGH" ||
        priority === "URGENT",
    };
  }
}