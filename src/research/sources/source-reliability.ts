export type SourceReliability =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

export type DataFreshness =
  | "STALE"
  | "RECENT"
  | "FRESH"
  | "REAL_TIME";

export interface SourceAssessment {
  source: string;
  reliability: SourceReliability;
  freshness: DataFreshness;

  observedAt: string;

  notes: string[];
}

export interface SourcedData<T> {
  value: T;
  source: SourceAssessment;
}

export class SourceReliabilityEngine {
  assess(
    source: string,
    reliability: SourceReliability,
    freshness: DataFreshness,
    notes: string[] = [],
  ): SourceAssessment {
    return {
      source,
      reliability,
      freshness,
      observedAt: new Date().toISOString(),
      notes,
    };
  }

  wrap<T>(
    value: T,
    assessment: SourceAssessment,
  ): SourcedData<T> {
    return {
      value,
      source: assessment,
    };
  }
}