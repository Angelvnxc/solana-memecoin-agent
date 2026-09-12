import { agentConfig } from "../config/agent.config";
import { Position } from "../position/position-manager";

export type ExecutionAction =
  | "BUY"
  | "SELL";

export interface TradeRequest {
  action: ExecutionAction;
  tokenAddress: string;
  amount: number;
  reason: string;
}

export interface ExecutionResult {
  success: boolean;
  action: ExecutionAction;
  tokenAddress: string;
  message: string;
}

export class TradeExecutor {
  execute(request: TradeRequest): ExecutionResult {
    if (!agentConfig.trading.enabled) {
      return {
        success: false,
        action: request.action,
        tokenAddress: request.tokenAddress,
        message: "Trading is disabled by configuration.",
      };
    }

    if (!agentConfig.trading.realTradingEnabled) {
      return {
        success: false,
        action: request.action,
        tokenAddress: request.tokenAddress,
        message: "Real trading is not enabled.",
      };
    }

    return {
      success: false,
      action: request.action,
      tokenAddress: request.tokenAddress,
      message:
        "Trade execution is not implemented yet.",
    };
  }
}