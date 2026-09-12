export interface OnChainAnalysis {
  tokenAddress: string;

  holders: {
    total?: number;
    topHolderConcentration?: number;
    top10Concentration?: number;
  };

  developer: {
    walletAddress?: string;
    tokenAllocation?: number;
    recentActivity?: string;
  };

  wallets: {
    notableWallets?: string[];
    accumulation?: string;
    distribution?: string;
    suspiciousActivity?: string;
  };

  liquidity: {
    providerCount?: number;
    concentration?: number;
    recentChanges?: string;
  };

  activity: {
    transactionCount24h?: number;
    uniqueWallets24h?: number;
    buyerSellerBalance?: string;
  };

  risks: string[];
  unknowns: string[];
}