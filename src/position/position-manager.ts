import { TradingThesis } from "../thesis/thesis-engine";

export type PositionStatus =
  | "OPEN"
  | "CLOSED";

export interface Position {
  tokenAddress: string;
  entryPrice: number;
  quantity: number;
  status: PositionStatus;

  thesis: TradingThesis;

  openedAt: string;
  closedAt?: string;
  exitPrice?: number;
}

export class PositionManager {
  private position?: Position;

  getCurrentPosition(): Position | undefined {
    return this.position;
  }

  hasOpenPosition(): boolean {
    return this.position?.status === "OPEN";
  }

  openPosition(
    tokenAddress: string,
    entryPrice: number,
    quantity: number,
    thesis: TradingThesis,
  ): Position {
    if (this.hasOpenPosition()) {
      throw new Error(
        "Cannot open a new position while another position is open.",
      );
    }

    const position: Position = {
      tokenAddress,
      entryPrice,
      quantity,
      status: "OPEN",
      thesis,
      openedAt: new Date().toISOString(),
    };

    this.position = position;

    return position;
  }

  closePosition(exitPrice: number): Position {
    if (!this.position || this.position.status !== "OPEN") {
      throw new Error(
        "Cannot close a position when no position is open.",
      );
    }

    const closedPosition: Position = {
      ...this.position,
      status: "CLOSED",
      exitPrice,
      closedAt: new Date().toISOString(),
    };

    this.position = closedPosition;

    return closedPosition;
  }
}