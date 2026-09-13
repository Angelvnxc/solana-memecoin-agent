export type SwapFlowDirection =
  | "IN"
  | "OUT";

export interface SwapBalanceFlow {
  walletAddress: string;

  mint: string;

  direction: SwapFlowDirection;

  amount: number;

  amountBefore: number;

  amountAfter: number;

  accountIndex?: number;
}

export interface SwapBalanceFlowSummary {
  walletAddress: string;

  incoming: SwapBalanceFlow[];

  outgoing: SwapBalanceFlow[];

  unknown: SwapBalanceFlow[];

  hasIncoming: boolean;

  hasOutgoing: boolean;

  analyzedAt: string;
}

export class SwapBalanceFlowEngine {
  analyze(
    walletAddress: string,
    balances: Array<{
      mint?: string;

      owner?: string;

      accountIndex?: number;

      amountBefore: number;

      amountAfter: number;
    }>,
  ): SwapBalanceFlowSummary {
    const incoming:
      SwapBalanceFlow[] = [];

    const outgoing:
      SwapBalanceFlow[] = [];

    const unknown:
      SwapBalanceFlow[] = [];

    for (
      const balance of balances
    ) {
      if (
        !balance.mint ||
        balance.owner !==
          walletAddress
      ) {
        continue;
      }

      const amountChange =
        balance.amountAfter -
        balance.amountBefore;

      if (
        !Number.isFinite(
          amountChange,
        )
      ) {
        continue;
      }

      if (
        amountChange > 0
      ) {
        incoming.push({
          walletAddress,

          mint:
            balance.mint,

          direction: "IN",

          amount:
            amountChange,

          amountBefore:
            balance.amountBefore,

          amountAfter:
            balance.amountAfter,

          accountIndex:
            balance.accountIndex,
        });

        continue;
      }

      if (
        amountChange < 0
      ) {
        outgoing.push({
          walletAddress,

          mint:
            balance.mint,

          direction: "OUT",

          amount:
            Math.abs(
              amountChange,
            ),

          amountBefore:
            balance.amountBefore,

          amountAfter:
            balance.amountAfter,

          accountIndex:
            balance.accountIndex,
        });

        continue;
      }

      unknown.push({
        walletAddress,

        mint:
          balance.mint,

        direction: "IN",

        amount: 0,

        amountBefore:
          balance.amountBefore,

        amountAfter:
          balance.amountAfter,

        accountIndex:
          balance.accountIndex,
      });
    }

    return {
      walletAddress,

      incoming,

      outgoing,

      unknown,

      hasIncoming:
        incoming.length > 0,

      hasOutgoing:
        outgoing.length > 0,

      analyzedAt:
        new Date().toISOString(),
    };
  }
}