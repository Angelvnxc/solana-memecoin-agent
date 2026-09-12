export type EvidenceType =
  | "SUPPORTING"
  | "CONTRADICTING"
  | "UNKNOWN";

export type ConfidenceLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface ResearchEvidence {
  type: EvidenceType;
  category: string;
  statement: string;
  source: string;
  confidence: ConfidenceLevel;
}

export interface ResearchRecord {
  tokenAddress: string;
  symbol?: string;
  name?: string;

  market: {
    price?: number;
    marketCap?: number;
    volume24h?: number;
    liquidity?: number;
  };

  holders: {
    total?: number;
    concentration?: number;
  };

  onChain: {
    developerActivity?: string;
    walletBehavior?: string;
    liquidityBehavior?: string;
  };

  social: {
    narrative?: string;
    sentiment?: string;
    activity?: string;
  };

  evidence: ResearchEvidence[];

  risks: string[];
  unknowns: string[];

  confidence: ConfidenceLevel;

  completeness: number;

  researchedAt: string;
}