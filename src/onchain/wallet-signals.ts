export type WalletSignalType =
  | "PROGRAM_OWNERSHIP"
  | "SYSTEM_OWNERSHIP"
  | "BURN_ADDRESS"
  | "KNOWN_EXCHANGE"
  | "LIQUIDITY_ASSOCIATION"
  | "MULTIPLE_TOKEN_ACCOUNTS"
  | "UNKNOWN";

export interface WalletSignal {
  walletAddress: string;
  type: WalletSignalType;
  statement: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  source: string;
  observedAt: string;
}

export class WalletSignalEngine {
  createSignal(
    walletAddress: string,
    type: WalletSignalType,
    statement: string,
    confidence: WalletSignal["confidence"],
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
}