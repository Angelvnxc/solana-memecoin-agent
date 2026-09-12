import {
  ResearchEvidence,
  EvidenceType,
  ConfidenceLevel,
} from "./research-record";

import {
  SourceAssessment,
} from "./sources/source-reliability";

export interface EvidenceInput {
  type: EvidenceType;
  category: string;
  statement: string;
  source: SourceAssessment;
  confidence: ConfidenceLevel;
}

export class EvidenceEngine {
  createEvidence(
    input: EvidenceInput,
  ): ResearchEvidence {
    return {
      type: input.type,
      category: input.category,
      statement: input.statement,
      source: input.source,
      confidence: input.confidence,
    };
  }

  separateByType(
    evidence: ResearchEvidence[],
  ) {
    return {
      supporting: evidence.filter(
        (item) => item.type === "SUPPORTING",
      ),

      contradicting: evidence.filter(
        (item) => item.type === "CONTRADICTING",
      ),

      unknown: evidence.filter(
        (item) => item.type === "UNKNOWN",
      ),
    };
  }
}