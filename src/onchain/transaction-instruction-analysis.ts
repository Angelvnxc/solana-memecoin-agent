export type TransactionInstructionType =
  | "TOKEN_TRANSFER"
  | "TOKEN_TRANSFER_CHECKED"
  | "SWAP"
  | "CREATE_ACCOUNT"
  | "CLOSE_ACCOUNT"
  | "APPROVE"
  | "REVOKE"
  | "UNKNOWN";

export interface TransactionInstructionObservation {
  type: TransactionInstructionType;

  programId?: string;

  instructionType?: string;

  topLevel: boolean;

  inner: boolean;

  evidence: string[];

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
}

export interface TransactionInstructionAnalysis {
  instructions: TransactionInstructionObservation[];

  detectedTypes:
    TransactionInstructionType[];

  hasTokenTransfer: boolean;

  hasSwapInstruction: boolean;

  hasAccountCreation: boolean;

  hasAccountClosure: boolean;

  unknowns: string[];

  analyzedAt: string;
}

interface ParsedInstruction {
  programId?: string;

  program?: string;

  parsed?: {
    type?: string;

    info?: unknown;
  };
}

interface InnerInstructionGroup {
  instructions?: ParsedInstruction[];
}

export interface TransactionInstructionInput {
  instructions?: ParsedInstruction[];

  innerInstructions?:
    | InnerInstructionGroup[]
    | null;
}

export class TransactionInstructionAnalysisEngine {
  analyze(
    transaction: TransactionInstructionInput,
  ): TransactionInstructionAnalysis {
    const observations:
      TransactionInstructionObservation[] =
      [];

    const unknowns: string[] = [];

    for (
      const instruction of
      transaction.instructions ?? []
    ) {
      observations.push(
        this.analyzeInstruction(
          instruction,
          true,
          false,
        ),
      );
    }

    for (
      const group of
      transaction.innerInstructions ?? []
    ) {
      for (
        const instruction of
        group.instructions ?? []
      ) {
        observations.push(
          this.analyzeInstruction(
            instruction,
            false,
            true,
          ),
        );
      }
    }

    const detectedTypes =
      this.uniqueTypes(
        observations,
      );

    const hasTokenTransfer =
      observations.some(
        (observation) =>
          observation.type ===
            "TOKEN_TRANSFER" ||
          observation.type ===
            "TOKEN_TRANSFER_CHECKED",
      );

    const hasSwapInstruction =
      observations.some(
        (observation) =>
          observation.type ===
          "SWAP",
      );

    const hasAccountCreation =
      observations.some(
        (observation) =>
          observation.type ===
          "CREATE_ACCOUNT",
      );

    const hasAccountClosure =
      observations.some(
        (observation) =>
          observation.type ===
          "CLOSE_ACCOUNT",
      );

    if (
      observations.length === 0
    ) {
      unknowns.push(
        "No parsed transaction instructions were available.",
      );
    }

    if (
      observations.some(
        (observation) =>
          observation.type ===
          "UNKNOWN",
      )
    ) {
      unknowns.push(
        "One or more instructions could not be classified from the available parsed instruction data.",
      );
    }

    return {
      instructions:
        observations,

      detectedTypes,

      hasTokenTransfer,

      hasSwapInstruction,

      hasAccountCreation,

      hasAccountClosure,

      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private analyzeInstruction(
    instruction: ParsedInstruction,
    topLevel: boolean,
    inner: boolean,
  ): TransactionInstructionObservation {
    const programId =
      instruction.programId;

    const instructionType =
      instruction.parsed?.type;

    const normalizedType =
      instructionType
        ?.toLowerCase()
        .trim();

    if (
      normalizedType ===
      "transfer"
    ) {
      return {
        type:
          this.isTokenProgram(
            programId,
          )
            ? "TOKEN_TRANSFER"
            : "UNKNOWN",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          "The parsed instruction type is transfer.",
        ],

        confidence:
          this.isTokenProgram(
            programId,
          )
            ? "HIGH"
            : "LOW",
      };
    }

    if (
      normalizedType ===
      "transferchecked"
    ) {
      return {
        type:
          this.isTokenProgram(
            programId,
          )
            ? "TOKEN_TRANSFER_CHECKED"
            : "UNKNOWN",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          "The parsed instruction type is transferChecked.",
        ],

        confidence:
          this.isTokenProgram(
            programId,
          )
            ? "HIGH"
            : "LOW",
      };
    }

    if (
      normalizedType ===
        "swap" ||
      normalizedType ===
        "swapexactin" ||
      normalizedType ===
        "swapexactout"
    ) {
      return {
        type: "SWAP",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          `The parsed instruction type is ${instructionType}.`,
          "The instruction is explicitly represented as a swap by the parsed transaction data.",
        ],

        confidence: "HIGH",
      };
    }

    if (
      normalizedType ===
        "createAccount" ||
      normalizedType ===
        "createAccountWithSeed"
    ) {
      return {
        type: "CREATE_ACCOUNT",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          `The parsed instruction type is ${instructionType}.`,
        ],

        confidence: "HIGH",
      };
    }

    if (
      normalizedType ===
      "closeAccount"
    ) {
      return {
        type: "CLOSE_ACCOUNT",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          "The parsed instruction type is closeAccount.",
        ],

        confidence: "HIGH",
      };
    }

    if (
      normalizedType ===
      "approve"
    ) {
      return {
        type: "APPROVE",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          "The parsed instruction type is approve.",
        ],

        confidence: "HIGH",
      };
    }

    if (
      normalizedType ===
      "revoke"
    ) {
      return {
        type: "REVOKE",

        programId,

        instructionType,

        topLevel,

        inner,

        evidence: [
          "The parsed instruction type is revoke.",
        ],

        confidence: "HIGH",
      };
    }

    return {
      type: "UNKNOWN",

      programId,

      instructionType,

      topLevel,

      inner,

      evidence: [
        instructionType
          ? `The parsed instruction type ${instructionType} is not currently classified by the transaction analysis engine.`
          : "The instruction does not contain a recognized parsed instruction type.",
      ],

      confidence: "LOW",
    };
  }

  private isTokenProgram(
    programId:
      | string
      | undefined,
  ): boolean {
    return (
      programId ===
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" ||
      programId ===
        "TokenzQdBNbLqP5VEHdkAS6EPFLC1PHnBqCXEpPxu"
    );
  }

  private uniqueTypes(
    observations:
      TransactionInstructionObservation[],
  ): TransactionInstructionType[] {
    return [
      ...new Set(
        observations.map(
          (observation) =>
            observation.type,
        ),
      ),
    ];
  }
}