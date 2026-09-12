export interface HolderAccountBalance {
  walletAddress: string;
  tokenAmount: number;
}

export interface AggregatedHolderBalance {
  walletAddress: string;
  tokenAmount: number;
  tokenAccountCount: number;
}

export class HolderAggregationEngine {
  aggregate(
    accounts: HolderAccountBalance[],
  ): AggregatedHolderBalance[] {
    const balances = new Map<
      string,
      AggregatedHolderBalance
    >();

    for (const account of accounts) {
      if (
        !account.walletAddress ||
        !Number.isFinite(account.tokenAmount) ||
        account.tokenAmount <= 0
      ) {
        continue;
      }

      const existing =
        balances.get(account.walletAddress);

      if (existing) {
        existing.tokenAmount +=
          account.tokenAmount;

        existing.tokenAccountCount += 1;
        continue;
      }

      balances.set(
        account.walletAddress,
        {
          walletAddress:
            account.walletAddress,

          tokenAmount:
            account.tokenAmount,

          tokenAccountCount: 1,
        },
      );
    }

    return [...balances.values()].sort(
      (a, b) =>
        b.tokenAmount -
        a.tokenAmount,
    );
  }
}