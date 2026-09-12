import {
  AddressIdentity,
  AddressIdentityEngine,
  AddressIdentitySource,
} from "./address-identity";

interface SolanaRpcResponse<T> {
  result?: T;

  error?: {
    code: number;
    message: string;
  };
}

interface AccountInfoValue {
  executable?: boolean;
  owner?: string;
  lamports?: number;
  data?: unknown;
}

interface AccountInfoResult {
  value?: AccountInfoValue;
}

export class SolanaAddressIdentitySource
  implements AddressIdentitySource
{
  readonly name =
    "Solana RPC Address Identity Source";

  private readonly identityEngine =
    new AddressIdentityEngine();

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async getAddressIdentity(
    address: string,
  ): Promise<AddressIdentity> {
    const accountInfo =
      await this.getAccountInfo(address);

    if (!accountInfo) {
      return {
        address,
        type: "UNKNOWN",
        evidence: [
          "Solana RPC returned no account data for this address.",
        ],
        confidence: "LOW",
        observedAt:
          new Date().toISOString(),
      };
    }

    return this.identityEngine.classifyAccount(
      address,
      Boolean(accountInfo.executable),
      accountInfo.owner,
    );
  }

  private async getAccountInfo(
    address: string,
  ): Promise<AccountInfoValue | undefined> {
    const response =
      await this.rpcRequest<AccountInfoResult>(
        "getAccountInfo",
        [
          address,
          {
            encoding: "base64",
          },
        ],
      );

    return response?.value;
  }

  private async rpcRequest<T>(
    method: string,
    params: unknown[],
  ): Promise<T | undefined> {
    const response =
      await fetch(
        this.rpcUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method,
            params,
          }),
        },
      );

    if (!response.ok) {
      throw new Error(
        `Solana RPC request failed: ${response.status}`,
      );
    }

    const data =
      (await response.json()) as SolanaRpcResponse<T>;

    if (data.error) {
      throw new Error(
        `Solana RPC error: ${data.error.message}`,
      );
    }

    return data.result;
  }
}