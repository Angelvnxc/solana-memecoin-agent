import { MarketDataSource } from "../market/market-source";
import { MarketData } from "../market/market-data";

export interface OpportunityCandidate {
  tokenAddress: string;
  marketData: MarketData;
  reasons: string[];
}

export class OpportunityDiscovery {
  constructor(
    private readonly marketSource: MarketDataSource,
  ) {}

  async evaluateToken(
    tokenAddress: string,
  ): Promise<OpportunityCandidate | null> {
    const marketData =
      await this.marketSource.getTokenData(tokenAddress);

    const reasons: string[] = [];

    if (marketData.liquidity !== undefined) {
      reasons.push("Market liquidity data available");
    }

    if (marketData.volume24h !== undefined) {
      reasons.push("24-hour volume data available");
    }

    if (marketData.priceChange24h !== undefined) {
      reasons.push("24-hour price movement available");
    }

    if (reasons.length === 0) {
      return null;
    }

    return {
      tokenAddress,
      marketData,
      reasons,
    };
  }
}