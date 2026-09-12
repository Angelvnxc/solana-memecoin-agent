import {
  AggregatedHolderBalance,
} from "./holder-aggregation";

import {
  WalletClassification,
} from "./wallet-classification";

export interface WalletAnalysis {
  walletAddress: string;
  tokenAmount: number;
  tokenAccountCount: number;

  classification: WalletClassification;

  analysisNotes: string[];
  risks: string[];
  unknowns: string[];

  analyzedAt: string;
}

export class WalletAnalysisEngine {
  analyze(
    holder: AggregatedHolderBalance,
    classification: WalletClassification,
  ): WalletAnalysis {
    const analysisNotes: string[] = [];
    const risks: string[] = [];
    const unknowns: string[] = [];

    analysisNotes.push(
      `Wallet holds ${holder.tokenAmount} token units across ${holder.tokenAccountCount} token account(s).`,
    );

    analysisNotes.push(
      `Wallet entity classification is ${classification.entityType}.`,
    );

    if (
      classification.entityType ===
      "UNKNOWN"
    ) {
      unknowns.push(
        "The wallet entity type could not be determined from the available evidence.",
      );
    }

    if (
      classification.confidence ===
      "LOW"
    ) {
      unknowns.push(
        "Wallet classification confidence is low.",
      );
    }

    if (
      classification.entityType ===
      "BURN_ADDRESS"
    ) {
      analysisNotes.push(
        "This balance should be interpreted separately from economically active holder balances.",
      );
    }

    if (
      classification.entityType ===
      "LIQUIDITY_ACCOUNT"
    ) {
      analysisNotes.push(
        "This balance may represent liquidity-related infrastructure rather than a conventional holder.",
      );
    }

    if (
      classification.entityType ===
      "EXCHANGE"
    ) {
      analysisNotes.push(
        "This balance may represent exchange custody rather than a single controlling trader.",
      );
    }

    if (
      classification.entityType ===
      "PROGRAM"
    ) {
      analysisNotes.push(
        "This balance is associated with a program-controlled address and should not automatically be interpreted as personal ownership.",
      );
    }

    return {
      walletAddress:
        holder.walletAddress,

      tokenAmount:
        holder.tokenAmount,

      tokenAccountCount:
        holder.tokenAccountCount,

      classification,

      analysisNotes,
      risks,
      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }
}