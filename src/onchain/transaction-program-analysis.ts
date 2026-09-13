import {
  SwapProgramMatch,
  SwapProgramRegistry,
} from "./swap-program-registry";

export interface TransactionProgramInput {
  instructions?: Array<{
    programId?: string;
  }>;

  innerInstructions?:
    | Array<{
        instructions?: Array<{
          programId?: string;
        }>;
      }>
    | null;
}

export interface TransactionProgramAnalysis {
  uniqueProgramIds: string[];

  topLevelProgramIds: string[];

  innerProgramIds: string[];

  knownSwapPrograms: SwapProgramMatch[];

  unknownProgramIds: string[];

  hasKnownSwapProgram: boolean;

  analyzedAt: string;
}

export class TransactionProgramAnalysisEngine {
  private readonly swapProgramRegistry:
    SwapProgramRegistry;

  constructor(
    swapProgramRegistry:
      SwapProgramRegistry =
      new SwapProgramRegistry(),
  ) {
    this.swapProgramRegistry =
      swapProgramRegistry;
  }

  analyze(
    input: TransactionProgramInput,
  ): TransactionProgramAnalysis {
    const topLevelProgramIds =
      this.extractTopLevelProgramIds(
        input,
      );

    const innerProgramIds =
      this.extractInnerProgramIds(
        input,
      );

    const uniqueProgramIds =
      this.unique([
        ...topLevelProgramIds,
        ...innerProgramIds,
      ]);

    const knownSwapPrograms =
      uniqueProgramIds
        .map(
          (programId) =>
            this.swapProgramRegistry.identify(
              programId,
            ),
        )
        .filter(
          (match) =>
            match.matched &&
            match.category !==
              "UNKNOWN",
        );

    const unknownProgramIds =
      uniqueProgramIds.filter(
        (programId) =>
          !this.swapProgramRegistry.has(
            programId,
          ),
      );

    return {
      uniqueProgramIds,

      topLevelProgramIds,

      innerProgramIds,

      knownSwapPrograms,

      unknownProgramIds,

      hasKnownSwapProgram:
        knownSwapPrograms.length >
        0,

      analyzedAt:
        new Date().toISOString(),
    };
  }

  private extractTopLevelProgramIds(
    input: TransactionProgramInput,
  ): string[] {
    return (
      input.instructions ?? []
    )
      .map(
        (instruction) =>
          instruction.programId,
      )
      .filter(
        (
          programId,
        ): programId is string =>
          Boolean(programId),
      );
  }

  private extractInnerProgramIds(
    input: TransactionProgramInput,
  ): string[] {
    const programIds: string[] =
      [];

    for (
      const group of
        input.innerInstructions ?? []
    ) {
      for (
        const instruction of
          group.instructions ?? []
      ) {
        if (
          instruction.programId
        ) {
          programIds.push(
            instruction.programId,
          );
        }
      }
    }

    return programIds;
  }

  private unique(
    values: string[],
  ): string[] {
    return [
      ...new Set(values),
    ];
  }
}