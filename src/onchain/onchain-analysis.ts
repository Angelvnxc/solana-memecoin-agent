export interface OnChainDistribution {
  totalWallets: number;
  totalTokenAmount: number;

  grossTop1Percentage?: number;
  grossTop5Percentage?: number;
  grossTop10Percentage?: number;

  classifiedTokenAmount: number;
  unknownTokenAmount: number;

  burnTokenAmount: number;
  exchangeTokenAmount: number;
  liquidityTokenAmount: number;
  programTokenAmount: number;

  economicallyUnclassifiedPercentage?: number;

  observations: string[];
  risks: string[];
  unknowns: string[];

  analyzedAt: string;
}

export interface OnChainAnalysis {
  tokenAddress: string;

  holders: {
    total?: number;
    topHolderConcentration?: number;
    top10Concentration?: number;
  };

  distribution?: OnChainDistribution;

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