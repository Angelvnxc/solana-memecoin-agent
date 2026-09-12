import { ResearchEngine } from "../research-engine";
import { ResearchRecord } from "../research-record";
import { OpportunityCandidate } from "../opportunity-discovery";
import { OnChainAnalysis } from "../../onchain/onchain-analysis";
import { MarketActivity } from "../../market/market-activity";

export interface ResearchContext {
  candidate: OpportunityCandidate;
  onChain?: OnChainAnalysis;
  marketActivity?: MarketActivity;
}

export class ResearchOrchestrator {
  constructor(
    private readonly researchEngine: ResearchEngine,
  ) {}

  startResearch(
    candidate: OpportunityCandidate,
  ): ResearchRecord {
    const research =
      this.researchEngine.createEmptyResearch(
        candidate.tokenAddress,
      );

    return {
      ...research,

      symbol:
        candidate.marketData.symbol,

      name:
        candidate.marketData.name,

      market: {
        price:
          candidate.marketData.price,

        marketCap:
          candidate.marketData.marketCap,

        volume24h:
          candidate.marketData.volume24h,

        liquidity:
          candidate.marketData.liquidity,
      },

      marketActivity: {
        volume24h:
          candidate.marketData.volume24h,

        observedAt:
          candidate.marketContext.createdAt,
      },
    };
  }

  incorporateMarketActivity(
    research: ResearchRecord,
    activity: MarketActivity,
  ): ResearchRecord {
    return {
      ...research,

      marketActivity: {
        volume24h:
          activity.volume24h,

        transactionCount24h:
          activity.transactionCount24h,

        buyCount24h:
          activity.buyCount24h,

        sellCount24h:
          activity.sellCount24h,

        uniqueBuyers24h:
          activity.uniqueBuyers24h,

        uniqueSellers24h:
          activity.uniqueSellers24h,

        buySellRatio:
          activity.buySellRatio,

        observedAt:
          activity.observedAt,
      },
    };
  }

  incorporateOnChainData(
    research: ResearchRecord,
    onChain: OnChainAnalysis,
  ): ResearchRecord {
    return {
      ...research,

      holders: {
        total:
          onChain.holders.total,

        concentration:
          onChain.holders.top10Concentration,
      },

      onChain: {
        developerActivity:
          onChain.developer.recentActivity,

        walletBehavior:
          onChain.wallets.accumulation,

        liquidityBehavior:
          onChain.liquidity.recentChanges,
      },

      risks: [
        ...research.risks,
        ...onChain.risks,
      ],

      unknowns: [
        ...research.unknowns,
        ...onChain.unknowns,
      ],
    };
  }
}