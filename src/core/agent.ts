export class Agent {
  readonly name = "Solana Memecoin Agent";
  readonly stage = "STAGE_0_BIRTH";

  getStatus() {
    return {
      name: this.name,
      stage: this.stage,
      tradingEnabled: false,
      paperTradingEnabled: false,
      realTradingEnabled: false,
    };
  }
}