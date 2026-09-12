import { MarketDataSource } from "../market/market-source";
import { MarketData } from "../market/market-data";
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

    let profile =
      this.profileEngine.createProfile(
        tokenAddress,
        marketData,
      );

    profile =
      this.addContextSignals(
        profile,
        marketContext,
      );

    profile =
      this.addContextFactors(
        profile,
        marketContext,
      );

    profile =
      this.addContextUnknowns(
        profile,
        marketContext,
      );

    profile =
      this.assignResearchPriority(
        profile,
        marketContext,
      );

    return {
      tokenAddress,
      marketData,
      profile,
      marketContext,
    };
  }

  private addContextSignals(
    profile: OpportunityProfile,
    context: MarketContext,
  ): OpportunityProfile {
    let updatedProfile = profile;

    for (const observation of context.observations) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          observation,
        );
    }

    return updatedProfile;
  }

  private addContextFactors(
    profile: OpportunityProfile,
    context: MarketContext,
  ): OpportunityProfile {
    let updatedProfile = profile;

    if (
      context.liquidityContext ===
      "AVAILABLE"
    ) {
      updatedProfile =
        this.profileEngine.addSupportingFactor(
          updatedProfile,
          "Usable liquidity data is available for further analysis.",
        );
    }

    if (
      context.volumeContext ===
      "AVAILABLE"
    ) {
      updatedProfile =
        this.profileEngine.addSupportingFactor(
          updatedProfile,
          "24-hour volume data is available for further analysis.",
        );
    }

    if (
      context.priceMovementContext ===
      "POSITIVE"
    ) {
      updatedProfile =
        this.profileEngine.addSupportingFactor(
          updatedProfile,
          "Recent price movement is positive and should be investigated in context.",
        );
    }

    if (
      context.priceMovementContext ===
      "NEGATIVE"
    ) {
      updatedProfile =
        this.profileEngine.addContradictingFactor(
          updatedProfile,
          "Recent price movement is negative and requires investigation.",
        );
    }

    if (
      context.liquidityContext ===
      "VERY_LOW"
    ) {
      updatedProfile =
        this.profileEngine.addContradictingFactor(
          updatedProfile,
          "Reported liquidity is very low or invalid.",
        );
    }

    if (
      context.volumeContext ===
      "VERY_LOW"
    ) {
      updatedProfile =
        this.profileEngine.addContradictingFactor(
          updatedProfile,
          "Reported 24-hour volume is very low or invalid.",
        );
    }

    if (
      context.marketCapContext ===
      "AVAILABLE"
    ) {
      updatedProfile =
        this.profileEngine.addDiscoverySignal(
          updatedProfile,
          "Market capitalization is available for contextual analysis.",
        );
    }

    return updatedProfile;
  }

  private addContextUnknowns(
    profile: OpportunityProfile,
    context: MarketContext,
  ): OpportunityProfile {
    let updatedProfile = profile;

    for (const uncertainty of context.uncertainties) {
      updatedProfile =
        this.profileEngine.addUnknown(
          updatedProfile,
          uncertainty,
        );
    }

    return updatedProfile;
  }

  private assignResearchPriority(
    profile: OpportunityProfile,
    context: MarketContext,
  ): OpportunityProfile {
    if (
      context.strength === "STRONG"
    ) {
      return this.profileEngine.setResearchPriority(
        profile,
        "HIGH",
      );
    }

    if (
      context.strength === "MODERATE"
    ) {
      return this.profileEngine.setResearchPriority(
        profile,
        "MEDIUM",
      );
    }

    return this.profileEngine.setResearchPriority(
      profile,
      "LOW",
    );
  }
}