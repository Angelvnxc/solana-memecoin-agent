import {
  WalletSignal,
} from "./wallet-signals";

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

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  evidence: WalletSignal[];

  unknowns: string[];

  classifiedAt: string;
}

export class WalletClassificationEngine {
  classify(
    walletAddress: string,
    signals: WalletSignal[],
  ): WalletClassification {
    if (!walletAddress) {
      return {
        walletAddress,
        entityType: "UNKNOWN",
        confidence: "LOW",
        evidence: [],
        unknowns: [
          "Wallet address is missing.",
        ],
        classifiedAt:
          new Date().toISOString(),
      };
    }

    if (signals.length === 0) {
      return this.classifyUnknown(
        walletAddress,
        "No wallet classification signals are available.",
      );
    }

    const groupedSignals =
      this.groupSignals(signals);

    const priorityOrder:
      WalletEntityType[] = [
        "BURN_ADDRESS",
        "PROGRAM",
        "EXCHANGE",
        "LIQUIDITY_ACCOUNT",
      ];

    for (
      const entityType of priorityOrder
    ) {
      const matchingSignals =
        groupedSignals.get(
          entityType,
        );

      if (
        matchingSignals &&
        matchingSignals.length > 0
      ) {
        return {
          walletAddress,

          entityType,

          confidence:
            this.determineConfidence(
              matchingSignals,
            ),

          evidence:
            matchingSignals,

          unknowns: [],

          classifiedAt:
            new Date().toISOString(),
        };
      }
    }

    return this.classifyPersonalOrUnknown(
      walletAddress,
      signals,
    );
  }

  classifyUnknown(
    walletAddress: string,
    reason: string,
  ): WalletClassification {
    return {
      walletAddress,

      entityType: "UNKNOWN",

      confidence: "LOW",

      evidence: [],

      unknowns: [
        reason,
      ],

      classifiedAt:
        new Date().toISOString(),
    };
  }

  private classifyPersonalOrUnknown(
    walletAddress: string,
    signals: WalletSignal[],
  ): WalletClassification {
    const unknowns: string[] = [];

    const hasSystemOwnership =
      signals.some(
        (signal) =>
          signal.type ===
          "SYSTEM_OWNERSHIP",
      );

    const hasMultipleTokenAccounts =
      signals.some(
        (signal) =>
          signal.type ===
          "MULTIPLE_TOKEN_ACCOUNTS",
      );

    if (hasSystemOwnership) {
      unknowns.push(
        "The address is owned by the Solana System Program, which is consistent with a standard wallet account but does not independently prove who controls the wallet.",
      );
    }

    if (
      hasMultipleTokenAccounts
    ) {
      unknowns.push(
        "Token-account evidence describes account infrastructure but does not independently establish the economic identity of the controller.",
      );
    }

    /*
     * A System Program-owned address without
     * stronger contradictory evidence is treated
     * as a probable personal wallet.
     *
     * This is intentionally not HIGH confidence.
     */
    if (
      hasSystemOwnership &&
      !hasMultipleTokenAccounts
    ) {
      return {
        walletAddress,

        entityType:
          "PERSONAL_WALLET",

        confidence: "MEDIUM",

        evidence: signals,

        unknowns,

        classifiedAt:
          new Date().toISOString(),
      };
    }

    /*
     * If the available evidence does not
     * establish economic identity, remain
     * UNKNOWN instead of guessing.
     */
    if (
      unknowns.length === 0
    ) {
      unknowns.push(
        "Available signals do not provide enough evidence to determine the economic identity of the address.",
      );
    }

    return {
      walletAddress,

      entityType: "UNKNOWN",

      confidence: "LOW",

      evidence: signals,

      unknowns,

      classifiedAt:
        new Date().toISOString(),
    };
  }

  private groupSignals(
    signals: WalletSignal[],
  ): Map<
    WalletEntityType,
    WalletSignal[]
  > {
    const groups =
      new Map<
        WalletEntityType,
        WalletSignal[]
      >();

    for (
      const signal of signals
    ) {
      const entityType =
        this.signalToEntityType(
          signal,
        );

      if (
        entityType ===
        "UNKNOWN"
      ) {
        continue;
      }

      const existing =
        groups.get(
          entityType,
        );

      if (existing) {
        existing.push(signal);
      } else {
        groups.set(
          entityType,
          [signal],
        );
      }
    }

    return groups;
  }

  private signalToEntityType(
    signal: WalletSignal,
  ): WalletEntityType {
    switch (signal.type) {
      case "PROGRAM_OWNERSHIP":
        return "PROGRAM";

      case "BURN_ADDRESS":
        return "BURN_ADDRESS";

      case "KNOWN_EXCHANGE":
        return "EXCHANGE";

      case "LIQUIDITY_ASSOCIATION":
        return "LIQUIDITY_ACCOUNT";

      default:
        return "UNKNOWN";
    }
  }

  private determineConfidence(
    signals: WalletSignal[],
  ):
    | "LOW"
    | "MEDIUM"
    | "HIGH" {
    const highConfidence =
      signals.filter(
        (signal) =>
          signal.confidence ===
          "HIGH",
      ).length;

    const mediumConfidence =
      signals.filter(
        (signal) =>
          signal.confidence ===
          "MEDIUM",
      ).length;

    if (
      highConfidence >= 2
    ) {
      return "HIGH";
    }

    if (
      highConfidence >= 1 ||
      mediumConfidence >= 2
    ) {
      return "MEDIUM";
    }

    return "LOW";
  }
}