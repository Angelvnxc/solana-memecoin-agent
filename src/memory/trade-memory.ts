import { TradingThesis } from "../thesis/thesis-engine";

export type TradeOutcome =
  | "PROFIT"
  | "LOSS"
  | "BREAK_EVEN"
  | "UNKNOWN";

export interface TradeMemory {
  tradeId: string;
  tokenAddress: string;

  thesis: TradingThesis;

  entry: {
    price: number;
    timestamp: string;
    reason: string;
  };

  exit?: {
    price: number;
    timestamp: string;
    reason: string;
  };

  outcome: TradeOutcome;

  result?: {
    absolute: number;
    percentage: number;
  };

  expectations: string[];
  observations: string[];

  mistakes: string[];
  lessons: string[];

  thesisValidated?: boolean;

  createdAt: string;
}

export class TradeMemoryStore {
  private readonly memories: TradeMemory[] = [];

  save(memory: TradeMemory): void {
    this.memories.push(memory);
  }

  getAll(): TradeMemory[] {
    return [...this.memories];
  }

  getByToken(tokenAddress: string): TradeMemory[] {
    return this.memories.filter(
      (memory) => memory.tokenAddress === tokenAddress,
    );
  }
}