import { OnChainDataSource } from "./onchain-source";
import { OnChainAnalysis } from "./onchain-analysis";
import {
  HolderAnalysisEngine,
  HolderBalance,
} from "./holder-analysis";
import {
  HolderAggregationEngine,
  HolderAccountBalance,
} from "./holder-aggregation";
import {
  WalletClassificationEngine,
} from "./wallet-classification";
import {
  WalletAnalysisEngine,
} from "./wallet-analysis";
import {
  HolderDistributionAnalysisEngine,
} from "./holder-distribution-analysis";
import {
  WalletSignalEngine,
} from "./wallet-signals";
import {
  SolanaAddressIdentitySource,
} from "./solana-address-identity-source";

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

  private readonly holderAggregationEngine =
    new HolderAggregationEngine();

  private readonly holderAnalysisEngine =
    new HolderAnalysisEngine();

  private readonly walletClassificationEngine =
    new WalletClassificationEngine();

  private readonly walletAnalysisEngine =
    new WalletAnalysisEngine();

  private readonly holderDistributionAnalysisEngine =
    new HolderDistributionAnalysisEngine();

  private readonly walletSignalEngine =
    new WalletSignalEngine();

  private readonly addressIdentitySource: SolanaAddressIdentitySource;

  constructor(
    private readonly rpcUrl: string,
  ) {
    this.addressIdentitySource =
      new SolanaAddressIdentitySource(
        this.rpcUrl,
      );
  }

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

    const accountBalances =
      this.extractHolderAccounts(
        tokenAccounts,
      );

    const aggregatedHolders =
      this.holderAggregationEngine.aggregate(
        accountBalances,
      );

    const walletAnalyses =
      await Promise.all(
        aggregatedHolders.map(
          async (holder) => {
            const signals =
              await this.collectWalletSignals(
                holder.walletAddress,
              );

            const classification =
              this.walletClassificationEngine.classify(
                holder.walletAddress,
                signals,
              );

            return this.walletAnalysisEngine.analyze(
              holder,
              classification,
            );
          },
        ),
      );

    const holders: HolderBalance[] =
      walletAnalyses.map(
        (wallet) => ({
          walletAddress:
            wallet.walletAddress,

          tokenAmount:
            wallet.tokenAmount,
        }),
      );

    const holderAnalysis =
      this.holderAnalysisEngine.analyze(
        holders,
        supply,
      );

    const distribution =
      this.holderDistributionAnalysisEngine.analyze(
        walletAnalyses,
        supply,
      );

    const risks: string[] = [
      ...distribution.risks,
    ];

    const unknowns: string[] = [
      ...holderAnalysis.unknowns,
      ...distribution.unknowns,
    ];

    for (
      const wallet of walletAnalyses
    ) {
      unknowns.push(
        ...wallet.unknowns,
      );
    }

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

      distribution,

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

  private async collectWalletSignals(
    walletAddress: string,
  ) {
    const signals = [];

    const identity =
      await this.addressIdentitySource.getAddressIdentity(
        walletAddress,
      );

    if (
      identity.type ===
      "PROGRAM_ACCOUNT"
    ) {
      signals.push(
        this.walletSignalEngine.createSignal(
          walletAddress,
          "PROGRAM_OWNERSHIP",
          "The Solana account is executable and is therefore associated with program code.",
          identity.confidence,
          "Solana RPC getAccountInfo",
        ),
      );
    }

    if (
      identity.type ===
      "SYSTEM_ACCOUNT"
    ) {
      signals.push(
        this.walletSignalEngine.createSignal(
          walletAddress,
          "SYSTEM_OWNERSHIP",
          "The Solana account is owned by the Solana System Program.",
          identity.confidence,
          "Solana RPC getAccountInfo",
        ),
      );
    }

    if (
      identity.type ===
      "TOKEN_ACCOUNT"
    ) {
      signals.push(
        this.walletSignalEngine.createSignal(
          walletAddress,
          "MULTIPLE_TOKEN_ACCOUNTS",
          "The address is owned by a Solana token program and should be interpreted as token-account infrastructure rather than automatically as an economically controlling wallet.",
          identity.confidence,
          "Solana RPC getAccountInfo",
        ),
      );
    }

    return signals;
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

  private extractHolderAccounts(
    accounts: TokenAccount[],
  ): HolderAccountBalance[] {
    const holders: HolderAccountBalance[] =
      [];

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