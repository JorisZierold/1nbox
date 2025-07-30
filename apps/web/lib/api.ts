import axios, { AxiosInstance } from "axios";
import { oneInchQueue } from "./request-queue";
import type { OneInchTokenMetadata, HistoryResponse } from "./types";

interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  async getWalletBalances(chainId: string, address: string): Promise<any> {
    return oneInchQueue.add(async () => {
      try {
        console.log(`Fetching balances for ${address} on chain ${chainId}`);

        const response = await this.client.get(
          `/balances/${chainId}/${address}`
        );

        console.log("Balance response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Balance fetch error:", error);
        throw new Error(
          `Failed to fetch balances: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTokenPrices(chainId: string, tokens: string[]): Promise<any> {
    return oneInchQueue.add(async () => {
      try {
        if (!tokens.length) return {};

        console.log(`Fetching prices for tokens on chain ${chainId}:`, tokens);

        const response = await this.client.post(`/prices/${chainId}`, {
          params: {
            tokens: tokens,
            currency: "USD",
          },
        });

        console.log("Price response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Price fetch error:", error);
        throw new Error(
          `Failed to fetch prices: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTokenMetadata(chainId: string): Promise<OneInchTokenMetadata> {
    return oneInchQueue.add(async () => {
      try {
        console.log(`Fetching metadata for chain ${chainId}`);

        const response = await this.client.get(`/token/${chainId}`);
        return response.data as OneInchTokenMetadata;
      } catch (error: any) {
        console.error("Token metadata error:", error);
        throw new Error(
          `Failed to fetch metadata: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }

  async getTransactionHistory(
    address: string,
    chainId?: string,
    limit?: number
  ): Promise<HistoryResponse> {
    return oneInchQueue.add(async () => {
      try {
        console.log(`Fetching history for ${address}`);

        const params = new URLSearchParams();
        if (chainId) params.append("chainId", chainId);
        if (limit) params.append("limit", limit.toString());

        const response = await this.client.get(
          `/history/${address}?${params.toString()}`
        );

        console.log("History response:", response.data);
        return response.data as HistoryResponse;
      } catch (error: any) {
        console.error("History fetch error:", error);
        throw new Error(
          `Failed to fetch transaction history: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    });
  }
}

export default new ApiService();
