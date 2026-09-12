export interface MarketActivity {
  volume24h?: number;

  transactionCount24h?: number;

  buyCount24h?: number;

  sellCount24h?: number;

  uniqueBuyers24h?: number;

  uniqueSellers24h?: number;

  buySellRatio?: number;

  observedAt: string;
}

export type MarketActivityQuality =
  | "UNKNOWN"
  | "LIMITED"
  | "PARTIAL"
  | "GOOD";

export interface MarketActivityAssessment {
  quality: MarketActivityQuality;

  observations: string[];

  uncertainties: string[];

  assessedAt: string;
}

export class MarketActivityEngine {
  assess(
    activity: MarketActivity,
  ): MarketActivityAssessment {
    const observations: string[] = [];
    const uncertainties: string[] = [];

    if (
      activity.volume24h ===
      undefined
    ) {
      uncertainties.push(
        "24-hour volume is unavailable.",
      );
    } else {
      observations.push(
        "24-hour volume is available.",
      );
    }

    if (
      activity.transactionCount24h ===
      undefined
    ) {
      uncertainties.push(
        "24-hour transaction count is unavailable.",
      );
    } else {
      observations.push(
        "24-hour transaction count is available.",
      );
    }

    if (
      activity.buyCount24h ===
      undefined ||
      activity.sellCount24h ===
      undefined
    ) {
      uncertainties.push(
        "Buy and sell transaction counts are incomplete.",
      );
    } else {
      observations.push(
        "Buy and sell transaction counts are available.",
      );
    }

    if (
      activity.uniqueBuyers24h ===
      undefined
    ) {
      uncertainties.push(
        "Unique buyer count is unavailable.",
      );
    }

    if (
      activity.uniqueSellers24h ===
      undefined
    ) {
      uncertainties.push(
        "Unique seller count is unavailable.",
      );
    }

    if (
      activity.buySellRatio !==
      undefined
    ) {
      observations.push(
        "Buy-to-sell activity ratio is available.",
      );
    }

    const quality =
      this.determineQuality(
        observations,
        uncertainties,
      );

    return {
      quality,
      observations,
      uncertainties,
      assessedAt: new Date().toISOString(),
    };
  }

  private determineQuality(
    observations: string[],
    uncertainties: string[],
  ): MarketActivityQuality {
    if (
      observations.length === 0
    ) {
      return "UNKNOWN";
    }

    if (
      uncertainties.length >= 4
    ) {
      return "LIMITED";
    }

    if (
      uncertainties.length >= 2
    ) {
      return "PARTIAL";
    }

    return "GOOD";
  }
}