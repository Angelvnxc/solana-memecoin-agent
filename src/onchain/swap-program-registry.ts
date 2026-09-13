export type SwapProgramCategory =
  | "AGGREGATOR"
  | "DEX"
  | "UNKNOWN";

export interface SwapProgramDefinition {
  programId: string;

  name: string;

  category: SwapProgramCategory;

  description: string;

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
}

export interface SwapProgramMatch {
  programId: string;

  name: string;

  category: SwapProgramCategory;

  description: string;

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  matched: boolean;
}

const JUPITER_V6_PROGRAM_ID =
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";

export class SwapProgramRegistry {
  private readonly programs:
    Map<string, SwapProgramDefinition>;

  constructor(
    definitions: SwapProgramDefinition[] =
      SwapProgramRegistry.defaultDefinitions(),
  ) {
    this.programs =
      new Map<string, SwapProgramDefinition>();

    for (
      const definition of definitions
    ) {
      this.register(definition);
    }
  }

  register(
    definition: SwapProgramDefinition,
  ): void {
    if (
      !definition.programId ||
      !definition.name
    ) {
      return;
    }

    this.programs.set(
      definition.programId,
      definition,
    );
  }

  registerMany(
    definitions: SwapProgramDefinition[],
  ): void {
    for (
      const definition of definitions
    ) {
      this.register(definition);
    }
  }

  get(
    programId: string,
  ): SwapProgramDefinition | undefined {
    return this.programs.get(
      programId,
    );
  }

  identify(
    programId: string,
  ): SwapProgramMatch {
    const definition =
      this.get(programId);

    if (!definition) {
      return {
        programId,

        name:
          "Unknown Program",

        category:
          "UNKNOWN",

        description:
          "The program ID is not currently present in the swap-program registry.",

        confidence:
          "LOW",

        matched: false,
      };
    }

    return {
      programId:
        definition.programId,

      name:
        definition.name,

      category:
        definition.category,

      description:
        definition.description,

      confidence:
        definition.confidence,

      matched: true,
    };
  }

  identifyMany(
    programIds: string[],
  ): SwapProgramMatch[] {
    return programIds.map(
      (programId) =>
        this.identify(programId),
    );
  }

  has(
    programId: string,
  ): boolean {
    return this.programs.has(
      programId,
    );
  }

  getAll(): SwapProgramDefinition[] {
    return [
      ...this.programs.values(),
    ];
  }

  private static defaultDefinitions():
    SwapProgramDefinition[] {
    return [
      {
        programId:
          JUPITER_V6_PROGRAM_ID,

        name:
          "Jupiter v6",

        category:
          "AGGREGATOR",

        description:
          "Jupiter v6 swap aggregator program on Solana.",

        confidence:
          "HIGH",
      },
    ];
  }
}