export type LearningStage =
  | "STAGE_0_BIRTH"
  | "STAGE_1_FUNDAMENTALS"
  | "STAGE_2_MARKET_OBSERVATION"
  | "STAGE_3_DEEP_RESEARCH"
  | "STAGE_4_THESIS_FORMATION"
  | "STAGE_5_PAPER_TRADING"
  | "STAGE_6_EVALUATION"
  | "STAGE_7_REAL_TRADING";

export const stagePermissions: Record<
  LearningStage,
  {
    canResearch: boolean;
    canObserveMarket: boolean;
    canFormThesis: boolean;
    canPaperTrade: boolean;
    canTradeReal: boolean;
  }
> = {
  STAGE_0_BIRTH: {
    canResearch: true,
    canObserveMarket: false,
    canFormThesis: false,
    canPaperTrade: false,
    canTradeReal: false,
  },

  STAGE_1_FUNDAMENTALS: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: false,
    canPaperTrade: false,
    canTradeReal: false,
  },

  STAGE_2_MARKET_OBSERVATION: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: false,
    canTradeReal: false,
  },

  STAGE_3_DEEP_RESEARCH: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: false,
    canTradeReal: false,
  },

  STAGE_4_THESIS_FORMATION: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: false,
    canTradeReal: false,
  },

  STAGE_5_PAPER_TRADING: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: true,
    canTradeReal: false,
  },

  STAGE_6_EVALUATION: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: true,
    canTradeReal: false,
  },

  STAGE_7_REAL_TRADING: {
    canResearch: true,
    canObserveMarket: true,
    canFormThesis: true,
    canPaperTrade: true,
    canTradeReal: true,
  },
};