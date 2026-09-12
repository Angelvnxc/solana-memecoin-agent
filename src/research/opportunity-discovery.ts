import { MarketData } from "../market/market-data";
import { MarketDataSource } from "../market/market-source";
import {
  OpportunityProfile,
  OpportunityProfileEngine,
} from "./opportunity-profile";

export interface OpportunityCandidate {
  tokenAddress: string;
  marketData: MarketData;
  profile: OpportunityProfile;
}

export class OpportunityDiscovery {
  constructor(
    private readonly marketSource: MarketDataSource,
    private readonly profileEngine: OpportunityProfileEngine,
  ) {}

  async evaluateToken(
    tokenAddress: string,
  ): Promise<OpportunityCandidate | null> {
    const marketData =
      await this.marketSource.getTokenData(tokenAddress);

    const profile =
      this.profileEngine.createProfile(
        tokenAddress,
        marketData,
      );

    let updatedProfile = profile;

    if (marketData.liquidity !== undefined) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          "Market liquidity data is available.",
        );
    } else {
      updatedProfile =
        this.profileEngine.addUnknown(
          updatedProfile,
          "Market liquidity is unknown.",
        );
    }

    if (marketData.volume24h !== undefined) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          "24-hour volume data is available.",
        );
    } else {
      updatedProfile =
        this.profileEngine.addUnknown(
          updatedProfile,
          "24-hour volume is unknown.",
        );
    }

    if (marketData.priceChange24h !== undefined) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          "24-hour price movement is available.",
        );
    } else {
      updatedProfile =
        this.profileEngine.addUnknown(
          updatedProfile,
          "24-hour price movement is unknown.",
        );
    }

    if (
      marketData.liquidity !== undefined &&
      marketData.volume24h !== undefined
    ) {
      updatedProfile =
        this.profileEngine.setResearchPriority(
          updatedProfile,
          "MEDIUM",
        );
    } else {
      updatedProfile =
        this.profileEngine.setResearchPriority(
          updatedProfile,
          "LOW",
        );
    }

    return {
      tokenAddress,
      marketData,
      profile: updatedProfile,
    };
  }
}