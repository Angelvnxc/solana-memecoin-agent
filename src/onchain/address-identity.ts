export type AddressIdentityType =
  | "SYSTEM_ACCOUNT"
  | "PROGRAM_ACCOUNT"
  | "TOKEN_ACCOUNT"
  | "UNKNOWN";

export interface AddressIdentity {
  address: string;
  type: AddressIdentityType;
  executable?: boolean;
  ownerProgram?: string;
  evidence: string[];
  confidence: "LOW" | "MEDIUM" | "HIGH";
  observedAt: string;
}

export interface AddressIdentitySource {
  getAddressIdentity(
    address: string,
  ): Promise<AddressIdentity>;
}

const SYSTEM_PROGRAM_ID =
  "11111111111111111111111111111111";

const SPL_TOKEN_PROGRAM_ID =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

const TOKEN_2022_PROGRAM_ID =
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxu";

export class AddressIdentityEngine {
  classifyAccount(
    address: string,
    executable: boolean,
    ownerProgram?: string,
  ): AddressIdentity {
    const observedAt =
      new Date().toISOString();

    if (executable) {
      return {
        address,
        type: "PROGRAM_ACCOUNT",
        executable: true,
        ownerProgram,
        evidence: [
          "The Solana account is executable.",
          "Executable accounts are treated as program accounts.",
        ],
        confidence: "HIGH",
        observedAt,
      };
    }

    if (
      ownerProgram ===
      SYSTEM_PROGRAM_ID
    ) {
      return {
        address,
        type: "SYSTEM_ACCOUNT",
        executable: false,
        ownerProgram,
        evidence: [
          "The account is owned by the Solana System Program.",
          "The account is not executable.",
        ],
        confidence: "HIGH",
        observedAt,
      };
    }

    if (
      ownerProgram ===
        SPL_TOKEN_PROGRAM_ID ||
      ownerProgram ===
        TOKEN_2022_PROGRAM_ID
    ) {
      return {
        address,
        type: "TOKEN_ACCOUNT",
        executable: false,
        ownerProgram,
        evidence: [
          "The account is owned by a Solana token program.",
          "The account is therefore treated as a token account rather than a personal wallet.",
        ],
        confidence: "HIGH",
        observedAt,
      };
    }

    return {
      address,
      type: "UNKNOWN",
      executable: false,
      ownerProgram,
      evidence: [
        "The available account ownership evidence does not establish a known account identity.",
      ],
      confidence: "LOW",
      observedAt,
    };
  }
}