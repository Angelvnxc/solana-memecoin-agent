export type WalletSignalType =
  | "PROGRAM_OWNERSHIP"
  | "SYSTEM_OWNERSHIP"
  | "BURN_ADDRESS"
  | "KNOWN_EXCHANGE"
  | "LIQUIDITY_ASSOCIATION"
  | "MULTIPLE_TOKEN_ACCOUNTS"
  | "UNKNOWN";

export type WalletSignalConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface WalletSignal {
  walletAddress: string;
  type: WalletSignalType;
  statement: string;
  confidence: WalletSignalConfidence;
  source: string;
  observedAt: string;
}

export interface WalletSignalEvidence {
  type: WalletSignalType;
  statement: string;
  confidence: WalletSignalConfidence;
  source: string;
}

export class WalletSignalEngine {
  createSignal(
    walletAddress: string,
    type: WalletSignalType,
    statement: string,
    confidence: WalletSignalConfidence,
    source: string,
  ): WalletSignal {
    return {
      walletAddress,
      type,
      statement,
      confidence,
      source,
      observedAt:
        new Date().toISOString(),
    };
  }

  createUnknownSignal(
    walletAddress: string,
    statement: string,
    source: string,
  ): WalletSignal {
    return this.createSignal(
      walletAddress,
      "UNKNOWN",
      statement,
      "LOW",
      source,
    );
  }

  createSignals(
    walletAddress: string,
    evidence: WalletSignalEvidence[],
  ): WalletSignal[] {
    return evidence.map(
      (item) =>
        this.createSignal(
          walletAddress,
          item.type,
          item.statement,
          item.confidence,
          item.source,
        ),
    );
  }
}