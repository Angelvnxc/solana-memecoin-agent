import {
  TokenTransaction,
} from "./token-transaction";

import {
  TokenTransactionDirection,
  TokenTransactionObservation,
  TokenTransactionAnalysisEngine,
} from "./token-transaction-analysis";

import {
  SolanaTokenTransactionSource,
} from "./solana-token-transaction-source";

export interface TokenTransactionHistory {
  walletAddress: string;

  tokenAddress: string;

  transactions: TokenTransaction[];

  observations: TokenTransactionObservation[];

  buyCount: number;

  sellCount: number;

  receiveCount: number;

  sendCount: number;

  mixedCount: number;

  unknownCount: number;

  tokenAccumulation: number;

  tokenDistribution: number;

  nativeSpent: number;

  nativeReceived: number;

  observationsSummary: string[];

  risks: string[];

  unknowns: string[];

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  analyzedAt: string;
}

export class TokenTransactionHistoryEngine {
  private readonly analysisEngine =
    new TokenTransactionAnalysisEngine();

  constructor(
    private readonly transactionSource:
      SolanaTokenTransactionSource,
  ) {}

  async analyze(
    walletAddress: string,
    tokenAddress: string,
    signatures: string[],
  ): Promise<TokenTransactionHistory> {
    const transactions: TokenTransaction[] =
      [];

    const observations:
      TokenTransactionObservation[] =
      [];

    const risks: string[] = [];
    const unknowns: string[] = [];
    const observationsSummary: string[] =
      [];

    for (
      const signature of signatures
    ) {
      if (!signature) {
        continue;
      }

      const transaction =
        await this.transactionSource.getTransaction(
          signature,
          walletAddress,
          tokenAddress,
        );

      if (!transaction) {
        unknowns.push(
          `Transaction ${signature} could not be retrieved from Solana RPC.`,
        );

        continue;
      }

      transactions.push(
        transaction,
      );

      const tokenChange =
        transaction.tokenBalanceChanges.reduce(
          (
            total,
            change,
          ) =>
            total +
            change.amountChange,
          0,
        );

      const nativeChange =
        transaction.nativeBalanceChanges.reduce(
          (
            total,
            change,
          ) =>
            total +
            change.amountChange,
          0,
        );

      const hasSwapEvidence =
        this.hasSwapEvidence(
          transaction,
        );

      const nativeSpent =
        nativeChange < 0;

      const initialObservation =
        this.analysisEngine.classifyBalanceChange(
          signature,
          walletAddress,
          tokenAddress,
          tokenChange,
          nativeChange,
        );

      const refinedObservation =
        this.analysisEngine.refineDirection(
          initialObservation,
          hasSwapEvidence,
          nativeSpent,
        );

      observations.push(
        refinedObservation,
      );
    }

    const buyCount =
      this.countDirection(
        observations,
        "BUY",
      );

    const sellCount =
      this.countDirection(
        observations,
        "SELL",
      );

    const receiveCount =
      this.countDirection(
        observations,
        "RECEIVE",
      );

    const sendCount =
      this.countDirection(
        observations,
        "SEND",
      );

    const mixedCount =
      this.countDirection(
        observations,
        "MIXED",
      );

    const unknownCount =
      this.countDirection(
        observations,
        "UNKNOWN",
      );

    const tokenAccumulation =
      observations
        .filter(
          (observation) =>
            observation
              .tokenAmountChange !==
              undefined &&
            observation
              .tokenAmountChange > 0,
        )
        .reduce(
          (
            total,
            observation,
          ) =>
            total +
            (observation.tokenAmountChange ??
              0),
          0,
        );

    const tokenDistribution =
      observations
        .filter(
          (observation) =>
            observation
              .tokenAmountChange !==
              undefined &&
            observation
              .tokenAmountChange < 0,
        )
        .reduce(
          (
            total,
            observation,
          ) =>
            total +
            Math.abs(
              observation.tokenAmountChange ??
                0,
            ),
          0,
        );

    const nativeSpent =
      transactions
        .flatMap(
          (transaction) =>
            transaction.nativeBalanceChanges,
        )
        .filter(
          (change) =>
            change.amountChange < 0,
        )
        .reduce(
          (
            total,
            change,
          ) =>
            total +
            Math.abs(
              change.amountChange,
            ),
          0,
        );

    const nativeReceived =
      transactions
        .flatMap(
          (transaction) =>
            transaction.nativeBalanceChanges,
        )
        .filter(
          (change) =>
            change.amountChange > 0,
        )
        .reduce(
          (
            total,
            change,
          ) =>
            total +
            change.amountChange,
          0,
        );

    if (
      buyCount > 0
    ) {
      observationsSummary.push(
        `Detected ${buyCount} transaction(s) with evidence consistent with token purchases.`,
      );
    }

    if (
      sellCount > 0
    ) {
      observationsSummary.push(
        `Detected ${sellCount} transaction(s) with evidence consistent with token sales.`,
      );
    }

    if (
      receiveCount > 0
    ) {
      observationsSummary.push(
        `Detected ${receiveCount} token transfer-in transaction(s) that could not be classified as purchases.`,
      );
    }

    if (
      sendCount > 0
    ) {
      observationsSummary.push(
        `Detected ${sendCount} token transfer-out transaction(s) that could not be classified as sales.`,
      );
    }

    if (
      mixedCount > 0
    ) {
      unknowns.push(
        `${mixedCount} transaction(s) contain mixed or ambiguous balance evidence.`,
      );
    }

    if (
      unknownCount > 0
    ) {
      unknowns.push(
        `${unknownCount} transaction(s) could not be directionally classified.`,
      );
    }

    if (
      observations.length === 0
    ) {
      unknowns.push(
        "No token-specific transaction observations were successfully produced.",
      );
    }

    if (
      buyCount > 0 &&
      sellCount > 0
    ) {
      observationsSummary.push(
        "The wallet shows both accumulation and distribution activity during the analyzed transaction window.",
      );
    }

    if (
      tokenAccumulation > 0
    ) {
      observationsSummary.push(
        `Observed positive token balance changes total ${tokenAccumulation} token units.`,
      );
    }

    if (
      tokenDistribution > 0
    ) {
      observationsSummary.push(
        `Observed negative token balance changes total ${tokenDistribution} token units.`,
      );
    }

    const confidence =
      this.determineConfidence(
        observations,
      );

    if (
      confidence === "LOW"
    ) {
      risks.push(
        "Transaction direction confidence is low because available on-chain evidence does not consistently establish swap intent.",
      );
    }

    unknowns.push(
      "Native balance changes can include transaction fees and other SOL movements, so they are not by themselves proof of trade consideration.",
    );

    unknowns.push(
      "Program IDs identify accounts involved in the transaction but do not by themselves prove that a transaction was a swap.",
    );

    return {
      walletAddress,

      tokenAddress,

      transactions,

      observations,

      buyCount,

      sellCount,

      receiveCount,

      sendCount,

      mixedCount,

      unknownCount,

      tokenAccumulation,

      tokenDistribution,

      nativeSpent,

      nativeReceived,

      observationsSummary,

      risks,

      unknowns,

      confidence,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private hasSwapEvidence(
    transaction: TokenTransaction,
  ): boolean {
    return (
      transaction.programIds.length >
      1
    );
  }

  private countDirection(
    observations:
      TokenTransactionObservation[],
    direction:
      TokenTransactionDirection,
  ): number {
    return observations.filter(
      (observation) =>
        observation.direction ===
        direction,
    ).length;
  }

  private determineConfidence(
    observations:
      TokenTransactionObservation[],
  ):
    | "LOW"
    | "MEDIUM"
    | "HIGH" {
    if (
      observations.length === 0
    ) {
      return "LOW";
    }

    const mediumOrHigher =
      observations.filter(
        (observation) =>
          observation.confidence ===
            "MEDIUM" ||
          observation.confidence ===
            "HIGH",
      ).length;

    const ratio =
      mediumOrHigher /
      observations.length;

    if (
      ratio >= 0.75
    ) {
      return "HIGH";
    }

    if (
      ratio >= 0.4
    ) {
      return "MEDIUM";
    }

    return "LOW";
  }
}