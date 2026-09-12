export interface HolderBalance {
  walletAddress: string;
  tokenAmount: number;
}

export interface HolderDistribution {
  totalHolders: number;

  topHolderPercentage?: number;
  top5Percentage?: number;
  top10Percentage?: number;

  observations: string[];
  unknowns: string[];

  analyzedAt: string;
}

export class HolderAnalysisEngine {
  analyze(
    holders: HolderBalance[],
    totalSupply?: number,
  ): HolderDistribution {
    const observations: string[] = [];
    const unknowns: string[] = [];

    if (holders.length === 0) {
      return {
        totalHolders: 0,
        observations: [],
        unknowns: [
          "No holder balances are available for analysis.",
        ],
        analyzedAt:
          new Date().toISOString(),
      };
    }

    const sortedHolders =
      [...holders].sort(
        (a, b) =>
          b.tokenAmount -
          a.tokenAmount,
      );

    let topHolderPercentage:
      | number
      | undefined;

    let top5Percentage:
      | number
      | undefined;

    let top10Percentage:
      | number
      | undefined;

    if (
      totalSupply !== undefined &&
      totalSupply > 0
    ) {
      topHolderPercentage =
        this.calculatePercentage(
          sortedHolders
            .slice(0, 1),
          totalSupply,
        );

      top5Percentage =
        this.calculatePercentage(
          sortedHolders
            .slice(0, 5),
          totalSupply,
        );

      top10Percentage =
        this.calculatePercentage(
          sortedHolders
            .slice(0, 10),
          totalSupply,
        );

      observations.push(
        "Holder concentration can be calculated from the available balances.",
      );
    } else {
      unknowns.push(
        "Total token supply is unavailable, so holder concentration cannot be calculated.",
      );
    }

    observations.push(
      `${holders.length} holder accounts were provided for analysis.`,
    );

    return {
      totalHolders:
        holders.length,

      topHolderPercentage,
      top5Percentage,
      top10Percentage,

      observations,
      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private calculatePercentage(
    holders: HolderBalance[],
    totalSupply: number,
  ): number {
    const amount =
      holders.reduce(
        (total, holder) =>
          total +
          holder.tokenAmount,
        0,
      );

    return (
      (amount / totalSupply) *
      100
    );
  }
}