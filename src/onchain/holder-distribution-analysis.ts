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
    totalSupply?: number,
  ): HolderDistributionAnalysis {
    const observations: string[] = [];
    const risks: string[] = [];
    const unknowns: string[] = [];

    const totalTokenAmount =
      wallets.reduce(
        (total, wallet) =>
          total + wallet.tokenAmount,
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
        sortedWallets.slice(0, 1),
        totalSupply,
      );

    const grossTop5Percentage =
      this.calculatePercentage(
        sortedWallets.slice(0, 5),
        totalSupply,
      );

    const grossTop10Percentage =
      this.calculatePercentage(
        sortedWallets.slice(0, 10),
        totalSupply,
      );

    let classifiedTokenAmount = 0;
    let unknownTokenAmount = 0;

    let burnTokenAmount = 0;
    let exchangeTokenAmount = 0;
    let liquidityTokenAmount = 0;
    let programTokenAmount = 0;

    for (const wallet of wallets) {
      switch (
        wallet.classification.entityType
      ) {
        case "BURN_ADDRESS":
          burnTokenAmount +=
            wallet.tokenAmount;

          classifiedTokenAmount +=
            wallet.tokenAmount;

          break;

        case "EXCHANGE":
          exchangeTokenAmount +=
            wallet.tokenAmount;

          classifiedTokenAmount +=
            wallet.tokenAmount;

          break;

        case "LIQUIDITY_ACCOUNT":
          liquidityTokenAmount +=
            wallet.tokenAmount;

          classifiedTokenAmount +=
            wallet.tokenAmount;

          break;

        case "PROGRAM":
          programTokenAmount +=
            wallet.tokenAmount;

          classifiedTokenAmount +=
            wallet.tokenAmount;

          break;

        default:
          unknownTokenAmount +=
            wallet.tokenAmount;

          break;
      }
    }

    if (
      totalSupply === undefined ||
      totalSupply <= 0
    ) {
      unknowns.push(
        "Total supply is unavailable, so distribution percentages cannot be normalized against total supply.",
      );
    }

    if (
      unknownTokenAmount > 0
    ) {
      unknowns.push(
        "Some wallet balances could not be assigned to a known entity type.",
      );
    }

    const economicallyUnclassifiedPercentage =
      this.calculateAmountPercentage(
        unknownTokenAmount,
        totalSupply,
      );

    observations.push(
      `${wallets.length} aggregated wallet(s) were analyzed.`,
    );

    observations.push(
      `${classifiedTokenAmount} token units are associated with classified entity types.`,
    );

    observations.push(
      `${unknownTokenAmount} token units remain associated with unknown entities.`,
    );

    if (
      grossTop10Percentage !== undefined
    ) {
      observations.push(
        `The largest ten wallets represent ${grossTop10Percentage.toFixed(2)}% of reported total supply.`,
      );
    }

    if (
      economicallyUnclassifiedPercentage !==
        undefined
    ) {
      observations.push(
        `${economicallyUnclassifiedPercentage.toFixed(2)}% of reported total supply remains economically unclassified.`,
      );
    }

    if (
      unknownTokenAmount > 0 &&
      totalSupply !== undefined
    ) {
      risks.push(
        "Wallet concentration includes balances whose economic identity has not yet been established.",
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

  private calculatePercentage(
    wallets: WalletAnalysis[],
    totalSupply?: number,
  ): number | undefined {
    if (
      totalSupply === undefined ||
      totalSupply <= 0
    ) {
      return undefined;
    }

    const amount =
      wallets.reduce(
        (total, wallet) =>
          total + wallet.tokenAmount,
        0,
      );

    return (
      (amount / totalSupply) *
      100
    );
  }

  private calculateAmountPercentage(
    amount: number,
    totalSupply?: number,
  ): number | undefined {
    if (
      totalSupply === undefined ||
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