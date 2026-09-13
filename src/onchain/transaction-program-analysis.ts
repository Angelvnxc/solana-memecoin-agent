export interface TransactionProgramObservation {
  programId: string;

  occurrenceCount: number;

  topLevel: boolean;

  inner: boolean;

  evidence: string[];
}

export interface TransactionProgramAnalysis {
  programs: TransactionProgramObservation[];

  uniqueProgramIds: string[];

  topLevelProgramIds: string[];

  innerProgramIds: string[];

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

interface TransactionProgramInput {
  instructions?: ParsedInstruction[];

  innerInstructions?: InnerInstructionGroup[] | null;
}

export class TransactionProgramAnalysisEngine {
  analyze(
    transaction: TransactionProgramInput,
  ): TransactionProgramAnalysis {
    const observations =
      new Map<
        string,
        {
          count: number;
          topLevel: boolean;
          inner: boolean;
        }
      >();

    const unknowns: string[] = [];

    const topLevelInstructions =
      transaction.instructions ?? [];

    const innerInstructionGroups =
      transaction.innerInstructions ??
      [];

    for (
      const instruction of
      topLevelInstructions
    ) {
      const programId =
        this.resolveProgramId(
          instruction,
        );

      if (!programId) {
        continue;
      }

      this.recordProgram(
        observations,
        programId,
        true,
        false,
      );
    }

    for (
      const group of
      innerInstructionGroups
    ) {
      for (
        const instruction of
        group.instructions ?? []
      ) {
        const programId =
          this.resolveProgramId(
            instruction,
          );

        if (!programId) {
          continue;
        }

        this.recordProgram(
          observations,
          programId,
          false,
          true,
        );
      }
    }

    if (
      topLevelInstructions.length ===
      0
    ) {
      unknowns.push(
        "No top-level transaction instructions were available.",
      );
    }

    if (
      innerInstructionGroups.length ===
      0
    ) {
      unknowns.push(
        "No inner instruction groups were available.",
      );
    }

    const programs =
      [...observations.entries()]
        .map(
          ([
            programId,
            observation,
          ]) => ({
            programId,

            occurrenceCount:
              observation.count,

            topLevel:
              observation.topLevel,

            inner:
              observation.inner,

            evidence:
              this.buildEvidence(
                observation,
              ),
          }),
        )
        .sort(
          (a, b) =>
            b.occurrenceCount -
            a.occurrenceCount,
        );

    return {
      programs,

      uniqueProgramIds:
        programs.map(
          (program) =>
            program.programId,
        ),

      topLevelProgramIds:
        programs
          .filter(
            (program) =>
              program.topLevel,
          )
          .map(
            (program) =>
              program.programId,
          ),

      innerProgramIds:
        programs
          .filter(
            (program) =>
              program.inner,
          )
          .map(
            (program) =>
              program.programId,
          ),

      unknowns,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private resolveProgramId(
    instruction: ParsedInstruction,
  ): string | undefined {
    if (
      instruction.programId
    ) {
      return instruction.programId;
    }

    return undefined;
  }

  private recordProgram(
    observations: Map<
      string,
      {
        count: number;
        topLevel: boolean;
        inner: boolean;
      }
    >,
    programId: string,
    topLevel: boolean,
    inner: boolean,
  ): void {
    const existing =
      observations.get(
        programId,
      );

    if (existing) {
      existing.count += 1;

      if (topLevel) {
        existing.topLevel = true;
      }

      if (inner) {
        existing.inner = true;
      }

      return;
    }

    observations.set(
      programId,
      {
        count: 1,
        topLevel,
        inner,
      },
    );
  }

  private buildEvidence(
    observation: {
      count: number;
      topLevel: boolean;
      inner: boolean;
    },
  ): string[] {
    const evidence: string[] = [];

    evidence.push(
      `The program appeared ${observation.count} time(s) in the transaction.`,
    );

    if (
      observation.topLevel
    ) {
      evidence.push(
        "The program appeared in a top-level transaction instruction.",
      );
    }

    if (
      observation.inner
    ) {
      evidence.push(
        "The program appeared in an inner instruction invoked through CPI.",
      );
    }

    return evidence;
  }
}