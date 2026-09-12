import { MarketData } from "../market/market-data";

export type MarketContextStrength =
  | "WEAK"
  | "MODERATE"
  | "STRONG"
  | "UNKNOWN";

export interface MarketContext {
  tokenAddress: string;

  liquidityContext: string;
  volumeContext: string;
  priceMovementContext: string;
  marketCapContext: string;

  strength: MarketContextStrength;

  observations: string[];
  uncertainties: string[];

  createdAt: string;
}

export class MarketContextEngine {
  analyze(
    marketData: MarketData,
  ): MarketContext {
    const observations: string[] = [];
    const uncertainties: string[] = [];

    const liquidityContext =
      this.describeLiquidity(
        marketData,
        observations,
        uncertainties,
      );

    const volumeContext =
      this.describeVolume(
        marketData,
        observations,
        uncertainties,
      );

    const priceMovementContext =
      this.describePriceMovement(
        marketData,
        observations,
        uncertainties,
      );

    const marketCapContext =
      this.describeMarketCap(
        marketData,
        observations,
        uncertainties,
      );

    const strength =
      this.determineStrength(
        observations,
        uncertainties,
      );

    return {
      tokenAddress: marketData.tokenAddress,

      liquidityContext,
      volumeContext,
      priceMovementContext,
      marketCapContext,

      strength,

      observations,
      uncertainties,

      createdAt: new Date().toISOString(),
    };
  }

  private describeLiquidity(
    marketData: MarketData,
    observations: string[],
    uncertainties: string[],
  ): string {
    if (marketData.liquidity === undefined) {
      uncertainties.push(
        "Liquidity context cannot be assessed from the available market data.",
      );

      return "UNKNOWN";
    }

    if (marketData.liquidity <= 0) {
      observations.push(
        "Reported liquidity is zero or invalid.",
      );

      return "VERY_LOW";
    }

    observations.push(
      "Liquidity data is available for market context analysis.",
    );

    return "AVAILABLE";
  }

  private describeVolume(
    marketData: MarketData,
    observations: string[],
    uncertainties: string[],
  ): string {
    if (marketData.volume24h === undefined) {
      uncertainties.push(
        "24-hour volume context is unavailable.",
      );

      return "UNKNOWN";
    }

    if (marketData.volume24h <= 0) {
      observations.push(
        "Reported 24-hour volume is zero or very low.",
      );

      return "VERY_LOW";
    }

    observations.push(
      "24-hour volume data is available for market context analysis.",
    );

    return "AVAILABLE";
  }

  private describePriceMovement(
    marketData: MarketData,
    observations: string[],
    uncertainties: string[],
  ): string {
    if (
      marketData.priceChange24h ===
      undefined
    ) {
      uncertainties.push(
        "24-hour price movement is unavailable.",
      );

      return "UNKNOWN";
    }

    observations.push(
      "24-hour price movement is available for contextual analysis.",
    );

    if (marketData.priceChange24h > 0) {
      return "POSITIVE";
    }

    if (marketData.priceChange24h < 0) {
      return "NEGATIVE";
    }

    return "FLAT";
  }

  private describeMarketCap(
    marketData: MarketData,
    observations: string[],
    uncertainties: string[],
  ): string {
    if (marketData.marketCap === undefined) {
      uncertainties.push(
        "Market capitalization is unavailable.",
      );

      return "UNKNOWN";
    }

    if (marketData.marketCap <= 0) {
      observations.push(
        "Reported market capitalization is zero or invalid.",
      );

      return "INVALID";
    }

    observations.push(
      "Market capitalization is available for contextual analysis.",
    );

    return "AVAILABLE";
  }

  private determineStrength(
    observations: string[],
    uncertainties: string[],
  ): MarketContextStrength {
    if (observations.length === 0) {
      return "UNKNOWN";
    }

    if (uncertainties.length >= 3) {
      return "WEAK";
    }

    if (uncertainties.length === 2) {
      return "MODERATE";
    }

    if (uncertainties.length <= 1) {
      return "STRONG";
    }

    return "UNKNOWN";
  }
}