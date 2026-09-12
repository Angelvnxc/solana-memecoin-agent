export type WalletEntityType =
  | "UNKNOWN"
  | "PERSONAL_WALLET"
  | "PROGRAM"
  | "EXCHANGE"
  | "BURN_ADDRESS"
  | "LIQUIDITY_ACCOUNT";

export interface WalletClassification {
  walletAddress: string;
  entityType: WalletEntityType;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  evidence: string[];
  unknowns: string[];
  classifiedAt: string;
}

export class WalletClassificationEngine {
  classify(
    walletAddress: string,
    entityType: WalletEntityType,
    confidence: WalletClassification["confidence"],
    evidence: string[] = [],
    unknowns: string[] = [],
  ): WalletClassification {
    return {
      walletAddress,
      entityType,
      confidence,
      evidence,
      unknowns,
      classifiedAt:
        new Date().toISOString(),
    };
  }

  classifyUnknown(
    walletAddress: string,
    reason: string,
  ): WalletClassification {
    return this.classify(
      walletAddress,
      "UNKNOWN",
      "LOW",
      [],
      [reason],
    );
  }
}