import { Position } from "../position/position-manager";
import { TradeOutcome } from "../memory/trade-memory";

export interface TradeReview {
  tradeId: string;
  tokenAddress: string;

  outcome: TradeOutcome;

  thesisAssessment: {
    validated: boolean;
    reason: string;
  };

  expectations: string[];
  observations: string[];

  mistakes: string[];
  lessons: string[];

  reviewedAt: string;
}

export class TradeReviewEngine {
  reviewPosition(
    position: Position,
    outcome: TradeOutcome,
    thesisValidated: boolean,
    thesisReason: string,
    expectations: string[],
    observations: string[],
    mistakes: string[],
    lessons: string[],
  ): TradeReview {
    if (position.status !== "CLOSED") {
      throw new Error(
        "A trade must be closed before it can be reviewed.",
      );
    }

    return {
      tradeId: `${position.tokenAddress}-${position.openedAt}`,

      tokenAddress: position.tokenAddress,

      outcome,

      thesisAssessment: {
        validated: thesisValidated,
        reason: thesisReason,
      },

      expectations,
      observations,

      mistakes,
      lessons,

      reviewedAt: new Date().toISOString(),
    };
  }
}