export interface MarketData {
  tokenAddress: string;
  symbol?: string;
  name?: string;

  price?: number;
  marketCap?: number;
  volume24h?: number;
  liquidity?: number;

  priceChange24h?: number;

  timestamp: string;
}