export interface TokenBalanceChange {
  ownerAddress: string;
  tokenAddress: string;
  amountBefore: number;
  amountAfter: number;
  amountChange: number;
}

export interface NativeBalanceChange {
  address: string;
  amountBefore: number;
  amountAfter: number;
  amountChange: number;
}

export interface TokenTransaction {
  signature: string;

  slot: number;

  blockTime?: string;

  walletAddress: string;

  tokenAddress: string;

  tokenBalanceChanges: TokenBalanceChange[];

  nativeBalanceChanges: NativeBalanceChange[];

  programIds: string[];

  success: boolean;

  observedAt: string;
}