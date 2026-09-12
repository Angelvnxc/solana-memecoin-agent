import {
  Position,
  PositionStatus,
} from "./position-manager";

export type ThesisState =
  | "VALID"
  | "WEAKENING"
  | "INVALIDATED"
  | "UNKNOWN";

export interface PositionAssessment {
  tokenAddress: string;
  status: PositionStatus;
  thesisState: ThesisState;
  reason: string;
  assessedAt: string;
}

export class PositionMonitor {
  assessPosition(
    position: Position,
    thesisState: ThesisState,
    reason: string,
  ): PositionAssessment {
    return {
      tokenAddress: position.tokenAddress,
      status: position.status,
      thesisState,
      reason,
      assessedAt: new Date().toISOString(),
    };
  }
}