import { DataSource } from "./data-source";

export interface SolanaNetworkStatus {
  slot: number;
  blockHeight?: number;
  blockhash?: string;
}

export class SolanaRpcSource
  implements DataSource<SolanaNetworkStatus>
{
  readonly name = "Solana RPC";
  readonly type = "BLOCKCHAIN";

  constructor(
    private readonly rpcUrl: string,
  ) {}

  async fetch(): Promise<SolanaNetworkStatus> {
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSlot",
        params: [],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Solana RPC request failed: ${response.status}`,
      );
    }

    const data = await response.json();

    if (typeof data.result !== "number") {
      throw new Error("Invalid Solana RPC response");
    }

    return {
      slot: data.result,
    };
  }
}