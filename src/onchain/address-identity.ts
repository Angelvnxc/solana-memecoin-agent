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

export class AddressIdentityEngine {
  classifyAccount(
    address: string,
    executable: boolean,
    ownerProgram?: string,
  ): AddressIdentity {
    if (executable) {
      return {
        address,
        type: "PROGRAM_ACCOUNT",
        executable: true,
        ownerProgram,
        evidence: [
          "The Solana account is executable.",
        ],
        confidence: "HIGH",
        observedAt:
          new Date().toISOString(),
      };
    }

    if (
      ownerProgram ===
      "11111111111111111111111111111111"
    ) {
      return {
        address,
        type: "SYSTEM_ACCOUNT",
        executable: false,
        ownerProgram,
        evidence: [
          "The account is owned by the Solana System Program.",
        ],
        confidence: "HIGH",
        observedAt:
          new Date().toISOString(),
      };
    }

    return {
      address,
      type: "UNKNOWN",
      executable,
      ownerProgram,
      evidence: [],
      confidence: "LOW",
      observedAt:
        new Date().toISOString(),
    };
  }
}