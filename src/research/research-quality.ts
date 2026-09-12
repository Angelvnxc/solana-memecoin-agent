import {
  ResearchRecord,
  ConfidenceLevel,
} from "./research-record";

export type ResearchQuality =
  | "INSUFFICIENT"
  | "PARTIAL"
  | "ADEQUATE"
  | "STRONG";

export interface ResearchQualityAssessment {
  quality: ResearchQuality;

  completeness: number;
  confidence: ConfidenceLevel;

  missingAreas: string[];
  warnings: string[];

  readyForThesis: boolean;

  assessedAt: string;
}

export class ResearchQualityGate {
  assess(
    research: ResearchRecord,
  ): ResearchQualityAssessment {
    const missingAreas: string[] = [];
    const warnings: string[] = [];

    if (
      research.market.price === undefined
    ) {
      missingAreas.push("MARKET_PRICE");
    }

    if (
      research.market.marketCap === undefined
    ) {
      missingAreas.push("MARKET_CAP");
    }

    if (
      research.market.volume24h === undefined
    ) {
      missingAreas.push("VOLUME");
    }

    if (
      research.market.liquidity === undefined
    ) {
      missingAreas.push("LIQUIDITY");
    }

    if (
      research.holders.total === undefined
    ) {
      missingAreas.push("HOLDER_DATA");
    }

    if (
      research.onChain.developerActivity ===
      undefined
    ) {
      missingAreas.push("DEVELOPER_ACTIVITY");
    }

    if (
      research.onChain.walletBehavior ===
      undefined
    ) {
      missingAreas.push("WALLET_BEHAVIOR");
    }

    if (
      research.onChain.liquidityBehavior ===
      undefined
    ) {
      missingAreas.push("LIQUIDITY_BEHAVIOR");
    }

    if (
      research.social.narrative === undefined
    ) {
      missingAreas.push("NARRATIVE");
    }

    if (
      research.social.sentiment === undefined
    ) {
      missingAreas.push("SOCIAL_SENTIMENT");
    }

    if (research.evidence.length === 0) {
      missingAreas.push("EVIDENCE");
    }

    if (research.unknowns.length > 0) {
      warnings.push(
        `${research.unknowns.length} unresolved unknowns remain.`,
      );
    }

    const totalAreas = 11;
    const completedAreas =
      totalAreas - missingAreas.length;

    const completeness =
      completedAreas / totalAreas;

    let quality: ResearchQuality;

    if (completeness < 0.4) {
      quality = "INSUFFICIENT";
    } else if (completeness < 0.65) {
      quality = "PARTIAL";
    } else if (completeness < 0.9) {
      quality = "ADEQUATE";
    } else {
      quality = "STRONG";
    }

    const readyForThesis =
      quality === "STRONG" &&
      research.evidence.length > 0 &&
      research.unknowns.length === 0;

    return {
      quality,
      completeness,
      confidence: research.confidence,
      missingAreas,
      warnings,
      readyForThesis,
      assessedAt: new Date().toISOString(),
    };
  }
}