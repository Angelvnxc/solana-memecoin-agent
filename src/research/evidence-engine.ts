import {
  ResearchEvidence,
  EvidenceType,
  ConfidenceLevel,
} from "./research-record";

export interface EvidenceInput {
  type: EvidenceType;
  category: string;
  statement: string;
  source: string;
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