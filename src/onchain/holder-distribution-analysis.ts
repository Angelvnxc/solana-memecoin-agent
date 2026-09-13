import {
  WalletAnalysis,
} from "./wallet-analysis";

export interface HolderDistributionAnalysis {
  totalWallets: number;
  totalTokenAmount: number;

  grossTop1Percentage?: number;
  grossTop5Percentage?: number;
  grossTop10Percentage?: number;

  classifiedTokenAmount: number;
  unknownTokenAmount: number;

  burnTokenAmount: number;
  exchangeTokenAmount: number;
  liquidityTokenAmount: number;
  programTokenAmount: number;

  economicallyUnclassifiedPercentage?: number;

  observations: string[];
  risks: string[];
  unknowns: string[];

  analyzedAt: string;
}

export class HolderDistributionAnalysisEngine {
  analyze(
    wallets: WalletAnalysis[],
    totalSupply: number,
  ): HolderDistributionAnalysis {
    const observations: string[] = [];
    const risks: string[] = [];
    const unknowns: string[] = [];

    const totalTokenAmount =
      wallets.reduce(
        (sum, wallet) =>
          sum + wallet.tokenAmount,
        0,
      );

    const burnTokenAmount =
      this.sumByEntity(
        wallets,
        "BURN_ADDRESS",
      );

    const exchangeTokenAmount =
      this.sumByEntity(
        wallets,
        "EXCHANGE",
      );

    const liquidityTokenAmount =
      this.sumByEntity(
        wallets,
        "LIQUIDITY_ACCOUNT",
      );

    const programTokenAmount =
      this.sumByEntity(
        wallets,
        "PROGRAM",
      );

    const classifiedTokenAmount =
      wallets
        .filter(
          (wallet) =>
            wallet.classification
              .entityType !==
            "UNKNOWN",
        )
        .reduce(
          (sum, wallet) =>
            sum + wallet.tokenAmount,
          0,
        );

    const unknownTokenAmount =
      wallets
        .filter(
          (wallet) =>
            wallet.classification
              .entityType ===
            "UNKNOWN",
        )
        .reduce(
          (sum, wallet) =>
            sum + wallet.tokenAmount,
          0,
        );

    const sortedWallets =
      [...wallets].sort(
        (a, b) =>
          b.tokenAmount -
          a.tokenAmount,
      );

    const grossTop1Percentage =
      this.calculatePercentage(
        this.sumTop(
          sortedWallets,
          1,
        ),
        totalSupply,
      );

    const grossTop5Percentage =
      this.calculatePercentage(
        this.sumTop(
          sortedWallets,
          5,
        ),
        totalSupply,
      );

    const grossTop10Percentage =
      this.calculatePercentage(
        this.sumTop(
          sortedWallets,
          10,
        ),
        totalSupply,
      );

    const economicallyUnclassifiedPercentage =
      this.calculatePercentage(
        unknownTokenAmount,
        totalSupply,
      );

    observations.push(
      `Analyzed ${wallets.length} wallet(s) containing ${totalTokenAmount} token units.`,
    );

    if (
      grossTop1Percentage !==
      undefined
    ) {
      observations.push(
        `The largest analyzed wallet represents approximately ${grossTop1Percentage.toFixed(2)}% of total token supply.`,
      );
    }

    if (
      grossTop10Percentage !==
      undefined
    ) {
      observations.push(
        `The largest 10 analyzed wallets represent approximately ${grossTop10Percentage.toFixed(2)}% of total token supply.`,
      );
    }

    if (
      burnTokenAmount > 0
    ) {
      observations.push(
        `${burnTokenAmount} token units are associated with addresses classified as burn addresses.`,
      );
    }

    if (
      exchangeTokenAmount > 0
    ) {
      observations.push(
        `${exchangeTokenAmount} token units are associated with addresses classified as exchanges.`,
      );
    }

    if (
      liquidityTokenAmount > 0
    ) {
      observations.push(
        `${liquidityTokenAmount} token units are associated with liquidity-related addresses.`,
      );
    }

    if (
      programTokenAmount > 0
    ) {
      observations.push(
        `${programTokenAmount} token units are associated with program-controlled addresses.`,
      );
    }

    if (
      grossTop10Percentage !==
        undefined &&
      grossTop10Percentage >= 50
    ) {
      risks.push(
        "The largest analyzed wallets control a substantial portion of the reported token supply.",
      );
    }

    if (
      grossTop1Percentage !==
        undefined &&
      grossTop1Percentage >= 20
    ) {
      risks.push(
        "The largest wallet has significant concentration relative to total token supply.",
      );
    }

    if (
      economicallyUnclassifiedPercentage !==
        undefined &&
      economicallyUnclassifiedPercentage >=
        20
    ) {
      risks.push(
        "A significant portion of the analyzed token balance belongs to addresses whose economic identity remains uncertain.",
      );
    }

    if (
      economicallyUnclassifiedPercentage !==
        undefined &&
      economicallyUnclassifiedPercentage > 0
    ) {
      unknowns.push(
        `${economicallyUnclassifiedPercentage.toFixed(2)}% of total token supply is associated with wallets that could not be economically classified.`,
      );
    }

    if (
      totalTokenAmount <
      totalSupply
    ) {
      unknowns.push(
        "The available holder dataset does not account for the entire token supply, so concentration and classification percentages should not be treated as a complete representation of all token holders.",
      );
    }

    if (
      wallets.length === 0
    ) {
      unknowns.push(
        "No wallet analysis records are available.",
      );
    }

    return {
      totalWallets:
        wallets.length,

      totalTokenAmount,

      grossTop1Percentage,

      grossTop5Percentage,

      grossTop10Percentage,

      classifiedTokenAmount,

      unknownTokenAmount,

      burnTokenAmount,

      exchangeTokenAmount,

      liquidityTokenAmount,

      programTokenAmount,

      economicallyUnclassifiedPercentage,

      observations,

      risks,

      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private sumByEntity(
    wallets: WalletAnalysis[],
    entityType:
      WalletAnalysis["classification"]["entityType"],
  ): number {
    return wallets
      .filter(
        (wallet) =>
          wallet.classification
            .entityType ===
          entityType,
      )
      .reduce(
        (sum, wallet) =>
          sum + wallet.tokenAmount,
        0,
      );
  }

  private sumTop(
    wallets: WalletAnalysis[],
    count: number,
  ): number {
    return wallets
      .slice(0, count)
      .reduce(
        (sum, wallet) =>
          sum + wallet.tokenAmount,
        0,
      );
  }

  private calculatePercentage(
    amount: number,
    totalSupply: number,
  ): number | undefined {
    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(totalSupply) ||
      totalSupply <= 0
    ) {
      return undefined;
    }

    return (
      (amount / totalSupply) *
      100
    );
  }
}