import { agentConfig } from "../config/agent.config";

export function getAgentStatus() {
  return {
    stage: agentConfig.stage,
    tradingEnabled: agentConfig.trading.enabled,
    paperTradingEnabled: agentConfig.trading.paperTradingEnabled,
    realTradingEnabled: agentConfig.trading.realTradingEnabled,
    maxOpenPositions: agentConfig.trading.maxOpenPositions,
    withdrawalsAllowed: agentConfig.wallet.withdrawalsAllowed,
    transfersAllowed: agentConfig.wallet.transfersAllowed,
  };
}