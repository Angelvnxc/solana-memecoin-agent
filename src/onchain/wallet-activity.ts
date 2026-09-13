export type WalletActivityDirection =
  | "ACCUMULATION"
  | "DISTRIBUTION"
  | "NEUTRAL"
  | "UNKNOWN";

export interface WalletActivityObservation {
  walletAddress: string;

  direction: WalletActivityDirection;

  tokenAmountChange?: number;

  transactionCount?: number;

  firstObservedAt?: string;

  lastObservedAt?: string;

  observations: string[];

  risks: string[];

  unknowns: string[];

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  observedAt: string;
}

export interface WalletActivitySource {
  getWalletActivity(
    walletAddress: string,
    tokenAddress: string,
  ): Promise<WalletActivityObservation>;
}

export class WalletActivityEngine {
  analyzeBalanceChange(
    walletAddress: string,
    tokenAmountChange: number,
  ): WalletActivityObservation {
    const observations: string[] = [];
    const risks: string[] = [];
    const unknowns: string[] = [];

    if (
      !Number.isFinite(
        tokenAmountChange,
      )
    ) {
      return {
        walletAddress,
        direction: "UNKNOWN",
        observations: [],
        risks: [],
        unknowns: [
          "The wallet balance change is unavailable or invalid.",
        ],
        confidence: "LOW",
        observedAt:
          new Date().toISOString(),
      };
    }

    if (
      tokenAmountChange > 0
    ) {
      observations.push(
        `Wallet token balance increased by ${tokenAmountChange} token units.`,
      );

      return {
        walletAddress,
        direction: "ACCUMULATION",
        tokenAmountChange,
        observations,
        risks,
        unknowns,
        confidence: "MEDIUM",
        observedAt:
          new Date().toISOString(),
      };
    }

    if (
      tokenAmountChange < 0
    ) {
      observations.push(
        `Wallet token balance decreased by ${Math.abs(tokenAmountChange)} token units.`,
      );

      return {
        walletAddress,
        direction: "DISTRIBUTION",
        tokenAmountChange,
        observations,
        risks,
        unknowns,
        confidence: "MEDIUM",
        observedAt:
          new Date().toISOString(),
      };
    }

    observations.push(
      "Wallet token balance did not change during the observed period.",
    );

    return {
      walletAddress,
      direction: "NEUTRAL",
      tokenAmountChange: 0,
      observations,
      risks,
      unknowns,
      confidence: "MEDIUM",
      observedAt:
        new Date().toISOString(),
    };
  }
}