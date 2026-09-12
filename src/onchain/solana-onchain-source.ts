import { OnChainDataSource } from "./onchain-source";
import { OnChainAnalysis } from "./onchain-analysis";

interface SolanaRpcResponse<T> {
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

export class SolanaOnChainSource implements OnChainDataSource {
  readonly name = "Solana RPC On-Chain Source";

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async analyzeToken(
    tokenAddress: string,
  ): Promise<OnChainAnalysis> {
    const supply = await this.getTokenSupply(tokenAddress);

    return {
      tokenAddress,

      holders: {},

      developer: {},

      wallets: {},

      liquidity: {},

      activity: {},

      risks: [],

      unknowns: [
        "Holder distribution analysis is not implemented yet",
        "Developer wallet analysis is not implemented yet",
        "Wallet behavior analysis is not implemented yet",
        "Liquidity behavior analysis is not implemented yet",
      ],
    };
  }

  private async getTokenSupply(
    tokenAddress: string,
  ): Promise<string | undefined> {
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [tokenAddress],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Solana RPC request failed: ${response.status}`,
      );
    }

    const data =
      (await response.json()) as SolanaRpcResponse<{
        value?: {
          amount?: string;
        };
      }>;

    if (data.error) {
      throw new Error(
        `Solana RPC error: ${data.error.message}`,
      );
    }

    return data.result?.value?.amount;
  }
}