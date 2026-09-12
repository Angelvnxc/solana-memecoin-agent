import { agentConfig } from "../config/agent.config";
import { stagePermissions } from "../learning/stage-manager";

export type AuthorizationAction =
  | "RESEARCH"
  | "OBSERVE"
  | "FORM_THESIS"
  | "PAPER_TRADE"
  | "BUY"
  | "SELL";

export interface AuthorizationResult {
  authorized: boolean;
  reason: string;
}

export class Authorization {
  authorize(
    action: AuthorizationAction,
  ): AuthorizationResult {
    const permissions = stagePermissions[agentConfig.stage];

    switch (action) {
      case "RESEARCH":
        return {
          authorized: permissions.canResearch,
          reason: permissions.canResearch
            ? "Research is authorized."
            : "Research is not authorized at the current stage.",
        };

      case "OBSERVE":
        return {
          authorized: permissions.canObserveMarket,
          reason: permissions.canObserveMarket
            ? "Market observation is authorized."
            : "Market observation is not authorized at the current stage.",
        };

      case "FORM_THESIS":
        return {
          authorized: permissions.canFormThesis,
          reason: permissions.canFormThesis
            ? "Thesis formation is authorized."
            : "Thesis formation is not authorized at the current stage.",
        };

      case "PAPER_TRADE":
        return {
          authorized: permissions.canPaperTrade,
          reason: permissions.canPaperTrade
            ? "Paper trading is authorized."
            : "Paper trading is not authorized at the current stage.",
        };

      case "BUY":
      case "SELL":
        return {
          authorized:
            permissions.canTradeReal &&
            agentConfig.trading.enabled &&
            agentConfig.trading.realTradingEnabled,
          reason:
            permissions.canTradeReal &&
            agentConfig.trading.enabled &&
            agentConfig.trading.realTradingEnabled
              ? "Real trading is authorized."
              : "Real trading is not authorized.",
        };

      default:
        return {
          authorized: false,
          reason: "Unknown action.",
        };
    }
  }
}