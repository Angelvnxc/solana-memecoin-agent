import {
  TokenTransaction,
  TokenBalanceChange,
  NativeBalanceChange,
} from "./token-transaction";

import {
  TransactionProgramAnalysis,
  TransactionProgramAnalysisEngine,
} from "./transaction-program-analysis";

import {
  TransactionInstructionAnalysis,
  TransactionInstructionAnalysisEngine,
} from "./transaction-instruction-analysis";

interface SolanaRpcResponse<T> {
  result?: T;

  error?: {
    code: number;
    message: string;
  };
}

interface ParsedTokenBalance {
  accountIndex?: number;

  mint?: string;

  owner?: string;

  uiTokenAmount?: {
    uiAmount?: number | null;
  };
}

interface ParsedInstruction {
  programId?: string;

  program?: string;

  parsed?: {
    type?: string;

    info?: unknown;
  };
}

interface InnerInstructionGroup {
  instructions?: ParsedInstruction[];
}

interface ParsedTransactionMeta {
  err?: unknown;

  fee?: number;

  preBalances?: number[];

  postBalances?: number[];

  preTokenBalances?: ParsedTokenBalance[];

  postTokenBalances?: ParsedTokenBalance[];

  innerInstructions?:
    | InnerInstructionGroup[]
    | null;
}

interface ParsedTransactionMessage {
  accountKeys?: Array<
    string | {
      pubkey?: string;
    }
  >;

  instructions?: ParsedInstruction[];
}

interface ParsedTransaction {
  slot?: number;

  blockTime?: number | null;

  transaction?: {
    message?: ParsedTransactionMessage;
  };

  meta?: ParsedTransactionMeta;
}

export interface ParsedTokenTransaction {
  transaction: TokenTransaction;

  programAnalysis:
    TransactionProgramAnalysis;

  instructionAnalysis:
    TransactionInstructionAnalysis;
}

export class SolanaTokenTransactionSource {
  readonly name =
    "Solana RPC Token Transaction Source";

  private readonly programAnalysisEngine =
    new TransactionProgramAnalysisEngine();

  private readonly instructionAnalysisEngine =
    new TransactionInstructionAnalysisEngine();

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async getTransaction(
    signature: string,
    walletAddress: string,
    tokenAddress: string,
  ): Promise<
    ParsedTokenTransaction | undefined
  > {
    const rpcTransaction =
      await this.rpcRequest<ParsedTransaction>(
        "getTransaction",
        [
          signature,
          {
            encoding: "jsonParsed",

            maxSupportedTransactionVersion:
              0,
          },
        ],
      );

    if (!rpcTransaction) {
      return undefined;
    }

    const tokenBalanceChanges =
      this.extractTokenBalanceChanges(
        rpcTransaction,
        walletAddress,
        tokenAddress,
      );

    const nativeBalanceChanges =
      this.extractNativeBalanceChanges(
        rpcTransaction,
        walletAddress,
      );

    const programAnalysis =
      this.programAnalysisEngine.analyze(
        {
          instructions:
            rpcTransaction
              .transaction
              ?.message
              ?.instructions,

          innerInstructions:
            rpcTransaction
              .meta
              ?.innerInstructions,
        },
      );

    const instructionAnalysis =
      this.instructionAnalysisEngine.analyze(
        {
          instructions:
            rpcTransaction
              .transaction
              ?.message
              ?.instructions,

          innerInstructions:
            rpcTransaction
              .meta
              ?.innerInstructions,
        },
      );

    const transaction:
      TokenTransaction = {
      signature,

      slot:
        rpcTransaction.slot ?? 0,

      blockTime:
        this.toIsoTimestamp(
          rpcTransaction.blockTime,
        ),

      walletAddress,

      tokenAddress,

      tokenBalanceChanges,

      nativeBalanceChanges,

      programIds:
        programAnalysis.uniqueProgramIds,

      success:
        !rpcTransaction.meta?.err,

      observedAt:
        new Date().toISOString(),
    };

    return {
      transaction,

      programAnalysis,

      instructionAnalysis,
    };
  }

  private extractTokenBalanceChanges(
    transaction: ParsedTransaction,
    walletAddress: string,
    tokenAddress: string,
  ): TokenBalanceChange[] {
    const pre =
      transaction.meta
        ?.preTokenBalances ?? [];

    const post =
      transaction.meta
        ?.postTokenBalances ?? [];

    const changes =
      new Map<
        string,
        {
          amountBefore: number;

          amountAfter: number;
        }
      >();

    for (
      const balance of pre
    ) {
      if (
        balance.mint !==
          tokenAddress ||
        balance.owner !==
          walletAddress
      ) {
        continue;
      }

      const key =
        `${balance.owner ?? ""}:${balance.accountIndex ?? -1}`;

      const amount =
        balance.uiTokenAmount
          ?.uiAmount ?? 0;

      changes.set(
        key,
        {
          amountBefore:
            amount,

          amountAfter:
            0,
        },
      );
    }

    for (
      const balance of post
    ) {
      if (
        balance.mint !==
          tokenAddress ||
        balance.owner !==
          walletAddress
      ) {
        continue;
      }

      const key =
        `${balance.owner ?? ""}:${balance.accountIndex ?? -1}`;

      const amount =
        balance.uiTokenAmount
          ?.uiAmount ?? 0;

      const existing =
        changes.get(key);

      if (existing) {
        existing.amountAfter =
          amount;
      } else {
        changes.set(
          key,
          {
            amountBefore:
              0,

            amountAfter:
              amount,
          },
        );
      }
    }

    return [
      ...changes.values(),
    ].map(
      (change) => ({
        ownerAddress:
          walletAddress,

        tokenAddress,

        amountBefore:
          change.amountBefore,

        amountAfter:
          change.amountAfter,

        amountChange:
          change.amountAfter -
          change.amountBefore,
      }),
    );
  }

  private extractNativeBalanceChanges(
    transaction: ParsedTransaction,
    walletAddress: string,
  ): NativeBalanceChange[] {
    const pre =
      transaction.meta
        ?.preBalances ?? [];

    const post =
      transaction.meta
        ?.postBalances ?? [];

    const accountKeys =
      this.extractAccountKeys(
        transaction,
      );

    const walletIndexes =
      accountKeys
        .map(
          (
            address,
            index,
          ) => ({
            address,
            index,
          }),
        )
        .filter(
          (account) =>
            account.address ===
            walletAddress,
        )
        .map(
          (account) =>
            account.index,
        );

    return walletIndexes
      .map((index) => {
        const amountBefore =
          pre[index] ?? 0;

        const amountAfter =
          post[index] ?? 0;

        return {
          address:
            walletAddress,

          amountBefore,

          amountAfter,

          amountChange:
            amountAfter -
            amountBefore,
        };
      })
      .filter(
        (change) =>
          change.amountChange !==
          0,
      );
  }

  private extractAccountKeys(
    transaction: ParsedTransaction,
  ): string[] {
    const accountKeys =
      transaction.transaction
        ?.message
        ?.accountKeys ?? [];

    return accountKeys
      .map((account) => {
        if (
          typeof account ===
          "string"
        ) {
          return account;
        }

        return account.pubkey;
      })
      .filter(
        (
          address,
        ): address is string =>
          Boolean(address),
      );
  }

  private toIsoTimestamp(
    blockTime:
      | number
      | null
      | undefined,
  ): string | undefined {
    if (
      blockTime ===
        null ||
      blockTime ===
        undefined ||
      !Number.isFinite(
        blockTime,
      )
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