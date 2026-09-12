import { MarketData } from "../market/market-data";
import { MarketDataSource } from "../market/market-source";
import {
  OpportunityProfile,
  OpportunityProfileEngine,
} from "./opportunity-profile";
import {
  MarketContext,
  MarketContextEngine,
} from "./market-context";

export interface OpportunityCandidate {
  tokenAddress: string;
  marketData: MarketData;
  profile: OpportunityProfile;
  marketContext: MarketContext;
}

export class OpportunityDiscovery {
  constructor(
    private readonly marketSource: MarketDataSource,
    private readonly profileEngine: OpportunityProfileEngine,
    private readonly marketContextEngine: MarketContextEngine,
  ) {}

  async evaluateToken(
    tokenAddress: string,
  ): Promise<OpportunityCandidate | null> {
    const marketData =
      await this.marketSource.getTokenData(tokenAddress);

    const marketContext =
      this.marketContextEngine.analyze(
        marketData,
      );

    const profile =
      this.profileEngine.createProfile(
        tokenAddress,
        marketData,
      );

    let updatedProfile = profile;

    if (
      marketContext.observations.length > 0
    ) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          "Market context contains observable data.",
        );
    }

    if (
      marketContext.uncertainties.length > 0
    ) {
      for (
        const uncertainty of
        marketContext.uncertainties
      ) {
        updatedProfile =
          this.profileEngine.addUnknown(
            updatedProfile,
            uncertainty,
          );
      }
    }

    if (
      marketContext.strength === "STRONG"
    ) {
      updatedProfile =
        this.profileEngine.setResearchPriority(
          updatedProfile,
          "HIGH",
        );
    } else if (
      marketContext.strength === "MODERATE"
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
      marketContext,
    };
  }
}