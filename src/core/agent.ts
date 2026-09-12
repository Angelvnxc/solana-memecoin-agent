import { agentConfig } from "../config/agent.config";
import {
  stagePermissions,
  type LearningStage,
} from "../learning/stage-manager";

export class Agent {
  readonly name = "Solana Memecoin Agent";
  readonly stage: LearningStage = agentConfig.stage;

  getStatus() {
    return {
      name: this.name,
      stage: this.stage,
      permissions: stagePermissions[this.stage],
      trading: agentConfig.trading,
      wallet: agentConfig.wallet,
    };
  }
}