import { MarketData } from "./market-data";

export interface MarketDataSource {
  readonly name: string;

  getTokenData(tokenAddress: string): Promise<MarketData>;
}