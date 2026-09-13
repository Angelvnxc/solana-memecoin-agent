export type TokenTransactionDirection =
  | "BUY"
  | "SELL"
  | "RECEIVE"
  | "SEND"
  | "MIXED"
  | "UNKNOWN";

export interface TokenTransactionObservation {
  signature: string;

  walletAddress: string;

  tokenAddress: string;

  direction: TokenTransactionDirection;

  tokenAmountChange?: number;

  nativeAmountChange?: number;

  observations: string[];

  unknowns: string[];

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  observedAt: string;
}

export class TokenTransactionAnalysisEngine {
  classifyBalanceChange(
    signature: string,
    walletAddress: string,
    tokenAddress: string,
    tokenAmountChange: number,
    nativeAmountChange?: number,
  ): TokenTransactionObservation {
    const observations: string[] = [];
    const unknowns: string[] = [];

    if (
      !Number.isFinite(
        tokenAmountChange,
      )
    ) {
      return {
        signature,
        walletAddress,
        tokenAddress,
        direction: "UNKNOWN",
        observations: [],
        unknowns: [
          "Token balance change is unavailable or invalid.",
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
        `The wallet received ${tokenAmountChange} token units in the observed transaction.`,
      );

      unknowns.push(
        "A positive token balance change alone does not establish whether the tokens were purchased or transferred.",
      );

      return {
        signature,
        walletAddress,
        tokenAddress,
        direction: "RECEIVE",
        tokenAmountChange,
        nativeAmountChange,
        observations,
        unknowns,
        confidence: "LOW",
        observedAt:
          new Date().toISOString(),
      };
    }

    if (
      tokenAmountChange < 0
    ) {
      observations.push(
        `The wallet sent ${Math.abs(tokenAmountChange)} token units in the observed transaction.`,
      );

      unknowns.push(
        "A negative token balance change alone does not establish whether the tokens were sold or transferred.",
      );

      return {
        signature,
        walletAddress,
        tokenAddress,
        direction: "SEND",
        tokenAmountChange,
        nativeAmountChange,
        observations,
        unknowns,
        confidence: "LOW",
        observedAt:
          new Date().toISOString(),
      };
    }

    observations.push(
      "The wallet token balance did not change in the observed transaction.",
    );

    return {
      signature,
      walletAddress,
      tokenAddress,
      direction: "UNKNOWN",
      tokenAmountChange: 0,
      nativeAmountChange,
      observations,
      unknowns: [
        "No token balance change was detected for the wallet.",
      ],
      confidence: "MEDIUM",
      observedAt:
        new Date().toISOString(),
    };
  }

  refineDirection(
    observation: TokenTransactionObservation,
    hasSwapEvidence: boolean,
    nativeSpent: boolean,
  ): TokenTransactionObservation {
    if (
      !hasSwapEvidence
    ) {
      return observation;
    }

    if (
      observation.direction ===
        "RECEIVE" &&
      nativeSpent
    ) {
      return {
        ...observation,
        direction: "BUY",
        observations: [
          ...observation.observations,
          "The transaction contains swap evidence and the wallet spent native assets while receiving the analyzed token.",
        ],
        confidence: "MEDIUM",
      };
    }

    if (
      observation.direction ===
        "SEND" &&
      !nativeSpent
    ) {
      return {
        ...observation,
        direction: "SELL",
        observations: [
          ...observation.observations,
          "The transaction contains swap evidence and the wallet sent the analyzed token while receiving value from the swap.",
        ],
        confidence: "MEDIUM",
      };
    }

    return {
      ...observation,
      direction: "MIXED",
      unknowns: [
        ...observation.unknowns,
        "Available swap evidence does not unambiguously establish a simple buy or sell direction.",
      ],
    };
  }
}