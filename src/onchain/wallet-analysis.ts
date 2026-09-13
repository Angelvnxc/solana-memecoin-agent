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

  tokenAccountAddresses: string[];

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

    analysisNotes.push(
      `Wallet classification confidence is ${classification.confidence}.`,
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
      classification.unknowns.length > 0
    ) {
      unknowns.push(
        ...classification.unknowns,
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
      holder.tokenAccountCount > 1
    ) {
      analysisNotes.push(
        "The wallet controls multiple token accounts for this token.",
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

    if (
      classification.entityType ===
      "UNKNOWN"
    ) {
      risks.push(
        "The economic identity of this address is uncertain.",
      );
    }

    if (
      classification.entityType ===
      "EXCHANGE"
    ) {
      risks.push(
        "Exchange-held balances may represent aggregated custody and may not correspond to one individual holder.",
      );
    }

    if (
      classification.entityType ===
      "LIQUIDITY_ACCOUNT"
    ) {
      risks.push(
        "Liquidity-related balances should not automatically be interpreted as directional holder conviction.",
      );
    }

    if (
      classification.entityType ===
      "PROGRAM"
    ) {
      risks.push(
        "Program-controlled balances require separate interpretation because they may not represent discretionary ownership.",
      );
    }

    return {
      walletAddress:
        holder.walletAddress,

      tokenAmount:
        holder.tokenAmount,

      tokenAccountCount:
        holder.tokenAccountCount,

      tokenAccountAddresses:
        holder.tokenAccountAddresses,

      classification,

      analysisNotes,

      risks,

      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }
}