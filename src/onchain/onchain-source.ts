import { OnChainAnalysis } from "./onchain-analysis";

export interface OnChainDataSource {
  readonly name: string;

  analyzeToken(tokenAddress: string): Promise<OnChainAnalysis>;
}