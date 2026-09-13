import {
  TokenTransaction,
} from "./token-transaction";

export type SwapEvidenceLevel =
  | "NONE"
  | "WEAK"
  | "MODERATE"
  | "STRONG";

export interface SwapEvidence {
  detected: boolean;

  level: SwapEvidenceLevel;

  tokenAmountChange: number;

  nativeAmountChange: number;

  evidence: string[];

  contradictions: string[];

  unknowns: string[];

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  analyzedAt: string;
}

export class SwapEvidenceEngine {
  analyze(
    transaction: TokenTransaction,
  ): SwapEvidence {
    const evidence: string[] = [];
    const contradictions: string[] = [];
    const unknowns: string[] = [];

    const tokenAmountChange =
      transaction.tokenBalanceChanges.reduce(
        (total, change) =>
          total + change.amountChange,
        0,
      );

    const nativeAmountChange =
      transaction.nativeBalanceChanges.reduce(
        (total, change) =>
          total + change.amountChange,
        0,
      );

    if (
      !transaction.success
    ) {
      contradictions.push(
        "The transaction failed, so its balance changes should not be interpreted as a completed swap.",
      );

      return {
        detected: false,
        level: "NONE",
        tokenAmountChange,
        nativeAmountChange,
        evidence,
        contradictions,
        unknowns,
        confidence: "HIGH",
        analyzedAt:
          new Date().toISOString(),
      };
    }

    if (
      tokenAmountChange === 0
    ) {
      unknowns.push(
        "No analyzed token balance change was detected for the wallet.",
      );

      return {
        detected: false,
        level: "NONE",
        tokenAmountChange,
        nativeAmountChange,
        evidence,
        contradictions,
        unknowns,
        confidence: "HIGH",
        analyzedAt:
          new Date().toISOString(),
      };
    }

    if (
      transaction.programIds.length >
      0
    ) {
      evidence.push(
        `The transaction involved ${transaction.programIds.length} program/account address entries.`,
      );
    }

    if (
      tokenAmountChange > 0
    ) {
      evidence.push(
        "The wallet received the analyzed token during the transaction.",
      );
    }

    if (
      tokenAmountChange < 0
    ) {
      evidence.push(
        "The wallet sent the analyzed token during the transaction.",
      );
    }

    if (
      nativeAmountChange < 0
    ) {
      evidence.push(
        "The wallet's native SOL balance decreased during the transaction.",
      );
    }

    if (
      nativeAmountChange > 0
    ) {
      evidence.push(
        "The wallet's native SOL balance increased during the transaction.",
      );
    }

    unknowns.push(
      "Balance changes alone do not prove that the transaction was executed through a swap protocol.",
    );

    unknowns.push(
      "SOL balance changes may include transaction fees, rent, transfers, or other native-asset movements.",
    );

    unknowns.push(
      "The current transaction model does not yet decode swap instructions or identify a verified swap program.",
    );

    const hasTokenMovement =
      tokenAmountChange !== 0;

    const hasNativeMovement =
      nativeAmountChange !== 0;

    if (
      hasTokenMovement &&
      hasNativeMovement
    ) {
      return {
        detected: true,
        level: "WEAK",
        tokenAmountChange,
        nativeAmountChange,
        evidence,
        contradictions,
        unknowns,
        confidence: "LOW",
        analyzedAt:
          new Date().toISOString(),
      };
    }

    if (
      hasTokenMovement
    ) {
      return {
        detected: false,
        level: "WEAK",
        tokenAmountChange,
        nativeAmountChange,
        evidence,
        contradictions,
        unknowns,
        confidence: "LOW",
        analyzedAt:
          new Date().toISOString(),
      };
    }

    return {
      detected: false,
      level: "NONE",
      tokenAmountChange,
      nativeAmountChange,
      evidence,
      contradictions,
      unknowns,
      confidence: "LOW",
      analyzedAt:
        new Date().toISOString(),
    };
  }
}