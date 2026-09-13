import {
  OnChainAnalysis,
} from "./onchain-analysis";

import {
  HolderAnalysisEngine,
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
  WalletSignalEngine,
} from "./wallet-signals";

import {
  HolderDistributionAnalysisEngine,
} from "./holder-distribution-analysis";

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
    decimals?: number;
  };
}

interface TokenAccount {
  pubkey?: string;

  account?: {
    data?: {
      parsed?: {
        info?: {
          owner?: string;

          tokenAmount?: {
            amount?: string;
            decimals?: number;
            uiAmount?: number | null;
          };
        };
      };
    };
  };
}

interface TokenAccountsResult {
  value?: TokenAccount[];
}

export class SolanaOnChainSource {
  readonly name =
    "Solana RPC On-Chain Source";

  private readonly holderAnalysisEngine =
    new HolderAnalysisEngine();

  private readonly holderAggregationEngine =
    new HolderAggregationEngine();

  private readonly walletClassificationEngine =
    new WalletClassificationEngine();

  private readonly walletAnalysisEngine =
    new WalletAnalysisEngine();

  private readonly walletSignalEngine =
    new WalletSignalEngine();

  private readonly holderDistributionAnalysisEngine =
    new HolderDistributionAnalysisEngine();

  private readonly addressIdentitySource:
    SolanaAddressIdentitySource;

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
    const risks: string[] = [];
    const unknowns: string[] = [];

    const supply =
      await this.getTokenSupply(
        tokenAddress,
      );

    const accounts =
      await this.getTokenAccounts(
        tokenAddress,
      );

    const holders =
      this.extractHolderAccounts(
        accounts,
      );

    const aggregatedHolders =
      this.holderAggregationEngine.aggregate(
        holders,
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

    const holderDistribution =
      this.holderAnalysisEngine.analyze(
        holders,
        supply,
      );

    const distribution =
      this.holderDistributionAnalysisEngine.analyze(
        walletAnalyses,
        supply,
      );

    unknowns.push(
      "Historical transaction analysis is not implemented yet.",
    );

    unknowns.push(
      "Buyer and seller flow analysis is not implemented yet.",
    );

    unknowns.push(
      "Developer wallet identification is not implemented yet.",
    );

    unknowns.push(
      "Liquidity provider analysis is not implemented yet.",
    );

    return {
      tokenAddress,

      holders: {
        total:
          aggregatedHolders.length,
      },

      distribution,

      developer: {},

      wallets: {
        notableWallets:
          walletAnalyses
            .filter(
              (wallet) =>
                wallet.classification
                  .entityType !==
                "UNKNOWN",
            )
            .map(
              (wallet) =>
                wallet.walletAddress,
            ),
      },

      liquidity: {},

      activity: {},

      risks,

      unknowns,
    };
  }

  private extractHolderAccounts(
    accounts: TokenAccount[],
  ): HolderAccountBalance[] {
    const holders:
      HolderAccountBalance[] = [];

    for (const account of accounts) {
      const info =
        account.account?.data?.parsed?.info;

      const owner =
        info?.owner;

      const amount =
        info?.tokenAmount?.amount;

      if (
        !account.pubkey ||
        !owner ||
        !amount
      ) {
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
        tokenAccountAddress:
          account.pubkey,

        walletAddress:
          owner,

        tokenAmount,
      });
    }

    return holders;
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
  ): Promise<number> {
    const response =
      await this.rpcRequest<TokenSupplyResult>(
        "getTokenSupply",
        [tokenAddress],
      );

    const amount =
      response?.value?.amount;

    if (!amount) {
      return 0;
    }

    const tokenAmount =
      Number(amount);

    if (
      !Number.isFinite(tokenAmount) ||
      tokenAmount < 0
    ) {
      return 0;
    }

    return tokenAmount;
  }

  private async getTokenAccounts(
    tokenAddress: string,
  ): Promise<TokenAccount[]> {
    const response =
      await this.rpcRequest<TokenAccountsResult>(
        "getTokenLargestAccounts",
        [tokenAddress],
      );

    return response?.value ?? [];
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