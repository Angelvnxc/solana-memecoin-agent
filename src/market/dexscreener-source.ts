import { MarketDataSource } from "./market-source";
import { MarketData } from "./market-data";

interface DexScreenerPair {
  baseToken?: {
    address?: string;
    symbol?: string;
    name?: string;
  };
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  volume?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
  priceChange?: {
    h24?: number;
  };
}

interface DexScreenerResponse {
  pairs?: DexScreenerPair[];
}

export class DexScreenerSource implements MarketDataSource {
  readonly name = "DexScreener";

  private readonly baseUrl = "https://api.dexscreener.com";

  async getTokenData(tokenAddress: string): Promise<MarketData> {
    const response = await fetch(
      `${this.baseUrl}/token-pairs/v1/solana/${tokenAddress}`,
    );

    if (!response.ok) {
      throw new Error(
        `DexScreener request failed: ${response.status}`,
      );
    }

    const data =
      (await response.json()) as DexScreenerPair[];

    const pair = this.selectBestPair(data);

    if (!pair) {
      throw new Error(
        `No Solana market pair found for ${tokenAddress}`,
      );
    }

    return {
      tokenAddress,
      symbol: pair.baseToken?.symbol,
      name: pair.baseToken?.name,
      price: this.toNumber(pair.priceUsd),
      marketCap: pair.marketCap,
      volume24h: pair.volume?.h24,
      liquidity: pair.liquidity?.usd,
      priceChange24h: pair.priceChange?.h24,
      timestamp: new Date().toISOString(),
    };
  }

  private selectBestPair(
    pairs: DexScreenerPair[],
  ): DexScreenerPair | undefined {
    return [...pairs]
      .filter((pair) => pair.liquidity?.usd !== undefined)
      .sort(
        (a, b) =>
          (b.liquidity?.usd ?? 0) -
          (a.liquidity?.usd ?? 0),
      )[0];
  }

  private toNumber(value?: string): number | undefined {
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }
}