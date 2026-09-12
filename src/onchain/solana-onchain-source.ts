import { OnChainDataSource } from "./onchain-source";
import { OnChainAnalysis } from "./onchain-analysis";
import {
  HolderAnalysisEngine,
  HolderBalance,
} from "./holder-analysis";

interface SolanaRpcResponse<T> {
  result?: T;

  error?: {
    code: number;
    message: string;
  };
}

interface TokenSupplyResult {
  value?: {
    amount?: string;
  };
}

interface TokenAccount {
  pubkey: string;

  account?: {
    data?: {
      parsed?: {
        info?: {
          owner?: string;

          tokenAmount?: {
            amount?: string;
          };
        };
      };
    };
  };
}

interface TokenAccountsResult {
  value?: TokenAccount[];
}

export class SolanaOnChainSource
  implements OnChainDataSource
{
  readonly name =
    "Solana RPC On-Chain Source";

  private readonly holderAnalysisEngine =
    new HolderAnalysisEngine();

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async analyzeToken(
    tokenAddress: string,
  ): Promise<OnChainAnalysis> {
    const supply =
      await this.getTokenSupply(
        tokenAddress,
      );

    const tokenAccounts =
      await this.getTokenAccounts(
        tokenAddress,
      );

    const holders =
      this.extractHolderBalances(
        tokenAccounts,
      );

    const holderAnalysis =
      this.holderAnalysisEngine.analyze(
        holders,
        supply,
      );

    const risks: string[] = [];
    const unknowns: string[] = [
      ...holderAnalysis.unknowns,
    ];

    if (
      supply === undefined
    ) {
      unknowns.push(
        "Token supply could not be determined.",
      );
    }

    if (
      tokenAccounts.length === 0
    ) {
      unknowns.push(
        "No token accounts were returned by the RPC source.",
      );
    }

    unknowns.push(
      "Historical transaction activity is not implemented yet.",
    );

    unknowns.push(
      "Buyer and seller classification is not implemented yet.",
    );

    unknowns.push(
      "Developer wallet identification is not implemented yet.",
    );

    unknowns.push(
      "Liquidity provider identification is not implemented yet.",
    );

    return {
      tokenAddress,

      holders: {
        total:
          holderAnalysis.totalHolders,

        topHolderConcentration:
          holderAnalysis.topHolderPercentage,

        top10Concentration:
          holderAnalysis.top10Percentage,
      },

      developer: {},

      wallets: {},

      liquidity: {},

      activity: {
        uniqueWallets24h:
          undefined,

        transactionCount24h:
          undefined,

        buyerSellerBalance:
          undefined,
      },

      risks,

      unknowns,
    };
  }

  private async getTokenSupply(
    tokenAddress: string,
  ): Promise<number | undefined> {
    const response =
      await this.rpcRequest<TokenSupplyResult>(
        "getTokenSupply",
        [tokenAddress],
      );

    const amount =
      response?.value?.amount;

    if (!amount) {
      return undefined;
    }

    const parsed =
      Number(amount);

    return Number.isFinite(parsed)
      ? parsed
      : undefined;
  }

  private async getTokenAccounts(
    tokenAddress: string,
  ): Promise<TokenAccount[]> {
    const response =
      await this.rpcRequest<TokenAccountsResult>(
        "getTokenAccountsByMint",
        [
          tokenAddress,
          {
            encoding: "jsonParsed",
          },
        ],
      );

    return response?.value ?? [];
  }

  private extractHolderBalances(
    accounts: TokenAccount[],
  ): HolderBalance[] {
    const holders: HolderBalance[] = [];

    for (const account of accounts) {
      const info =
        account.account?.data?.parsed?.info;

      const owner =
        info?.owner;

      const amount =
        info?.tokenAmount?.amount;

      if (!owner || !amount) {
        continue;
      }

      const tokenAmount =
        Number(amount);

      if (
        !Number.isFinite(tokenAmount) ||
        tokenAmount <= 0
      ) {
        continue;
      }

      holders.push({
        walletAddress: owner,
        tokenAmount,
      });
    }

    return holders;
  }

  private async rpcRequest<T>(
    method: string,
    params: unknown[],
  ): Promise<T | undefined> {
    const response =
      await fetch(
        this.rpcUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params,
          }),
        },
      );

    if (!response.ok) {
      throw new Error(
        `Solana RPC request failed: ${response.status}`,
      );
    }

    const data =
      (await response.json()) as SolanaRpcResponse<T>;

    if (data.error) {
      throw new Error(
        `Solana RPC error: ${data.error.message}`,
      );
    }

    return data.result;
  }
}