import {
  ResearchRecord,
  ResearchEvidence,
  ConfidenceLevel,
} from "./research-record";

export class ResearchEngine {
  createEmptyResearch(tokenAddress: string): ResearchRecord {
    return {
      tokenAddress,

      market: {},
      holders: {},
      onChain: {},
      social: {},

      evidence: [],

      risks: [],
      unknowns: [],

      confidence: "LOW" as ConfidenceLevel,

      completeness: 0,

      researchedAt: new Date().toISOString(),
    };
  }

  addEvidence(
    research: ResearchRecord,
    evidence: ResearchEvidence,
  ): ResearchRecord {
    return {
      ...research,
      evidence: [...research.evidence, evidence],
    };
  }

  addRisk(
    research: ResearchRecord,
    risk: string,
  ): ResearchRecord {
    return {
      ...research,
      risks: [...research.risks, risk],
    };
  }

  addUnknown(
    research: ResearchRecord,
    unknown: string,
  ): ResearchRecord {
    return {
      ...research,
      unknowns: [...research.unknowns, unknown],
    };
  }
}