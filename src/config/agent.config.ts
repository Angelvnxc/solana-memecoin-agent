export const agentConfig = {
  stage: "STAGE_0_BIRTH",

  trading: {
    enabled: false,
    paperTradingEnabled: false,
    realTradingEnabled: false,
    maxOpenPositions: 1,
  },

  wallet: {
    withdrawalsAllowed: false,
    transfersAllowed: false,
    restrictionsModifiable: false,
  },

  market: {
    chain: "solana",
    assetType: "memecoin",
    mode: "spot",
  },

  protocols: {
    liquidityProvision: false,
    yieldFarming: false,
    protocolInvestment: false,
  },
} as const;