import { agentConfig } from "../config/agent.config";
import { stagePermissions } from "../learning/stage-manager";
import { TradingThesis } from "../thesis/thesis-engine";

export type Decision =
  | "BUY"
  | "HOLD"
  | "SELL"
  | "OBSERVE"
  | "IGNORE"
  | "DO_NOTHING";

export interface DecisionResult {
  decision: Decision;
  reason: string;
  thesisConfidence: TradingThesis["confidence"];
}

export class DecisionEngine {
  evaluate(thesis: TradingThesis): DecisionResult {
    const permissions = stagePermissions[agentConfig.stage];

    if (!permissions.canTradeReal) {
      return {
        decision: "OBSERVE",
        reason:
          "Real trading is not authorized at the current learning stage.",
        thesisConfidence: thesis.confidence,
      };
    }

    return {
      decision: "DO_NOTHING",
      reason:
        "No execution policy is currently authorized.",
      thesisConfidence: thesis.confidence,
    };
  }
}