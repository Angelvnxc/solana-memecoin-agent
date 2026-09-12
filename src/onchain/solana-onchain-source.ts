import { OnChainDataSource } from "./onchain-source";
import { OnChainAnalysis } from "./onchain-analysis";

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

    const uniqueOwners =
      this.extractUniqueOwners(
        tokenAccounts,
      );

    const risks: string[] = [];
    const unknowns: string[] = [];

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

    return {
      tokenAddress,

      holders: {
        total:
          uniqueOwners.size,
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

      unknowns: [
        ...unknowns,

        "Historical transaction activity is not implemented yet.",
        "Buyer and seller classification is not implemented yet.",
        "Developer wallet identification is not implemented yet.",
        "Liquidity provider identification is not implemented yet.",
      ],
    };
  }

  private async getTokenSupply(
    tokenAddress: string,
  ): Promise<string | undefined> {
    const response =
      await this.rpcRequest<TokenSupplyResult>(
        "getTokenSupply",
        [tokenAddress],
      );

    return response?.value?.amount;
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

  private extractUniqueOwners(
    accounts: TokenAccount[],
  ): Set<string> {
    const owners = new Set<string>();

    for (const account of accounts) {
      const owner =
        account.account?.data?.parsed?.info
          ?.owner;

      if (owner) {
        owners.add(owner);
      }
    }

    return owners;
  }

  private async rpcRequest<T>(
    method: string,
    params: unknown[],
  ): Promise<T | undefined> {
    const response = await fetch(
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