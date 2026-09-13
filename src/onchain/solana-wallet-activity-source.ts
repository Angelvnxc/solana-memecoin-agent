import {
  WalletActivityObservation,
  WalletActivitySource,
} from "./wallet-activity";

interface SolanaRpcResponse<T> {
  result?: T;

  error?: {
    code: number;
    message: string;
  };
}

interface SignaturesForAddressResult {
  signature: string;
  slot: number;
  blockTime?: number | null;
  err?: unknown;
}

export class SolanaWalletActivitySource
  implements WalletActivitySource
{
  readonly name =
    "Solana RPC Wallet Activity Source";

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async getWalletActivity(
    walletAddress: string,
    tokenAddress: string,
  ): Promise<WalletActivityObservation> {
    const signatures =
      await this.getRecentSignatures(
        walletAddress,
      );

    const observations: string[] = [];
    const risks: string[] = [];
    const unknowns: string[] = [];

    if (
      signatures.length === 0
    ) {
      unknowns.push(
        "No recent transaction signatures were returned for this wallet.",
      );

      return {
        walletAddress,

        direction: "UNKNOWN",

        transactionCount: 0,

        observations,

        risks,

        unknowns,

        confidence: "LOW",

        observedAt:
          new Date().toISOString(),
      };
    }

    const successfulTransactions =
      signatures.filter(
        (item) =>
          item.err === null ||
          item.err === undefined,
      );

    const failedTransactions =
      signatures.length -
      successfulTransactions.length;

    observations.push(
      `Solana RPC returned ${signatures.length} recent transaction signature(s) for the wallet.`,
    );

    observations.push(
      `${successfulTransactions.length} transaction(s) were not marked as failed by the RPC response.`,
    );

    if (
      failedTransactions > 0
    ) {
      observations.push(
        `${failedTransactions} transaction(s) were marked as failed.`,
      );
    }

    unknowns.push(
      "Transaction signatures alone do not establish whether the wallet bought, sold, received, or transferred the token.",
    );

    unknowns.push(
      `Token-specific transaction interpretation for ${tokenAddress} requires transaction instruction and balance analysis.`,
    );

    return {
      walletAddress,

      direction: "UNKNOWN",

      transactionCount:
        signatures.length,

      firstObservedAt:
        this.toIsoTimestamp(
          signatures[
            signatures.length - 1
          ]?.blockTime,
        ),

      lastObservedAt:
        this.toIsoTimestamp(
          signatures[0]?.blockTime,
        ),

      observations,

      risks,

      unknowns,

      confidence: "LOW",

      observedAt:
        new Date().toISOString(),
    };
  }

  private async getRecentSignatures(
    walletAddress: string,
  ): Promise<
    SignaturesForAddressResult[]
  > {
    const response =
      await this.rpcRequest<
        SignaturesForAddressResult[]
      >(
        "getSignaturesForAddress",
        [
          walletAddress,
          {
            limit: 100,
          },
        ],
      );

    return response ?? [];
  }

  private toIsoTimestamp(
    blockTime:
      | number
      | null
      | undefined,
  ): string | undefined {
    if (
      blockTime === null ||
      blockTime === undefined
    ) {
      return undefined;
    }

    if (
      !Number.isFinite(blockTime)
    ) {
      return undefined;
    }

    return new Date(
      blockTime * 1000,
    ).toISOString();
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